import { createAsyncThunk } from "@reduxjs/toolkit";

import client from "@/graphql";
import {
  PUSH_NEW_BID_TO_LISTING_REWARD,
  GET_BID_DECLINE_REASONS_QUERY,
  GET_LISTING_REWARD_BY_ID_QUERY,
  CLOSE_LISTING_REWARD_BID_MUTATION,
  SEARCH_MY_LISTING_REWARD_BY_PATTERN,
  UPDATE_BID_STATUS_MUTATION,
  EXTRACT_BID_MUTATION,
  COUNT_VISITING_LISTING_MUTATION,
  GET_COMMNETS_BY_LISTING_REWARD_ID_QUERY,
  CREATE_NEW_COMMENT_MUTATION,
  VOTE_TO_COMMENT_MUTATION,
  SWITCH_MARK_INAPPROPRIATE_COMMENT_MUTATION,
  ADD_USER_REVIEW_MUTATION,
} from "./listing.graphql";

export const placeNewBid = createAsyncThunk(
  "listing/placeNewBid",
  async ({
    input,
    onSuccess,
  }: {
    input: object;
    onSuccess: Function | null;
  }) => {
    try {
      const { data } = await client.mutate({
        mutation: PUSH_NEW_BID_TO_LISTING_REWARD,
        variables: { input },
      });

      onSuccess && onSuccess();

      return data.updateListingReward.listingReward;
    } catch (error) {}
  }
);

export const getBidDeclineReasons = createAsyncThunk(
  "listing/getBidDeclineReasons",
  async () => {
    try {
      const { data } = await client.query({
        query: GET_BID_DECLINE_REASONS_QUERY,
      });

      return data.bidDeclineReasons;
    } catch (error) {
      throw new Error(`Failed to get bid decline reasons: ${error.message}`);
    }
  }
);

export const getListingRewardByID = createAsyncThunk(
  "listing/getListingRewardByID",
  async (payload: { listingID: string; callback: Function | null }) => {
    try {
      const { data } = await client.query({
        query: GET_LISTING_REWARD_BY_ID_QUERY,
        variables: { listingID: payload.listingID },
        fetchPolicy: "network-only",
      });

      payload.callback && payload.callback();

      return data.listingRewards[0];
    } catch (error) {
      throw new Error(`Failed to get listing reward: ${error.message}`);
    }
  }
);

export const closeListingRewardBid = createAsyncThunk(
  "listing/closeListingRewardBid",
  async (payload: { listingRewardID: string }) => {
    try {
      const { data } = await client.mutate({
        mutation: CLOSE_LISTING_REWARD_BID_MUTATION,
        variables: {
          listingRewardID: payload.listingRewardID,
        },
      });

      return data.updateListingReward.listingReward;
    } catch (error) {
      throw new Error(`Failed to close listing bids: ${error.message}`);
    }
  }
);

export const searchMyListingRewardByPattern = createAsyncThunk(
  "listing/searchListingRewardByPattern",
  async (payload: {
    pattern: string;
    owner: string;
    onSuccess?: Function | null;
    onFail?: Function | null;
  }) => {
    try {
      const { data } = await client.query({
        query: SEARCH_MY_LISTING_REWARD_BY_PATTERN,
        variables: { pattern: payload.pattern, owner: payload.owner },
        fetchPolicy: "network-only",
      });

      payload.onSuccess &&
        payload.onSuccess(
          data.listingRewards.map(
            (listingReward: any) => (listingReward as any).id
          )
        );

      return data.listingRewards;
    } catch (error) {
      payload.onFail && payload.onFail(error);

      throw new Error(`Failed to get listing reward: ${error.message}`);
    }
  }
);

export const updateBidStatus = createAsyncThunk(
  "listing/updateBid",
  async (payload: {
    bidID: string;
    status: string;
    onSuccess?: Function | null;
    onFail?: Function | null;
  }) => {
    try {
      await client.mutate({
        mutation: UPDATE_BID_STATUS_MUTATION,
        variables: { bidID: payload.bidID, status: payload.status },
      });

      payload.onSuccess && payload.onSuccess();
      return true;
    } catch (error) {
      payload.onFail && payload.onFail(error);

      throw new Error(`Failed to update bid: ${error.message}`);
    }
  }
);

export const extractMyBid = createAsyncThunk(
  "listing/extractMyBid",
  async (payload: { input: object; onSuccess: Function | null }) => {
    try {
      const { data } = await client.mutate({
        mutation: EXTRACT_BID_MUTATION,
        variables: { input: payload.input },
      });

      payload.onSuccess && payload.onSuccess();

      return data.deleteBid.bid;
    } catch (error) {}
  }
);

export const countVisitingListing = createAsyncThunk(
  "listing/countVisitingListing",
  async (payload: any) => {
    try {
      const { data } = await client.mutate({
        mutation: COUNT_VISITING_LISTING_MUTATION,
        variables: { ...payload },
      });

      return {
        id: payload.listingRewardID,
        visits: data.countVisitingListingReward,
      };
    } catch (error) {}
  }
);

export const getCommentsByListingRewardID = createAsyncThunk(
  "listing/getCommentsByListingRewardID",
  async (payload: any) => {
    try {
      const { data } = await client.query({
        query: GET_COMMNETS_BY_LISTING_REWARD_ID_QUERY,
        variables: { listingRewardID: payload.listingRewardID },
      });

      return data.comments;
    } catch (error) {}
  }
);

export const createNewComment = createAsyncThunk(
  "listing/createNewComment",
  async (payload: any) => {
    try {
      const { data } = await client.mutate({
        mutation: CREATE_NEW_COMMENT_MUTATION,
        variables: { data: payload.data },
      });

      payload.onSuccess && payload.onSuccess();

      return data.createNewComment.comment;
    } catch (error) {
      payload.onFail && payload.onFail(error);

      throw new Error(error);
    }
  }
);

export const voteToComment = createAsyncThunk(
  "listing/voteToComment",
  async (payload: any) => {
    try {
      const { data } = await client.mutate({
        mutation: VOTE_TO_COMMENT_MUTATION,
        variables: { commentID: payload.commentID },
      });

      payload.onSuccess && payload.onSuccess();

      return data.voteToComment;
    } catch (error) {
      payload.onFail && payload.onFail(error);

      throw new Error(error);
    }
  }
);

export const switchMarkInappropriateComment = createAsyncThunk(
  "listing/switchMarkInappropriateComment",
  async (payload: any) => {
    try {
      const { data } = await client.mutate({
        mutation: SWITCH_MARK_INAPPROPRIATE_COMMENT_MUTATION,
        variables: { commentID: payload.commentID },
      });

      payload.onSuccess && payload.onSuccess();

      return data.switchMarkInappropriateComment;
    } catch (error) {
      payload.onFail && payload.onFail(error);

      throw new Error(error);
    }
  }
);

export const addUserReview = createAsyncThunk(
  "listing/addUserReview",
  async (payload: any) => {
    try {
      const { data } = await client.mutate({
        mutation: ADD_USER_REVIEW_MUTATION,
        variables: { data: payload.data },
      });

      payload.onSuccess &&
        payload.onSuccess(data.createNewTraderReview.traderReview);

      return data.createNewTraderReview.traderReview;
    } catch (error) {
      payload.onFail && payload.onFail(error);
      throw new Error(error);
    }
  }
);
