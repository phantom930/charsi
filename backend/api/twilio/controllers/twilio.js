"use strict";
const client = require("twilio")(
  process.env.TWILLO_ACCOUNT_SID,
  process.env.TWILLO_AUTH_TOKEN
);

/**
 * A set of functions called "actions" for `twilio`
 */

module.exports = {
  twilioClient: client,
  getPhoneCode: async (ctx) => {
    const { phoneNumber, channel } = ctx.request.body;
    try {
      const result = await client.verify.v2
        .services(process.env.TWILLO_SERVICE_SID)
        .verifications.create({
          to: phoneNumber,
          channel: channel,
        });

      return {
        success: true,
        message: "Please check your phone!",
      };
    } catch (error) {
      console.log(error);

      return {
        success: false,
        message: error.message,
      };
    }
  },
  verifyPhoneCode: async (ctx) => {
    const { phoneNumber, code } = ctx.request.body;
    try {
      const result = await client.verify.v2
        .services(process.env.TWILLO_SERVICE_SID)
        .verificationChecks.create({
          to: phoneNumber,
          code: code,
        });

      return {
        success: result.valid,
        message: result.valid ? "Phone verified!" : "Code is invalid!",
      };
    } catch (error) {
      console.log(error);

      return {
        success: false,
        message: error.message,
      };
    }
  },
};
