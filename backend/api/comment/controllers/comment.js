"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  createNewComment: async (ctx) => {
    const { user } = ctx.state;

    try {
      const comment = await strapi.services["comment"].create({
        ...ctx.request.body,
        commenter: user.id,
        created_by: user.id,
        updated_by: user.id,
      });

      return {
        comment: comment,
      };
    } catch (error) {
      console.log(error);

      throw new Error(error);
    }
  },
  voteToComment: async (ctx) => {
    const { user } = ctx.state;
    const { commentID } = ctx.request.body;

    try {
      const comment = await strapi.services["comment"].findOne({
        id: commentID,
      });

      if (user.id === comment.commenter.id) {
        throw new Error("You cannot vote your own comment");
      }

      if (comment.votes.findIndex((vote) => vote.id === user.id) !== -1) {
        throw new Error("You already voted this comment");
      }

      const updatedComment = await strapi.services["comment"].update(
        {
          id: commentID,
        },
        {
          votes: [...comment.votes, user.id],
        }
      );
      return {
        listingRewardID: comment.listing_reward.id,
        commentID: comment.id,
        votes: updatedComment.votes,
      };
    } catch (error) {
      console.log(error);

      throw new Error(error);
    }
  },
  switchMarkInappropriateComment: async (ctx) => {
    const { user } = ctx.state;
    const { commentID } = ctx.request.body;

    try {
      const comment = await strapi.services["comment"].findOne({
        id: commentID,
      });

      if (user.id === comment.commenter.id) {
        throw new Error("You cannot flag your own comment");
      } else if (user.id !== comment.listing_reward.owner) {
        throw new Error("You don't have a permission");
      }

      const updatedComment = await strapi.services["comment"].update(
        {
          id: commentID,
        },
        {
          isInAppropriate: !comment.isInAppropriate,
        }
      );

      return {
        listingRewardID: comment.listing_reward.id,
        commentID: comment.id,
        isInAppropriate: updatedComment.isInAppropriate,
      };
    } catch (error) {
      console.log(error);

      throw new Error(error);
    }
  },
};
