module.exports = {
  definition: ``,
  query: `
    getPaymentMethods: [JSON]
    getSubscriptionPrices: [JSON]
    getCustomerSubscription: JSON
  `,
  mutation: `
    attachPaymentMethod(paymentID: String): Boolean
    depositToCharsiBalance(amount: Float, paymentID: String): Float
    createPremiumSubscription(priceID: String, paymentID: String): JSON
    cancelPremiumSubscription: JSON
  `,
  type: {},
  resolver: {
    Query: {
      getPaymentMethods: {
        description: "Get payment methods",
        policies: ["plugins::users-permissions.isAuthenticated"],
        resolver: "application::stripe.stripe.getPaymentMethods",
      },
      getSubscriptionPrices: {
        description: "Get subscription prices",
        resolver: "application::stripe.stripe.getSubscriptionPrices",
      },
      getCustomerSubscription: {
        description: "Get customer's subscription",
        policies: ["plugins::users-permissions.isAuthenticated"],
        resolver: "application::stripe.stripe.getCustomerSubscription",
      },
    },
    Mutation: {
      attachPaymentMethod: {
        description: "Attach payment method to user",
        policies: ["plugins::users-permissions.isAuthenticated"],
        resolver: "application::stripe.stripe.attachPaymentMethod",
      },
      depositToCharsiBalance: {
        description: "Deposit to Charsi balance",
        policies: ["plugins::users-permissions.isAuthenticated"],
        resolver: "application::stripe.stripe.depositToCharsiBalance",
      },
      createPremiumSubscription: {
        description: "Create premium subscription",
        policies: ["plugins::users-permissions.isAuthenticated"],
        resolver: "application::stripe.stripe.createPremiumSubscription",
      },
      cancelPremiumSubscription: {
        description: "Cancel premium subscription",
        policies: ["plugins::users-permissions.isAuthenticated"],
        resolver: "application::stripe.stripe.cancelPremiumSubscription",
      },
    },
  },
};
