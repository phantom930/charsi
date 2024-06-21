import { gql } from "@apollo/client";

import { SIMPLE_USER_PAYLOAD, USER_PAYLOAD } from "@store/user/user.graphql";

export const UPLOAD_FILE_PAYLOAD = `
  id
  name
  url
`;

export const LISTING_PAYLOAD = `
  id
  type
  game {
    id
    title
    image {
      ${UPLOAD_FILE_PAYLOAD}
    }
  }
  item {
    id
    name
    image {
      ${UPLOAD_FILE_PAYLOAD}
    }
    properties(sort: "name:asc") {
      id
      name
      suzerainMajorCategories {
        id
        name
      }
      propertyType
    }
    majorCategory {
      id
      name
      isItemType
    }
  }
  images {
    ${UPLOAD_FILE_PAYLOAD}
  }
  description
  values
  created_at
  updated_at
`;

export const REWARD_PAYLOAD = `
  id
  type
  game {
    id
    title
    image {
      ${UPLOAD_FILE_PAYLOAD}
    }
  }
  item {
    id
    name
    image {
      ${UPLOAD_FILE_PAYLOAD}
    }
    properties(sort: "name:asc") {
      id
      name
      suzerainMajorCategories {
        id
        name
      }
      propertyType
    }
    majorCategory {
      id
      name
      isItemType
    }
  }
  description
  values
  balance
  created_at
  updated_at
`;

export const SIMPLE_BID_PAYLOAD = `
  id
  status
  rewards {
    id
    type
    description
    values
    balance
    created_at
    updated_at
  }
  created_at
  updated_at
`;

export const BID_PAYLOAD = `
  id
  owner {
    ${USER_PAYLOAD}
  }
  status
  decline_reason {
    id
    reason
  }
  rewards {
    ${REWARD_PAYLOAD}
  }
  listing_reward {
    id
  }
  created_at
  updated_at
`;

export const COMMENT_PAYLOAD = `
  id
  listing_reward {
    id
    owner {
      id
    }
  }
  parent {
    id
  }
  text
  commenter {
    ${USER_PAYLOAD}
  }
  votes {
    id
  }
  isInAppropriate
  created_at
  updated_at
`;

export const LISTING_REWARD_PAYLOAD = `
  id
  title
  isOpenBids
  description
  listings {
    id
  }
  rewards {
    id
  }
  bids(sort: "created_at:asc", where: { status: "ACTIVE" }) {
    id
    rewards {
      id
    }
    owner {
      id
    }
    created_at
    updated_at
  }
  owner {
    id
  }
  created_at
  updated_at
`;

export const DETAILED_LISTING_REWARD_PAYLOAD = `
  id
  title
  isOpenBids
  description
  listings {
    ${LISTING_PAYLOAD}
  }
  rewards {
    ${REWARD_PAYLOAD}
  }
  bids(sort: "created_at:desc") {
    ${BID_PAYLOAD}
  }
  owner {
    ${USER_PAYLOAD}
  }
  visits
  created_at
  updated_at
`;

export const BID_DECLINE_REASON_PAYLOAD = `
  id
  reason
  description
`;

export const TRADER_REVIEW_PAYLOAD = `
  id
  trade {
    id
    listing_reward {
      id
      title
      owner {
        ${SIMPLE_USER_PAYLOAD}
      }
    }
    bid {
      id
      owner {
        ${SIMPLE_USER_PAYLOAD}
      }
    }
  }
  reviewer {
    ${SIMPLE_USER_PAYLOAD}
  }
  text
  stars
  created_at
  updated_at
`;

export const CREATE_LISTING_MUTATION = gql`
  mutation createListing($input: ListingInput) {
    createListing(input: { data: $input }) {
      listing {
        id
      }
    }
  }
`;

export const CREATE_REWARD_MUTATION = gql`
  mutation createReward($input: RewardInput) {
    createReward(input: { data: $input }) {
      reward {
        id
      }
    }
  }
`;

