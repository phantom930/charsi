import React, {
  useState,
  useEffect,
  createContext,
  FC,
  ReactNode,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, NextRouter } from "next/router";
import firebase from "firebase/app";
import { FetchPolicy } from "@apollo/client";
import Backdrop from "@mui/material/Backdrop";
import _ from "lodash";

import CharsiLoading from "@modules/CharsiLoader";
import { getGames } from "@store/game/game.api";
import { GET_USER_ONE } from "@store/user/user.graphql";
import { getChatUsers } from "@store/user/user.api";
import {
  addUser,
  loadChatRooms,
  loadChatMessages,
  pushChatMessages,
  markUnreadMessagesAsRead,
} from "@store/user/user.slice";
import {
  GET_LISTING_REWARD_QUERY,
  GET_BIDS_BY_LISTING_REWARD_ID_QUERY,
  GET_MULTIPLE_LISTINGS,
  GET_MULTIPLE_REWARDS,
  GET_MY_OUTGOING_BIDS,
  SEARCH_LISTING_REWARD_BY_TITLE_QUERY,
  COUNT_LISTING_REWARD_QUERY,
} from "@store/listing/listing.graphql";
import {
  getBidDeclineReasons,
  getListingRewardByID,
} from "@store/listing/listing.api";
import { getMyTrades } from "@store/trade/trade.api";
import type { ListingRewardQueryData } from "@store/listing/listing.slice";
import type {
  UserQueryData,
  MessageQueryData,
  ChatRoomQueryData,
  ChatMessagesAggregate,
} from "@store/user/user.slice";
import type { AppDispatch, RootState } from "@/store";
import { db } from "@utility/firebase";
import client from "@/graphql";
import labels from "./labels.json";

interface CharsiDataProps {
  labels: Object | any;
  shouldRefreshListings: boolean;
  setIsShowLoadingScreen: Function;
  refreshListings: Function;
  pushLoadingRoute: Function;
  getGamesData: Function;
  getListingsData: Function;
  countListingsData: Function;
  getListingRewardByID: Function;
  getBidsByListingRewardID: Function;
  getUserByID: Function;
  getMultipleListings: Function;
  getMultipleRewards: Function;
  searchListingRewardByTitle: Function;
  getMyOutgoingBids: Function;
  getBidDeclineReasons: Function;
  getMyTrades: Function;
  loadChatMessages: Function;
  markUnreadMessagesAsRead: Function;
}

interface CharsiProviderProps {
  children: ReactNode;
}

export const CharsiContext = createContext<CharsiDataProps>({
  labels: labels,
  shouldRefreshListings: false,
  setIsShowLoadingScreen: () => {},
  refreshListings: () => {},
  pushLoadingRoute: () => {},
  getGamesData: () => {},
  getListingsData: () => {},
  countListingsData: () => {},
  getListingRewardByID: () => {},
  getBidsByListingRewardID: () => {},
  getUserByID: () => {},
  getMultipleListings: () => {},
  getMultipleRewards: () => {},
  searchListingRewardByTitle: () => {},
  getMyOutgoingBids: () => {},
  getBidDeclineReasons: () => {},
  getMyTrades: () => {},
  loadChatMessages: () => {},
  markUnreadMessagesAsRead: () => {},
});

