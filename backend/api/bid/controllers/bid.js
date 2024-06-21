"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  createNewBid: async (ctx) => {
    const { user } = ctx.state;

    try {
      const bid = await strapi.services.bid.create({
        ...ctx.request.body,
        owner: user.id,
        created_by: user.id,
        updated_by: user.id,
      });

      const { ENUM_NOTIFICATION_TYPE } = strapi.api.notification.const.index;
      const sender = await strapi
        .query("user", "users-permissions")
        .findOne({ id: user.id });
      const recipient = await strapi
        .query("user", "users-permissions")
        .findOne({ id: bid.listing_reward.owner });

      strapi.controllers.notification.sendNewNotification({
        sender: sender,
        recipient: recipient,
        type: ENUM_NOTIFICATION_TYPE.BidOnMyListing,
        bid: bid,
      });

      return { bid: bid };
    } catch (error) {
      console.log("error", error);
      throw new Error(error);
    }
  },
  updateBidStatus: async (ctx) => {
    const { bidID, status } = ctx.request.body;
    const { user } = ctx.state;

    try {
      const bid = await strapi.query("bid").findOne({ id: bidID });
      if (bid.listing_reward.owner !== user.id) {
        throw new Error("You are not the owner of this listing");
      }

      const updatedBid = await strapi.services.bid.update(
        { id: bidID },
        {
          status: status,
          updated_by: user.id,
        }
      );

      const { ENUM_NOTIFICATION_TYPE } = strapi.api.notification.const.index;
      const sender = await strapi
        .query("user", "users-permissions")
        .findOne({ id: user.id });
      const recipient = await strapi
        .query("user", "users-permissions")
        .findOne({ id: updatedBid.owner.id });

      if (
        updatedBid.status === "ACCEPTED" ||
        updatedBid.status === "DECLINED"
      ) {
        let tradeID;
        if (updatedBid.status === "ACCEPTED") {
          const trade = await strapi.query("trade").findOne({
            listing_reward: updatedBid.listing_reward.id,
            bid: updatedBid.id,
            status: "TRADING",
          });

          if (!trade) throw new Error("Trade not found");
          tradeID = trade.id;
        }

        strapi.controllers.notification.sendNewNotification({
          sender: sender,
          recipient: recipient,
          type:
            updatedBid.status === "ACCEPTED"
              ? ENUM_NOTIFICATION_TYPE.MyOfferAccepted
              : ENUM_NOTIFICATION_TYPE.MyOfferDeclined,
          bid: updatedBid,
          tradeID: tradeID,
        });
      }

      return updatedBid;
    } catch (error) {
      console.log("error", error);
      throw new Error(error);
    }
  },
};
