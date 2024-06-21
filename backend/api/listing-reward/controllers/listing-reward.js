"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const _ = require("lodash");

module.exports = {
  countListingRewards: async (ctx) => {
    const { _start, _limit, _where } = ctx.params;

    const knex = strapi.connections.postgres;
    try {
      const queryBuilder = knex("listing_rewards");

      queryBuilder
        .leftJoin(
          "listing_rewards__listings",
          "listing_rewards.id",
          "listing_rewards__listings.listing_reward_id"
        )
        .leftJoin(
          "listings",
          "listings.id",
          "listing_rewards__listings.listing_id"
        )
        .leftJoin(
          "listing_rewards__rewards",
          "listing_rewards.id",
          "listing_rewards__rewards.listing_reward_id"
        )
        .leftJoin(
          "rewards",
          "rewards.id",
          "listing_rewards__rewards.reward_id"
        );

      const addJoinForOwner = () => {
        queryBuilder.leftJoin(
          "bids",
          "bids.listing_reward",
          "listing_rewards.id"
        );
      };

      const addJoinForItemMajorCategory = () => {
        queryBuilder.leftJoin("items", "items.id", "listings.item");
      };

      const addJoinForItemSubCategory = () => {
        queryBuilder.leftJoin(
          "items__sub_categories",
          "items.id",
          "items__sub_categories.item_id"
        );
      };

      if (_where.owner) {
        addJoinForOwner();
      }
      if (_where.itemMajorCategory) {
        addJoinForItemMajorCategory();
      }
      if (_where.itemSubCategory) {
        if (!_where.itemMajorCategory) addJoinForItemMajorCategory();
        addJoinForItemSubCategory();
      }

      queryBuilder.where(function () {
        this.where(function () {
          if (_where.game) {
            this.where("listings.game", _where.game).orWhere(
              "rewards.game",
              _where.game
            );
          }
          if (_where.owner) {
            this.where("listing_rewards.owner", _where.owner).orWhere(
              "bids.owner",
              _where.owner
            );
          }
        });

        if (
          _where.itemMajorCategory ||
          _where.itemSubCategory ||
          _where.itemProperty ||
          _where.rewardGame ||
          _where.seekingBalance
        ) {
          this.andWhere(function () {
            if (_where.itemMajorCategory) {
              this.orWhereIn("items.majorCategory", _where.itemMajorCategory);
            }
            if (_where.itemSubCategory) {
              this.orWhereIn(
                "items__sub_categories.item-sub-category_id",
                _where.itemSubCategory
              );
            }
            if (_where.itemProperty) {
              for (let property in _where.itemProperty) {
                const value = _where.itemProperty[property];
                value.min &&
                  this.orWhereRaw(
                    `listings.values #> '{${property}}' >= ?`,
                    value.min
                  ).orWhereRaw(
                    `rewards.values #> '{${property}}' >= ?`,
                    value.min
                  );
                value.max &&
                  this.orWhereRaw(
                    `listings.values #> '{${property}}' <= ?`,
                    value.max
                  ).orWhereRaw(
                    `rewards.values #> '{${property}}' <= ?`,
                    value.max
                  );
                value.value &&
                  this.orWhereRaw(
                    `listings.values ->> '{${property}}' LIKE ?`,
                    value.value
                  ).orWhereRaw(
                    `rewards.values ->> '{${property}}' LIKE ?`,
                    value.value
                  );
              }
            }
            if (_where.rewardGame) {
              this.orWhereIn("rewards.game", _where.rewardGame);
            }
            if (_where.seekingBalance) {
              const { min, max } = _where.seekingBalance;

              min && this.orWhere("rewards.balance", ">=", min);
              max && this.orWhere("rewards.balance", "<=", max);
            }
          });
        }
      });
      // console.log(
      //   queryBuilder
      //     .select("listing_rewards.id as id")
      //     .groupBy("listing_rewards.id")
      //     .count("listing_rewards.id as count")
      //     .toString()
      // );
      queryBuilder
        .select("listing_rewards.id as id")
        .groupBy("listing_rewards.id")
        .count("listing_rewards.id as count");

      const result = await queryBuilder;
      const ids = await queryBuilder.limit(_limit).offset(_start);

      return { total: result.length, IDs: ids.map((id) => id.id) };
    } catch (error) {
      console.log(error);

      return { total: 0, IDs: [] };
    }
  },
  countVisitingListingReward: async (ctx) => {
    const { listingRewardID } = ctx.request.body;
    const { user } = ctx.state;

    try {
      const listingReward = await strapi
        .query("listing-reward")
        .findOne({ id: listingRewardID });

      const visitedUsers = [
        ...listingReward.visitedUsers.map((user) => user.id),
      ];

      if (
        visitedUsers.includes(user.id) ||
        user.id === listingReward.owner.id
      ) {
        return listingReward.visits;
      }

      const updatedListingReward = await strapi.query("listing-reward").update(
        { id: listingRewardID },
        {
          visits: visitedUsers.length + 1,
          visitedUsers: [...visitedUsers, user.id],
        }
      );

      return updatedListingReward.visits;
    } catch (error) {
      console.log(error);

      throw new Error(error);
    }
  },
};
