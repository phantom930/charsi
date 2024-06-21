import { createAsyncThunk } from "@reduxjs/toolkit";

import client from "@/graphql";
import {
  CREATE_TRADE_MUTATION,
  GET_MY_TRADES_QUERY,
  MARK_TRADE_AS_COMPLETED_FOR_SELLER_MUTATION,
  MARK_TRADE_AS_COMPLETED_FOR_BUYER_MUTATION,
} from "./trade.graphql";

export const createNewTrade = createAsyncThunk(
  "trade/createNewTrade",
  async (input: any) => {
    try {
      const { data } = await client.mutate({
        mutation: CREATE_TRADE_MUTATION,
        variables: { input },
      });

      input.onSuccess && input.onSuccess();
      return data.createTrade.trade;
    } catch (error) {
      input.onFail && input.onFail(error);
      throw new Error(`Failed to create trade: ${error.message}`);
    }
  }
);

export const getMyTrades = createAsyncThunk(
  "trade/getAllTrades",
  async (payload: any) => {
    try {
      const { data } = await client.query({
        query: GET_MY_TRADES_QUERY,
        variables: { owner: payload.ownerID },
      });

      payload.onSuccess && payload.onSuccess();
      return data.trades;
    } catch (error) {
      payload.onFail && payload.onFail(error);
      throw new Error(`Failed to get trades: ${error.message}`);
    }
  }
);

export const markTradeAsCompletedForSeller = createAsyncThunk(
  "trade/markTradeAsCompletedForSeller",
  async (payload: any) => {
    try {
      const { data } = await client.mutate({
        mutation: MARK_TRADE_AS_COMPLETED_FOR_SELLER_MUTATION,
        variables: { id: payload.id, proofs: payload.proofs },
      });

      payload.onSuccess && payload.onSuccess();
      return data.markTradeAsCompletedForSeller;
    } catch (error) {
      payload.onFail && payload.onFail(error);
      throw new Error(
        `Failed to mark trade as completed for seller: ${error.message}`
      );
    }
  }
);

export const markTradeAsCompletedForBuyer = createAsyncThunk(
  "trade/markTradeAsCompletedForBuyer",
  async (payload: any) => {
    try {
      const { data } = await client.mutate({
        mutation: MARK_TRADE_AS_COMPLETED_FOR_BUYER_MUTATION,
        variables: { id: payload.id },
      });

      payload.onSuccess && payload.onSuccess();
      return data.markTradeAsCompletedForBuyer;
    } catch (error) {
      payload.onFail && payload.onFail(error);
      throw new Error(
        `Failed to mark trade as completed for buyer: ${error.message}`
      );
    }
  }
);