export const CREATE_LISTING_REWARD_MUTATION = gql`
  mutation createListingReward($input: ListingRewardInput) {
    createListingReward(input: { data: $input }) {
      listingReward {
        ${LISTING_REWARD_PAYLOAD}
      }
    }
  }
`;

export const COUNT_LISTING_REWARD_QUERY = gql`
  query countListingRewards($start: Int, $limit: Int, $where: JSON) {
    countListingRewards(start: $start, limit: $limit, where: $where)
  }
`;

export const GET_LISTING_REWARD_QUERY = gql`
  query getListingRewards($limit: Int, $start: Int, $where: JSON) {
    listingRewards(sort: "created_at:desc", limit: $limit, start: $start, where: $where) {
      ${LISTING_REWARD_PAYLOAD}
    }
  }
`;

export const GET_LISTING_REWARD_BY_ID_QUERY = gql`
  query getListingRewardByID($listingID: ID) {
    listingRewards(where: { id: $listingID }) {
      ${DETAILED_LISTING_REWARD_PAYLOAD}
    }
  }
`;

export const GET_BIDS_BY_LISTING_REWARD_ID_QUERY = gql`
  query getBidsByListingRewardID($listingRewardID: ID) {
    bids(where: { listing_reward: $listingRewardID, status_ne: "DECLINED" }) {
      ${SIMPLE_BID_PAYLOAD}
    }
  }
`;

export const SEARCH_LISTING_REWARD_BY_TITLE_QUERY = gql`
  query searchListingRewardByTitle($input: String) {
    listingRewards(where: { title_contains: $input }, sort: "created_at:desc") {
      ${LISTING_REWARD_PAYLOAD}
    }
  }
`;

export const SEARCH_MY_LISTING_REWARD_BY_PATTERN = gql`
  query searchMyListingRewardByPattern($pattern: String, $owner: ID) {
    listingRewards(
      sort: "created_at:desc"
      where: {
        _or: [
          { title_contains: $pattern }
          { description_contains: $pattern }
          { listings: { item: { name_contains: $pattern } } }
        ]
        owner: $owner
      }
    ) {
      ${DETAILED_LISTING_REWARD_PAYLOAD}
    }
  }
`;

export const UPDATE_LISTING_MUTATION = gql`
  mutation updateListing($input: updateListingInput) {
    updateListing(input: $input) {
      listing {
        ${LISTING_PAYLOAD}
      }
    }
  }
`;

export const UPDATE_REWARD_MUTATION = gql`
  mutation updateReward($input: updateRewardInput) {
    updateReward(input: $input) {
      reward {
        ${REWARD_PAYLOAD}
      }
    }
  }
`;

export const UPDATE_LISTING_REWARD_MUTATION = gql`
  mutation updateListingReward($input: updateListingRewardInput) {
    updateListingReward(input: $input) {
      listingReward {
        ${LISTING_REWARD_PAYLOAD}
      }
    }
  }
`;

export const DELETE_LISTING_REWARD_MUTATION = gql`
  mutation deleteListingReward($input: deleteListingRewardInput) {
    deleteListingReward(input: $input) {
      listingReward {
        id
      }
    }
  }
`;

export const CLOSE_LISTING_REWARD_BID_MUTATION = gql`
  mutation closeListingRewardBid($listingRewardID: ID!) {
    updateListingReward(input: {
      where: {
        id: $listingRewardID
      },
      data: {
        isOpenBids: false
      }
    }) {
      listingReward {
        ${LISTING_REWARD_PAYLOAD}
      }
    }
  }
`;

export const GET_LISTING_IMAGES = gql`
  query GetListingImages($input: [ID]) {
    listings(where: { id_in: $input }) {
      id
      images {
        id
        name
        url
      }
    }
  }
`;

export const GET_MULTIPLE_LISTINGS = gql`
  query GetMultipleListings($input: [ID]) {
    listings(where: { id_in: $input }) {
      ${LISTING_PAYLOAD}
    }
  }
`;

