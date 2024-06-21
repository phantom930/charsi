"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const completeTradeForBuyer = async (trade) => {
  try {
    const updateData = {
      isBuyerConfirmed: true,
      status: "TRADED",
    };

    if (!trade.isSellerConfirmed) {
      updateData.isSellerConfirmed = true;
    }

    let listingOwner = await strapi
      .query("user", "users-permissions")
      .findOne({ id: trade.listing_reward.owner });
    let bidOwner = await strapi
      .query("user", "users-permissions")
      .findOne({ id: trade.bid.owner });

    const existingReport = await strapi
      .query("scam-report")
      .findOne({ trade: trade.id, accusedUser: listingOwner.id });
    if (existingReport)
      throw new Error(
        "You can't complete this trade because you have already reported this user for scamming"
      );

    for (let reward of trade.bid.rewards) {
      if (reward.type === "BALANCE") {
        const transaction =
          await strapi.controllers.stripe.moveBalanceToCustomer({
            senderCustomerID: bidOwner.stripeCustomerID,
            recipientCustomerID: listingOwner.stripeCustomerID,
            amount: reward.balance,
          });

        listingOwner.balance = Number(transaction.recipientBalance / 100);
        bidOwner.balance = Number(transaction.senderBalance / 100);
      }
    }

    await strapi.query("user", "users-permissions").update(
      { id: listingOwner.id },
      {
        trades: Number(listingOwner.trades + 1),
        balance: listingOwner.balance,
      }
    );
    await strapi.query("user", "users-permissions").update(
      { id: bidOwner.id },
      {
        trades: Number(bidOwner.trades + 1),
        balance: bidOwner.balance,
      }
    );
    const updatedTrade = await strapi.services.trade.update(
      { id: trade.id },
      updateData
    );

    return updatedTrade;
  } catch (error) {
    console.log("error: ", error);
    throw new Error(error);
  }
};

module.exports = {
  markTradeAsCompletedForSeller: async (ctx) => {
    const { user } = ctx.state;
    const { id, proofs } = ctx.request.body;

    try {
      const trade = await strapi.services.trade.findOne({ id });
      if (trade.listing_reward.owner !== user.id) {
        throw new Error("You can't mark this trade as completed");
      }

      const updateData = {
        isSellerConfirmed: true,
        proofs: proofs,
      };

      if (trade.isBuyerConfirmed) updateData.status = "TRADED";

      const updatedTrade = await strapi.services.trade.update(
        { id },
        updateData
      );

      if (!trade.isBuyerConfirmed) {
        setTimeout(async () => {
          const trade = await strapi.services.trade.findOne({ id }, [
            "listing_reward",
            "bid.rewards",
          ]);
          if (!trade.isBuyerConfirmed) {
            await completeTradeForBuyer(trade);
          }
        }, 1000 * 3600 * (Number(process.env.TRADE_COMPLETION_AWAITING_HOURS) || 12));
      }

      const { ENUM_NOTIFICATION_TYPE } = strapi.api.notification.const.index;
      const sender = await strapi
        .query("user", "users-permissions")
        .findOne({ id: user.id });
      const recipient = await strapi
        .query("user", "users-permissions")
        .findOne({ id: trade.bid.owner });

      if (trade.isBuyerConfirmed) {
        await strapi.query("user", "users-permissions").update(
          { id: sender.id },
          {
            trades: Number(sender.trades + 1),
          }
        );
        await strapi.query("user", "users-permissions").update(
          { id: recipient.id },
          {
            trades: Number(recipient.trades + 1),
          }
        );
      }

      strapi.controllers.notification.sendNewNotification({
        sender: sender,
        recipient: recipient,
        type: ENUM_NOTIFICATION_TYPE.PurchasedMyListing,
        trade: trade,
      });

      return updatedTrade;
    } catch (error) {
      console.log(error);

      throw new Error(error);
    }
  },
  markTradeAsCompletedForBuyer: async (ctx) => {
    const { user } = ctx.state;
    const { id } = ctx.request.body;

    try {
      const trade = await strapi.services.trade.findOne({ id }, [
        "listing_reward",
        "bid.rewards",
      ]);
      if (trade.bid.owner !== user.id) {
        throw new Error("You can't mark this trade as completed");
      }

      return await completeTradeForBuyer(trade);
    } catch (error) {
      console.log(error);

      throw new Error(error);
    }
  },
  getLatestSuccessTradesByGame: async (ctx) => {
    const { _limit, _where } = ctx.params;

    const knex = strapi.connections.postgres;
    try {
      const queryBuilder = knex("trades");

      queryBuilder
        .leftJoin(
          "listing_rewards",
          "trades.listing_reward",
          "listing_rewards.id"
        )
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

      queryBuilder
        .where("status", "TRADED")
        .where(function () {
          this.where("listings.game", _where.game).orWhere(
            "rewards.game",
            _where.game
          );
        })
        .groupBy("trades.id")
        .select("trades.*")
        .orderBy("updated_at", "desc")
        .limit(_limit || 5);

      const result = await queryBuilder;

      return result;
    } catch (error) {
      console.log(error);

      return [];
    }
  },
};
