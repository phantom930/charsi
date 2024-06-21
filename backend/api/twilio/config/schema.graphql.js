module.exports = {
  definition: `
    type Response {
      success: Boolean!
      message: String!
    }
  `,
  query: ``,
  mutation: `
    getPhoneCode(phoneNumber: String!, channel: String!): Response
    verifyPhoneCode(phoneNumber: String!, code: String!): Response
  `,
  type: {},
  resolver: {
    Mutation: {
      getPhoneCode: {
        description: 'Get phone code',
        resolver: 'application::twilio.twilio.getPhoneCode',
      },
      verifyPhoneCode: {
        description: 'Verify phone code',
        resolver: 'application::twilio.twilio.verifyPhoneCode',
      }
    }
  }
}