export const GET_MULTIPLE_REWARDS = gql`
  query GetMultipleRewards($input: [ID]) {
    rewards(where: { id_in: $input }) {
      ${REWARD_PAYLOAD}
    }
  }
`;

export const GET_BID_DECLINE_REASONS_QUERY = gql`
  query {
    bidDeclineReasons {
      ${BID_DECLINE_REASON_PAYLOAD}
    }
  }
`;

export const CREATE_BID = gql`
  mutation CreateBid($input: NewBidInput) {
    createNewBid(input: { data: $input }) {
      bid {
        ${BID_PAYLOAD}
      }
    }
  }
`;

export const PUSH_NEW_BID_TO_LISTING_REWARD = gql`
  mutation UpdateListingReward($input: updateListingRewardInput) {
    updateListingReward(input: $input) {
      listingReward {
        id
        bids {
          ${BID_PAYLOAD}
        }
      }
    }
  }
`;

export const GET_MY_OUTGOING_BIDS = gql`
  query GetMyOutgoingBids($me: ID) {
    bids(where: {
      owner: $me
      status: "ACTIVE"
    }) {
      created_at
      listing_reward {
        ${DETAILED_LISTING_REWARD_PAYLOAD}
      }
    }
  }
`;

export const EXTRACT_BID_MUTATION = gql`
  mutation ExtractBid($input: deleteBidInput) {
    deleteBid(input: $input) {
      bid {
        id
        listing_reward {
          id
        }
      }
    }
  }
`;

export const DECLINE_BID_MUTATION = gql`
  mutation DeclineBid($bidID: ID!, $declineReasonID: ID) {
    updateBid(
      input: {
        where: { id: $bidID }
        data: { decline_reason: $declineReasonID, status: DECLINED }
      }
    ) {
      bid {
        id
      }
    }
  }
`;

export const UPDATE_BID_STATUS_MUTATION = gql`
  mutation UpdateBidStatus($bidID: ID!, $status: ENUM_BID_STATUS) {
    updateBidStatus(bidID: $bidID, status: $status) {
      ${BID_PAYLOAD}
    }
  }
`;

export const COUNT_VISITING_LISTING_MUTATION = gql`
  mutation CountVistingListing($listingRewardID: ID!) {
    countVisitingListingReward(listingRewardID: $listingRewardID)
  }
`;

export const GET_COMMNETS_BY_LISTING_REWARD_ID_QUERY = gql`
  query GetCommentsByListingRewardID($listingRewardID: ID!) {
    comments(where: { listing_reward: $listingRewardID }, sort: "created_at:desc") {
      ${COMMENT_PAYLOAD}
    }
  }
`;

export const CREATE_NEW_COMMENT_MUTATION = gql`
  mutation CreateNewComment($data: NewCommentInput) {
    createNewComment(input: { data: $data }) {
      comment {
        ${COMMENT_PAYLOAD}
      }
    }
  }
`;

export const VOTE_TO_COMMENT_MUTATION = gql`
  mutation VoteToComment($commentID: ID) {
    voteToComment(commentID: $commentID)
  }
`;

export const SWITCH_MARK_INAPPROPRIATE_COMMENT_MUTATION = gql`
  mutation SwitchMarkInappropriateComment($commentID: ID) {
    switchMarkInappropriateComment(commentID: $commentID)
  }
`;

export const GET_TRADER_REVIEWS_QUERY = gql`
  query GetTraderReviews($userID: ID) {
    traderReviews(where: { listing_reward: { owner: $userID } }) {
      ${TRADER_REVIEW_PAYLOAD}
    }
  }
`;

export const ADD_USER_REVIEW_MUTATION = gql`
  mutation AddUserReviewMutation($data: NewTraderReviewInput) {
    createNewTraderReview(input: { data: $data }) {
      traderReview {
        ${TRADER_REVIEW_PAYLOAD}
      }
    }
  }
`;
