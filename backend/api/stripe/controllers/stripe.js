"use strict";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
/**
 * A set of functions called "actions" for `twilio`
 */
module.exports = {
  getPaymentMethods: async (ctx) => {
    const { user } = ctx.state;

    try {
      const paymentMethods = await stripe.customers.listPaymentMethods(
        user.stripeCustomerID
      );

      return paymentMethods.data;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },

  getSubscriptionPrices: async () => {
    try {
      const prices = await stripe.prices.list({
        active: true,
        product: process.env.STRIPE_CHARSI_PREMIUM_PLAN_PRODUCT_ID,
      });

      return prices.data;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },

  getCustomerBalance: async (customerID) => {
    try {
      const customer = await stripe.customers.retrieve(customerID);

      return customer.balance;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },

  getCustomerSubscription: async (ctx) => {
    const { user } = ctx.state;
    try {
      if (!user.premium) throw new Error("Non Charsi-Premium member.");

      const subscription = await stripe.subscriptions.retrieve(
        user.premiumSubscriptionID
      );
      return subscription;
    } catch (error) {
      throw new Error(error);
    }
  },

  createCustomer: async ({ name, email, phone }) => {
    return await stripe.customers.create({
      name,
      email,
      phone,
    });
  },

  attachPaymentMethod: async (ctx) => {
    const { paymentID } = ctx.request.body;
    const { user } = ctx.state;

    try {
      await stripe.paymentMethods.attach(paymentID, {
        customer: user.stripeCustomerID,
      });

      return true;
    } catch (error) {
      console.log(error);

      throw new Error(error);
    }
  },

  depositToCharsiBalance: async (ctx) => {
    const { amount, paymentID } = ctx.request.body;
    const { user } = ctx.state;

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "usd",
        customer: user.stripeCustomerID,
        payment_method: paymentID,
        description: "Charsi deposit",
        confirm: true,
      });

      if (paymentIntent.status !== "succeeded")
        throw new Error("Payment failed.");

      const charge = await stripe.charges.retrieve(paymentIntent.latest_charge);
      const balanceTransaction = await stripe.balanceTransactions.retrieve(
        charge.balance_transaction
      );

      const customer = await stripe.customers.retrieve(user.stripeCustomerID);

      const updateCustomer = await stripe.customers.update(
        user.stripeCustomerID,
        {
          balance: customer.balance + balanceTransaction.net,
        }
      );
      const updatedUser = await strapi
        .query("user", "users-permissions")
        .update(
          { id: user.id },
          {
            balance: Number(updateCustomer.balance / 100),
          }
        );

      return updatedUser.balance;
    } catch (error) {
      console.log(error);

      throw new Error(error);
    }
  },

  withDrawCharsiBalance: async (ctx) => {
    const { amount, paymentID } = ctx.request.body;

    try {
      const payout = await stripe.payouts.create({
        amount: amount * 100,
        currency: "eur",
        destination: paymentID,
      });

      return true;
    } catch (error) {
      console.log(error);

      throw new Error(error);
    }
  },

  createPremiumSubscription: async (ctx) => {
    const { priceID, paymentID } = ctx.request.body;
    const { user } = ctx.state;

    try {
      const subscription = await stripe.subscriptions.create({
        customer: user.stripeCustomerID,
        items: [{ price: priceID }],
        default_payment_method: paymentID,
      });

      const updatedUser = await strapi
        .query("user", "users-permissions")
        .update(
          { id: user.id },
          {
            premium: true,
            premiumSubscriptionID: subscription.id,
          }
        );

      return updatedUser;
    } catch (error) {
      console.log(error);

      throw new Error(error);
    }
  },

  cancelPremiumSubscription: async (ctx) => {
    const { user } = ctx.state;

    try {
      const me = await strapi
        .query("user", "users-permissions")
        .findOne({ id: user.id });
      const subscription = await stripe.subscriptions.del(
        me.premiumSubscriptionID
      );

      const updatedUser = await strapi
        .query("user", "users-permissions")
        .update(
          { id: user.id },
          {
            premium: false,
            premiumSubscriptionID: null,
          }
        );

      return updatedUser;
    } catch (error) {
      console.log(error);

      throw new Error(error);
    }
  },

  moveBalanceToCustomer: async ({
    senderCustomerID,
    recipientCustomerID,
    amount,
  }) => {
    try {
      const sender = await stripe.customers.retrieve(senderCustomerID);

      if (sender.balance < amount * 100)
        throw new Error("Insufficient balance.");

      const updatedSender = await stripe.customers.update(senderCustomerID, {
        balance: sender.balance - amount * 100,
      });

      const recipient = await stripe.customers.retrieve(recipientCustomerID);
      const updatedRecipient = await stripe.customers.update(
        recipientCustomerID,
        {
          balance: recipient.balance + amount * 100,
        }
      );

      return {
        senderBalance: updatedSender.balance,
        recipientBalance: updatedRecipient.balance,
      };
    } catch (error) {
      console.log("error: ", error);

      throw new Error(error);
    }
  },
};
