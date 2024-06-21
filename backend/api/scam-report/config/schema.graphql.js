module.exports = {
  definition: `
    input NewScamReportInput {
      accusedUser: ID
      trade: ID
      reason: String
      proofs: [ID]
      status: ENUM_SCAMREPORT_STATUS
      supportReply: String
    }

    input createNewScamReportInput {
      data: NewScamReportInput
    }
  `,
  query: ``,
  mutation: `
    createNewScamReport(input: createNewScamReportInput): createScamReportPayload
  `,
  type: {},
  resolver: {
    Mutation: {
      createNewScamReport: {
        description: "Create Scam Report Record",
        policies: ["plugins::users-permissions.isAuthenticated"],
        resolver: "application::scam-report.scam-report.createNewScamReport",
      },
    },
  },
};
