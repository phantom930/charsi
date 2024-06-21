import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";

import {
  placeNewBid,
  getBidDeclineReasons,
  getListingRewardByID,
  closeListingRewardBid,
  searchMyListingRewardByPattern,
  extractMyBid,
  countVisitingListing,
  getCommentsByListingRewardID,
  createNewComment,
  voteToComment,
  switchMarkInappropriateComment,
  addUserReview,
} from "./listing.api";
import type { ItemQueryData } from "@store/item/item.slice";
import type { GameQueryData } from "@store/game/game.slice";
import type { UserQueryData } from "@store/user/user.slice";
import type { TradeQueryData } from "@store/trade/trade.slice";

export enum ItemType {
  ITEM = "ITEM",
  BALANCE = "BALANCE",
}

export interface UploadFile {
  id: string;
  name: string;
  url: string;
  width?: number;
  height?: number;
  formats?: Object;
}

export interface ListingQueryData {
  id: string;
  type?: ItemType;
  game?: GameQueryData;
  item?: ItemQueryData;
  description?: string;
  images?: UploadFile[];
  values?: Object;
}

export interface RewardQueryData {
  id: string;
  type?: ItemType;
  game?: GameQueryData;
  item?: ItemQueryData;
  description?: string;
  values?: Object;
  balance?: number;
}

export interface BidQueryData {
  id: string;
  rewards: RewardQueryData[];
  owner: UserQueryData;
  status?: string;
  decline_reason?: BidDeclineReasonQueryData;
  listing_reward: ListingRewardQueryData;
  created_at?: Date;
  updated_at?: Date;
}

