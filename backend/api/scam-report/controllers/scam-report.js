"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  createNewScamReport: async (ctx) => {
    const { user } = ctx.state;

    try {
      const { accusedUser, trade } = ctx.request.body;
      const existing = await strapi.query("scam-report").findOne({
        accusedUser,
        trade,
        reporter: user.id,
      });
      if (existing) {
        throw new Error(
          "You have already reported this user for this listing."
        );
      }

      const scamReport = await strapi.services["scam-report"].create({
        ...ctx.request.body,
        reporter: user.id,
        created_by: user.id,
        updated_by: user.id,
      });

      return {
        scamReport: await strapi
          .query("scam-report")
          .findOne({ id: scamReport.id }, ["proofs"]),
      };
    } catch (error) {
      console.log(error);

      throw new Error(error);
    }
  },
};