const CharsiProvider: FC<CharsiProviderProps> = ({ children }) => {
  const authState = useSelector((state: RootState) => state.auth);
  const userState = useSelector((state: RootState) => state.user);
  const listingState = useSelector((state: RootState) => state.listing);
  const [isShowLoadingScreen, setIsShowLoadingScreen] =
    useState<boolean>(false);
  const [shouldRefreshListings, setShouldRefreshListings] =
    useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const router: NextRouter = useRouter();

  const handleRefreshListings = () => {
    setShouldRefreshListings((prev: boolean) => !prev);
  };

  const handlePushLoadingRoute = (route: string) => {
    if (router.asPath !== route) {
      setIsShowLoadingScreen(true);
    }
    router.push(route);
  };

  const handleGetGamesData = () => {
    dispatch(getGames());
  };

  const handleGetListingsData = async (
    { where, start, limit },
    fetchPolicy: FetchPolicy = "cache-first" as FetchPolicy
  ) => {
    try {
      const { data } = await client.query({
        query: GET_LISTING_REWARD_QUERY,
        variables: { where, start, limit },
        fetchPolicy,
      });

      return data.listingRewards;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const handleCountListingsData = async (
    where: object,
    fetchPolicy: FetchPolicy = "cache-first" as FetchPolicy
  ) => {
    try {
      const { start, limit, ...rest } = where as any;
      const { data } = await client.query({
        query: COUNT_LISTING_REWARD_QUERY,
        variables: { where: { ...rest }, start, limit },
        fetchPolicy,
      });

      return data.countListingRewards;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const handleGetListingRewardByID = (
    listingID: string,
    callback: Function | null
  ) => {
    const listingReward = _.find(
      listingState.listingRewards,
      (listingReward: ListingRewardQueryData) => listingReward.id === listingID
    );

    if (listingReward) {
      callback && callback();
      return listingReward;
    }

    dispatch(
      getListingRewardByID({
        listingID,
        callback,
      })
    );
  };

  const handleGetBidsByListingRewardID = async (listingRewardID: string) => {
    try {
      const { data } = await client.query({
        query: GET_BIDS_BY_LISTING_REWARD_ID_QUERY,
        variables: { listingRewardID },
      });

      return data.bids;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const handleGetOneUser = async (userID: string) => {
    try {
      const selectedUser = _.find(
        userState.users,
        (user: UserQueryData) => user.id === userID
      );
      if (selectedUser) return selectedUser;

      const { data } = await client.query({
        query: GET_USER_ONE,
        variables: {
          input: userID,
        },
      });

      dispatch(addUser(data.users[0]));

      return data.users[0];
    } catch (error) {
      console.log(error.message);

      return null;
    }
  };

  const handleGetMultipleListingsData = async (listingIDs: string[]) => {
    try {
      const { data } = await client.query({
        query: GET_MULTIPLE_LISTINGS,
        variables: { input: listingIDs },
      });

      return data.listings;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const handleGetMultipleRewardsData = async (rewardIDs: string[]) => {
    try {
      const { data } = await client.query({
        query: GET_MULTIPLE_REWARDS,
        variables: { input: rewardIDs },
      });

      return data.rewards;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const handleSearchListingRewardByTitle = async (title: string) => {
    try {
      const { data } = await client.query({
        query: SEARCH_LISTING_REWARD_BY_TITLE_QUERY,
        variables: { input: title },
      });

      return data.listingRewards;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const handleGetMyOutgoingBids = async (userID: string) => {
    try {
      const { data } = await client.query({
        query: GET_MY_OUTGOING_BIDS,
        variables: { me: userID },
      });

      return data.bids.map((bid) => ({
        myBidCreatedAt: bid.created_at,
        ...bid.listing_reward,
      }));
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const handleGetBidDeclineReasons = () => {
    dispatch(getBidDeclineReasons());
  };

  const handleGetMyTrades = (ownerID: string) => {
    dispatch(getMyTrades(ownerID));
  };

  const handleLoadChatMessages = async (roomID: string) => {
    try {
      const querySnapshot = await db
        .collection("chats")
        .where("chatRoom", "==", roomID)
        .orderBy("created_at", "asc")
        .get();
      const chats: MessageQueryData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        chats.push({
          text: data.message,
          isMine: data.sender === authState.id,
          isNotification: data.isNotification || false,
          notificationData: data.notificationData || {},
          read: data.read,
          created_at: data.created_at.toDate().toISOString(),
        });
      });

      dispatch(loadChatMessages({ roomID: roomID, messages: chats }));
      return chats;
    } catch (error) {
      throw error;
    }
  };

  const handleMarkUnreadMessagesAsRead = async (roomID: string) => {
    try {
      const querySnapshot = await db
        .collection("chats")
        .where("chatRoom", "==", roomID)
        .where("recipient", "==", authState.id)
        .where("read", "==", false)
        .get();
      const batch = db.batch();
      querySnapshot.forEach((doc) => {
        batch.update(doc.ref, { read: true });
      });
      await batch.commit();
      dispatch(markUnreadMessagesAsRead(roomID));
    } catch (error) {
      throw error;
    }
  };

  const handleGetNewMessages = async () => {
    try {
      const aggregate: ChatMessagesAggregate = {};
      const querySnapshot = await db
        .collection("chats")
        .where("recipient", "==", authState.id)
        .where("read", "==", false)
        .orderBy("chatRoom", "asc")
        .orderBy("created_at", "asc")
        .get();
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (!aggregate[data.chatRoom]) {
          aggregate[data.chatRoom] = {
            count: 0,
            messages: [],
          };
        }
        aggregate[data.chatRoom].count++;
        aggregate[data.chatRoom].messages.push({
          text: data.message,
          isMine: data.sender === authState.id,
          isNotification: data.isNotification || false,
          notificationData: data.notificationData || {},
          read: data.read,
          created_at: data.created_at.toDate().toISOString(),
        });
      });

      dispatch(pushChatMessages(aggregate));
    } catch (error) {
      throw error;
    }
  };
  const handleMonitorChatRooms = async () => {
    let chatRoomsQuerySnapshots: {
      bySender: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;
      byRecipient: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;
    } = {
      bySender: null,
      byRecipient: null,
    };

    const storeRooms = () => {
      let collectedRooms = [
        ...(chatRoomsQuerySnapshots.bySender
          ? chatRoomsQuerySnapshots.bySender.docs
          : []),
        ...(chatRoomsQuerySnapshots.byRecipient
          ? chatRoomsQuerySnapshots.byRecipient.docs
          : []),
      ];

      collectedRooms = collectedRooms.sort((snapShot1, snapShot2) => {
        const data1 = snapShot1.data();
        const data2 = snapShot2.data();

        return (
          data2.updated_at.toDate().getTime() -
          data1.updated_at.toDate().getTime()
        );
      });

      const rooms: ChatRoomQueryData[] = [];
      const nonExistentUserIDs: string[] = [];
      collectedRooms.forEach((doc) => {
        const data = doc.data();
        let sender: UserQueryData, recipient: UserQueryData;
        if (data.sender === authState.id) {
          sender = { id: authState.id };
          recipient = _.find(userState.users, { id: data.recipient });
          if (!recipient) {
            recipient = { id: data.recipient };
            nonExistentUserIDs.push(data.recipient);
          }
        } else if (data.recipient === authState.id) {
          recipient = { id: authState.id };
          sender = _.find(userState.users, { id: data.sender });
          if (!sender) {
            sender = { id: data.sender };
            nonExistentUserIDs.push(data.sender);
          }
        }
        rooms.push({
          id: doc.id,
          type: data.type,
          sender,
          recipient,
          isTemporary: false,
          unreadMessages: 0,
          created_at: data.created_at.toDate().toISOString(),
          updated_at: data.updated_at.toDate().toISOString(),
        });
      });

      dispatch(
        getChatUsers({
          input: nonExistentUserIDs,
          onSuccess: async () => {
            if (rooms.length) {
              dispatch(loadChatRooms(rooms));
            }
            await handleGetNewMessages();
          },
        })
      );
    };

    db.collection("chatrooms")
      .where("sender", "==", authState.id)
      .orderBy("updated_at", "desc")
      .onSnapshot((querySnapshots) => {
        chatRoomsQuerySnapshots.bySender = querySnapshots;
        storeRooms();
      });

    db.collection("chatrooms")
      .where("recipient", "==", authState.id)
      .orderBy("updated_at", "desc")
      .onSnapshot((querySnapshots) => {
        chatRoomsQuerySnapshots.byRecipient = querySnapshots;
        storeRooms();
      });

    if (
      (
        await db
          .collection("chatrooms")
          .where("sender", "==", authState.id)
          .get()
      ).docs.length === 0 &&
      (
        await db
          .collection("chatrooms")
          .where("recipient", "==", authState.id)
          .get()
      ).docs.length === 0
    ) {
      dispatch(loadChatRooms([]));
    }
  };

  useEffect(() => {
    if (authState.id) {
      handleMonitorChatRooms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.id]);

  return (
    <CharsiContext.Provider
      value={{
        labels: labels,
        shouldRefreshListings: shouldRefreshListings,
        setIsShowLoadingScreen: setIsShowLoadingScreen,
        refreshListings: handleRefreshListings,
        pushLoadingRoute: handlePushLoadingRoute,
        getGamesData: handleGetGamesData,
        getListingsData: handleGetListingsData,
        countListingsData: handleCountListingsData,
        getListingRewardByID: handleGetListingRewardByID,
        getBidsByListingRewardID: handleGetBidsByListingRewardID,
        getUserByID: handleGetOneUser,
        getMultipleListings: handleGetMultipleListingsData,
        getMultipleRewards: handleGetMultipleRewardsData,
        searchListingRewardByTitle: handleSearchListingRewardByTitle,
        getMyOutgoingBids: handleGetMyOutgoingBids,
        getBidDeclineReasons: handleGetBidDeclineReasons,
        getMyTrades: handleGetMyTrades,
        loadChatMessages: handleLoadChatMessages,
        markUnreadMessagesAsRead: handleMarkUnreadMessagesAsRead,
      }}
    >
      <Backdrop
        sx={{
          zIndex: 9999,
        }}
        open={isShowLoadingScreen}
      >
        <CharsiLoading />
      </Backdrop>
      {children}
    </CharsiContext.Provider>
  );
};

export default CharsiProvider;
