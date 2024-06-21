module.exports = {
  query: `
    getLatestSuccessTradesByGame(limit: Int, where: JSON): [Trade]
  `,
  mutation: `
    markTradeAsCompletedForSeller(id: ID!, proofs: [ID]): Trade
    markTradeAsCompletedForBuyer(id: ID!): Trade
  `,
  type: {},
  resolver: {
    Query: {
      getLatestSuccessTradesByGame: {
        description: "Get latest successful trades for game",
        resolver: "application::trade.trade.getLatestSuccessTradesByGame",
      },
    },
    Mutation: {
      markTradeAsCompletedForSeller: {
        description: "Mark trade as completed for seller",
        policies: ["plugins::users-permissions.isAuthenticated"],
        resolver: "application::trade.trade.markTradeAsCompletedForSeller",
      },
      markTradeAsCompletedForBuyer: {
        description: "Mark trade as completed for buyer",
        policies: ["plugins::users-permissions.isAuthenticated"],
        resolver: "application::trade.trade.markTradeAsCompletedForBuyer",
      },
    },
  },
};
