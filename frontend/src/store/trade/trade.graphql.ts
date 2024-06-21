import { gql } from "@apollo/client";

import {
  UPLOAD_FILE_PAYLOAD,
  DETAILED_LISTING_REWARD_PAYLOAD,
  BID_PAYLOAD,
} from "@store/listing/listing.graphql";

const SIMPLE_TRADE_PAYLOAD = `
  id
  listing_reward {
    title
    owner {
      id
      username
      avatar {
        id
        name
        url
      }
    }
  }
  bid {
    owner {
      id
      username
      avatar {
        id
        name
        url
      }
    }
  }
  status
  created_at
  updated_at
`;

export const TRADE_PAYLOAD = `
  id
  listing_reward {
    ${DETAILED_LISTING_REWARD_PAYLOAD}
  }
  bid {
    ${BID_PAYLOAD}
  }
  status
  isSellerConfirmed
  isBuyerConfirmed
  proofs {
    ${UPLOAD_FILE_PAYLOAD}
  }
  created_at
  updated_at
`;

export const CREATE_TRADE_MUTATION = gql`
  mutation CreateTrade($input: TradeInput) {
    createTrade(input: { data: $input }) {
      trade {
        ${TRADE_PAYLOAD}
      }
    }
  }
`;

export const GET_MY_TRADES_QUERY = gql`
  query GetTrades($owner: ID) {
    trades(sort: "created_at:desc", where: {
      _or: [
        { listing_reward: { owner: $owner } },
        { bid: { owner: $owner } }
      ]
    }) {
      ${TRADE_PAYLOAD}
    }
  }
`;

export const GET_VERIFIED_TRADE_BY_LISTING_REWARD_AND_BID_ID_QUERY = gql`
  query GetVerifiedTradeByListingRewardAndBidID($listingRewardID: ID, $bidID: ID) {
    trades(where: {
      listing_reward: $listingRewardID,
      bid: $bidID,
      status: "TRADED"
    }) {
      ${TRADE_PAYLOAD}
    }
  }
`;

export const SEARCH_TRADES_BY_PATTERN_QUERY = gql`
  query SearchTradesByPattern {
    trades(sort: "created_at:desc") {
      ${TRADE_PAYLOAD}
    }
  }
`;

export const MARK_TRADE_AS_COMPLETED_FOR_SELLER_MUTATION = gql`
  mutation markTradeAsCompletedForSeller($id: ID!, $proofs: [ID]) {
    markTradeAsCompletedForSeller(id: $id, proofs: $proofs) {
      ${TRADE_PAYLOAD}
    }
  }
`;

export const MARK_TRADE_AS_COMPLETED_FOR_BUYER_MUTATION = gql`
  mutation markTradeAsCompletedForBuyer($id: ID!) {
    markTradeAsCompletedForBuyer(id: $id) {
      ${TRADE_PAYLOAD}
    }
  }
`;

export const GET_4_LATEST_TRADES_QUERY = gql`
  query GetLatest4Trades($pattern: String, $owner: ID) {
    trades(sort: "created_at:desc", limit: 4, where: {
      listing_reward: {
        title_contains: $pattern,
      },
      _or: [
        { listing_reward: { owner: $owner } },
        { bid: { owner: $owner } }
      ]
    }) {
      ${SIMPLE_TRADE_PAYLOAD}
    }
  }
`;

export const GET_LATEST_SUCCESS_TRADES_QUERY = gql`
  query getLatestSuccessTradesByGame($gameID: ID) {
    getLatestSuccessTradesByGame(limit: 5, where: {
      game: $gameID
    }) {
      ${TRADE_PAYLOAD}
    }
  }
`;