export interface CommentQueryData {
  id: string;
  listing_reward: {
    id: string;
  };
  parent: {
    id: string;
  };
  text: string;
  commenter: UserQueryData;
  votes: {
    id: string;
  }[];
  isInAppropriate: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ListingRewardQueryData {
  id: string;
  title: string;
  description?: string;
  isOpenBids: boolean;
  listings: ListingQueryData[];
  rewards: RewardQueryData[];
  owner: UserQueryData;
  bids?: BidQueryData[];
  visits?: number;
  comments?: CommentQueryData[];
  created_at?: Date;
  updated_at?: Date;
}

export interface BidDeclineReasonQueryData {
  id: string;
  reason: string;
  description?: string;
}

export interface TraderReviewQueryData {
  id: string;
  listing_reward?: ListingRewardQueryData;
  reviewer: UserQueryData;
  trade?: TradeQueryData;
  text: string;
  stars: number;
  created_at: Date;
  updated_at: Date;
}

export interface InitialListingState {
  listings: ListingQueryData[] | [];
  rewards: RewardQueryData[] | [];
  listingRewards: ListingRewardQueryData[] | [];
  bidDeclineReasons: BidDeclineReasonQueryData[] | [];
}

const initialState: InitialListingState = {
  listings: [],
  rewards: [],
  listingRewards: [],
  bidDeclineReasons: [],
};

export const listingSlice = createSlice({
  name: "listing",
  initialState,
  reducers: {
    pushListingReward: (
      state,
      { payload }: PayloadAction<ListingRewardQueryData>
    ) => {
      state.listingRewards = [...state.listingRewards, payload];
    },
    pushNewBidToListingReward: (
      state,
      { payload }: PayloadAction<BidQueryData>
    ) => {
      const updateListingRewardIndex: number = _.findIndex(
        state.listingRewards,
        { id: payload.listing_reward.id }
      );
      if (updateListingRewardIndex > -1) {
        state.listingRewards[updateListingRewardIndex].bids = [
          payload,
          ...state.listingRewards[updateListingRewardIndex].bids,
        ];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        placeNewBid.fulfilled,
        (
          state,
          { payload }: PayloadAction<{ id: string; bids: BidQueryData[] }>
        ) => {
          const updateListingRewardIndex: number = _.findIndex(
            state.listingRewards,
            { id: payload.id }
          );
          if (updateListingRewardIndex > -1)
            state.listingRewards[updateListingRewardIndex].bids = _.cloneDeep(
              payload.bids
            );
        }
      )
      .addCase(getBidDeclineReasons.fulfilled, (state, { payload }) => {
        state.bidDeclineReasons = payload;
      })
      .addCase(
        getListingRewardByID.fulfilled,
        (state, { payload }: PayloadAction<ListingRewardQueryData>) => {
          const isIncluded: boolean =
            _.findIndex(
              state.listingRewards,
              (listingReward: ListingRewardQueryData) =>
                listingReward.id === payload.id
            ) > -1;
          if (!isIncluded) {
            state.listingRewards = [...state.listingRewards, payload];
          }
        }
      )
      .addCase(
        closeListingRewardBid.fulfilled,
        (state, { payload }: PayloadAction<ListingRewardQueryData>) => {
          console.log("payload: ", payload);
          const index: number = _.findIndex(
            state.listingRewards,
            (listingReward: ListingRewardQueryData) =>
              listingReward.id === payload.id
          );
          if (index > -1) {
            state.listingRewards[index].isOpenBids = false;
          }
        }
      )
      .addCase(
        searchMyListingRewardByPattern.fulfilled,
        (state, { payload }: PayloadAction<ListingRewardQueryData[]>) => {
          payload.map((payloadListingReward: ListingRewardQueryData) => {
            const isIncluded: boolean =
              _.findIndex(
                state.listingRewards,
                (listingReward: ListingRewardQueryData) =>
                  listingReward.id === payloadListingReward.id
              ) > -1;
            if (!isIncluded) {
              state.listingRewards = [
                ...state.listingRewards,
                payloadListingReward,
              ];
            }
          });
        }
      )
      .addCase(
        extractMyBid.fulfilled,
        (state, { payload: removedBid }: PayloadAction<BidQueryData>) => {
          let updatedListingRewards: ListingRewardQueryData[] = _.cloneDeep(
            state.listingRewards
          );
          const listingRewardIndex: number = _.findIndex(
            updatedListingRewards,
            { id: removedBid.listing_reward.id }
          );
          if (listingRewardIndex > -1) {
            const bidIndex: number = _.findIndex(
              updatedListingRewards[listingRewardIndex].bids,
              { id: removedBid.id }
            );
            if (bidIndex > -1) {
              updatedListingRewards[listingRewardIndex].bids.splice(
                bidIndex,
                1
              );
              state.listingRewards = updatedListingRewards;
            }
          }
        }
      )
      .addCase(
        countVisitingListing.fulfilled,
        (state, { payload }: PayloadAction<{ id: string; visits: number }>) => {
          const updateListingRewardIndex: number = _.findIndex(
            state.listingRewards,
            { id: payload.id }
          );
          if (updateListingRewardIndex > -1) {
            state.listingRewards[updateListingRewardIndex].visits =
              payload.visits;
          }
        }
      )
      .addCase(
        getCommentsByListingRewardID.fulfilled,
        (state, { payload }: PayloadAction<CommentQueryData[]>) => {
          if (!payload.length) return;
          const updateListingRewardIndex: number = _.findIndex(
            state.listingRewards,
            { id: payload[0].listing_reward.id }
          );
          if (updateListingRewardIndex > -1) {
            state.listingRewards[updateListingRewardIndex].comments = payload;
          }
        }
      )
      .addCase(
        createNewComment.fulfilled,
        (state, { payload }: PayloadAction<CommentQueryData>) => {
          const updateListingRewardIndex: number = _.findIndex(
            state.listingRewards,
            { id: payload.listing_reward.id }
          );
          if (updateListingRewardIndex > -1) {
            state.listingRewards[updateListingRewardIndex].comments = [
              payload,
              ...(state.listingRewards[updateListingRewardIndex].comments ||
                []),
            ];
          }
        }
      )
      .addCase(
        voteToComment.fulfilled,
        (state, { payload }: PayloadAction<object>) => {
          const updatedListingRewardIndex: number = _.findIndex(
            state.listingRewards,
            { id: String((payload as any).listingRewardID) }
          );

          if (updatedListingRewardIndex > -1) {
            const updatedCommentIndex: number = _.findIndex(
              state.listingRewards[updatedListingRewardIndex].comments,
              { id: String((payload as any).commentID) }
            );

            if (updatedCommentIndex > -1) {
              state.listingRewards[updatedListingRewardIndex].comments[
                updatedCommentIndex
              ].votes = (payload as any).votes;
            }
          }
        }
      )
      .addCase(
        switchMarkInappropriateComment.fulfilled,
        (state, { payload }: PayloadAction<object>) => {
          const updatedListingRewardIndex: number = _.findIndex(
            state.listingRewards,
            { id: String((payload as any).listingRewardID) }
          );

          if (updatedListingRewardIndex > -1) {
            const updatedCommentIndex: number = _.findIndex(
              state.listingRewards[updatedListingRewardIndex].comments,
              { id: String((payload as any).commentID) }
            );

            if (updatedCommentIndex > -1) {
              state.listingRewards[updatedListingRewardIndex].comments[
                updatedCommentIndex
              ].isInAppropriate = (payload as any).isInAppropriate;
            }
          }
        }
      )
      .addCase(
        addUserReview.fulfilled,
        (state, { payload }: PayloadAction<TraderReviewQueryData>) => {
          const updatedListingRewardIndex: number = _.findIndex(
            state.listingRewards,
            { id: payload.trade.listing_reward.id }
          );

          if (updatedListingRewardIndex > -1) {
            const updatedListingReward = {
              ...state.listingRewards[updatedListingRewardIndex],
            };
            updatedListingReward.owner = {
              ...payload.trade.listing_reward.owner,
            };
            state.listingRewards[updatedListingRewardIndex] =
              updatedListingReward;
          }
        }
      );
  },
});

export const { pushListingReward, pushNewBidToListingReward } =
  listingSlice.actions;
export default listingSlice.reducer;
