module.exports = {
  definition: `
    input NewCommentInput {
      listing_reward: ID
      parent: ID
      text: String
    }

    input createNewCommentInput {
      data: NewCommentInput
    }
  `,
  query: ``,
  mutation: `
    createNewComment(input: createNewCommentInput): createCommentPayload
    voteToComment(commentID: ID): JSON
    switchMarkInappropriateComment(commentID: ID): JSON
  `,
  type: {},
  resolver: {
    Mutation: {
      createNewComment: {
        description: "Create New Comment",
        policies: ["plugins::users-permissions.isAuthenticated"],
        resolver: "application::comment.comment.createNewComment",
      },
      voteToComment: {
        description: "Vote Comment",
        policies: ["plugins::users-permissions.isAuthenticated"],
        resolver: "application::comment.comment.voteToComment",
      },
      switchMarkInappropriateComment: {
        description: "Switch Mark Inappropriate Comment",
        policies: ["plugins::users-permissions.isAuthenticated"],
        resolver: "application::comment.comment.switchMarkInappropriateComment",
      },
    },
  },
};
