import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";

import {
  createNewTrade,
  getMyTrades,
  markTradeAsCompletedForSeller,
  markTradeAsCompletedForBuyer,
} from "./trade.api";
import type {
  ListingRewardQueryData,
  BidQueryData,
  UploadFile,
} from "@store/listing/listing.slice";

export interface TradeQueryData {
  id: string;
  listing_reward: ListingRewardQueryData;
  bid: BidQueryData;
  status: "TRADING" | "TRADED";
  isSellerConfirmed: boolean;
  isBuyerConfirmed: boolean;
  proofs: UploadFile[];
  created_at: Date;
  updated_at: Date;
}

export interface InitialTradeState {
  trades: TradeQueryData[] | [];
}

const initialState: InitialTradeState = {
  trades: [],
};

export const tradeSlice = createSlice({
  name: "trade",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getMyTrades.fulfilled,
        (state, { payload }: PayloadAction<TradeQueryData[]>) => {
          state.trades = [...payload];
        }
      )
      .addCase(
        createNewTrade.fulfilled,
        (state, { payload }: PayloadAction<TradeQueryData>) => {
          state.trades = [payload, ...state.trades];
        }
      )
      .addCase(
        markTradeAsCompletedForSeller.fulfilled,
        (state, { payload }: PayloadAction<TradeQueryData>) => {
          const index = _.findIndex(state.trades, { id: payload.id });
          state.trades[index] = payload;
        }
      )
      .addCase(
        markTradeAsCompletedForBuyer.fulfilled,
        (state, { payload }: PayloadAction<TradeQueryData>) => {
          const index = _.findIndex(state.trades, { id: payload.id });
          state.trades[index] = payload;
        }
      );
  },
});

export default tradeSlice.reducer;
