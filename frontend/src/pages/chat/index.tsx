import {
  useRef,
  useMemo,
  useEffect,
  useState,
  useContext,
  useCallback,
  KeyboardEvent,
  UIEvent,
  Fragment,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
//import { collection, doc, addDoc, setDoc, updateDoc } from "firebase/firestore";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import SendIcon from "@mui/icons-material/Send";
import { styled } from "@mui/material/styles";
import { parse } from "url";
import { useSnackbar } from "notistack";
import _ from "lodash";

import RoundButton from "@base/Button/RoundBtn";
import DefaultLayout from "@layouts/DefaultLayout";
import MessageUser from "@components/Chat/MessageUser";
import MessageBox from "@components/Chat/MessageBox";
import ChatAlert from "@components/Chat/ChatAlert";
import { ReversedSearchInput as SearchInput } from "@modules/Appbar/Appbar.style";
import { CharsiContext } from "@providers/CharsiProvider";
import { db } from "@utility/firebase";
import { SEND_CHAT_NOTIFICATION_MUTATION } from "@store/user/user.graphql";
import {
  switchTemporaryChatRoom,
  pushSendingChatMessage,
} from "@store/user/user.slice";
import type {
  UserQueryData,
  ChatRoomQueryData,
  MessageQueryData,
  ChatQueryData,
} from "@store/user/user.slice";
import type { RootState, AppDispatch } from "@/store";

const ChatWrapper = styled(Grid)({
  height: "calc(100vh - 72px)",
});

const UsersBox = styled(Grid)({
  height: "100%",
  borderRight: "2px solid rgba(0, 0, 0, 0.12)",
});

let timer: NodeJS.Timeout;

const Chat = () => {
  const {
    loadChatMessages,
    pushLoadingRoute,
    setIsShowLoadingScreen,
    markUnreadMessagesAsRead,
  } = useContext(CharsiContext);
  const authState = useSelector((state: RootState) => state.auth);
  const { users, chatRooms, chats, isChatRoomsLoaded } = useSelector(
    (state: RootState) => state.user
  );
  const [routeHash, setRouteHash] = useState<string>("support");
  const [message, setMessage] = useState<string>("");
  const { enqueueSnackbar } = useSnackbar();
  const messagesWrapperRef = useRef(null);
  const [sendChatNotification] = useMutation(SEND_CHAT_NOTIFICATION_MUTATION);
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const handleKeyDownMessage = async (event: KeyboardEvent<Element>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await handleSendMessage();
    }
  };

  const handleScrollMessages = (event: UIEvent<Element>) => {
    const target = event.target as HTMLElement;
    const scrollTop: number = target.scrollTop;
    const scrollHeight: number = target.scrollHeight;
    const clientHeight: number = target.clientHeight;

    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
    if (isAtBottom && chatDetails && chatDetails.room.unreadMessages) {
      setTimeout(() => {
        markUnreadMessagesAsRead(chatDetails.room.id);
      }, 2000);
    }
  };

  useEffect(() => {
    const fullURI = router.asPath;
    const { hash } = parse(fullURI || "");

    setRouteHash(hash ? hash.substring(1) : "support");
  }, [router]);

  useEffect(() => {
    setIsShowLoadingScreen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!authState.id || !isChatRoomsLoaded) return;

    (async () => {
      if (routeHash === "support" || !routeHash) {
        setIsShowLoadingScreen(false);
      } else {
        const room: ChatRoomQueryData = _.find(chatRooms, { id: routeHash });
        if (room) {
          await loadChatMessages(room.id);
        } else {
          router.replace("/chat#support");
        }

        setIsShowLoadingScreen(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeHash, isChatRoomsLoaded, authState.id]);

  const getUserByID = useCallback(
    (id: string) => _.find(users, { id }),
    [users]
  );

  const authToUser = useCallback(
    () => ({
      id: authState.id,
      username: authState.username,
      firstname: authState.firstname,
      lastname: authState.lastname,
      email: authState.email,
      phone: authState.phone,
      avatar: authState.avatar,
      balance: authState.balance,
      gameAccounts: authState.gameAccounts,
      games: authState.games,
      description: authState.description,
      trades: authState.trades,
      created_at: authState.created_at,
      updated_at: authState.updated_at,
    }),
    [authState]
  );

  const chatDetails: {
    room: ChatRoomQueryData;
    messages: MessageQueryData[];
    chatter: UserQueryData;
  } | null = useMemo(() => {
    if (routeHash === "support" || !routeHash) {
      return null;
    } else {
      let chatRoom: ChatRoomQueryData = _.cloneDeep(
        _.find(chatRooms, { id: routeHash })
      );
      let chatter: UserQueryData = null;
      const chat: ChatQueryData = _.find(chats, { roomID: routeHash });

      if (chatRoom) {
        chatRoom.sender =
          chatRoom.sender.id === authState.id
            ? authToUser()
            : getUserByID(chatRoom.sender.id);
        chatRoom.recipient =
          chatRoom.recipient.id === authState.id
            ? authToUser()
            : getUserByID(chatRoom.recipient.id);
        chatter =
          _.get(chatRoom, "sender.id", "senderID") === authState.id
            ? chatRoom.recipient
            : chatRoom.sender;
      }

      return { room: chatRoom, messages: _.get(chat, "messages", []), chatter };
    }
  }, [routeHash, chatRooms, chats, authState.id, authToUser, getUserByID]);

  const chatNotifier = {
    timeout: 1000 * 60 * 10,
    setNotification: function (chatRefID: string) {
      return async function () {
        if (!_.get(chatDetails, "room.recipient.id", "")) return;

        const newChat = await db.collection("chats").doc(chatRefID).get();

        newChat.exists &&
          newChat.data().read === false &&
          sendChatNotification({
            variables: {
              recipientID: chatDetails.chatter.id,
              chatRoomID: routeHash,
            },
          });
      }.bind(this);
    },
    start: function (chatRefID: string) {
      timer && clearTimeout(timer);
      timer = setTimeout(this.setNotification(chatRefID), this.timeout);
    },
    stop: function () {
      clearTimeout(timer);
    },
  };

  const handleSendMessage = async () => {
    if (!message) return;

    dispatch(
      pushSendingChatMessage({
        roomID: routeHash,
        message: {
          text: message,
          read: false,
          isMine: true,
          isNotification: false,
          notificationData: {},
          created_at: new Date().toISOString(),
        },
      })
    );

    try {
      const text: string = message;
      setMessage("");
      const roomID: string = routeHash;
      if (chatDetails.room.isTemporary) {
        await db.collection("chatrooms").doc(routeHash).set({
          sender: authState.id,
          recipient: chatDetails.room.recipient.id,
          type: "DM",
          created_at: new Date(),
          updated_at: new Date(),
        });
        dispatch(switchTemporaryChatRoom(chatDetails.room.id));
      }

      const docRef = await db.collection("chats").add({
        sender: authState.id,
        recipient:
          authState.id === chatDetails.room.sender.id
            ? chatDetails.room.recipient.id
            : chatDetails.room.sender.id,
        message: text,
        read: false,
        chatRoom: roomID,
        isNotification: false,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const roomRef = db.collection("chatrooms").doc(roomID);
      await roomRef.update({ updated_at: new Date() });

      chatNotifier.start(docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  useEffect(() => {
    if (messagesWrapperRef.current) {
      messagesWrapperRef.current.scrollTop =
        messagesWrapperRef.current.scrollHeight;

      if (
        messagesWrapperRef.current.scrollHeight >=
          messagesWrapperRef.current.clientHeight &&
        chatDetails &&
        chatDetails.room &&
        chatDetails.room.unreadMessages
      ) {
        setTimeout(() => {
          chatDetails &&
            chatDetails.room &&
            markUnreadMessagesAsRead(chatDetails.room.id);
        }, 2000);
      }
    }
  }, [chatDetails, markUnreadMessagesAsRead]);

  return (
    <Container maxWidth={false} disableGutters>
      <ChatWrapper container>
        <UsersBox item md={3} pt={5}>
          <Stack height="100%" spacing={3}>
            <Box pl={3}>
              <Typography variant="h4">Messages</Typography>
            </Box>
            <Box pl={3} pr={10}>
              <SearchInput placeholder="Search for user" />
            </Box>
            <Stack flex={1} height="100%" sx={{ overflowY: "auto" }}>
              <Link href="/chat#support">
                <MessageUser
                  isActive={routeHash === "support" || !routeHash}
                  isSupportTeam={true}
                />
              </Link>
              {chatRooms.map((chatRoom: ChatRoomQueryData, index: number) => {
                const user: UserQueryData = getUserByID(
                  chatRoom.sender.id === authState.id
                    ? chatRoom.recipient.id
                    : chatRoom.sender.id
                );

                return (
                  <Link
                    key={(user && user.id) || index}
                    href={`/chat#${chatRoom.id}`}
                  >
                    <MessageUser
                      isActive={routeHash === chatRoom.id}
                      avatar={_.get(user, "avatar.url", "")}
                      name={_.get(user, "username", "")}
                      unreadMessages={chatRoom.unreadMessages}
                      status="ACTIVE"
                    />
                  </Link>
                );
              })}
            </Stack>
          </Stack>
        </UsersBox>
        <Grid
          item
          md={9}
          pb={3}
          px={5}
          height="100%"
          display="flex"
          flexDirection="column"
        >
          {routeHash !== "support" && (
            <Stack
              mx={-5}
              px={2}
              mb={2}
              borderBottom="1px solid #E0E0E0"
              display="flex"
              alignItems="center"
              flexDirection="row"
              justifyContent="space-between"
              sx={{ backdropFilter: "blur(5px)" }}
              height={43}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                onClick={() =>
                  pushLoadingRoute(
                    `/account/profile/${_.get(
                      chatDetails,
                      "chatter.username",
                      ""
                    )}`
                  )
                }
                sx={{ cursor: "pointer" }}
              >
                <Avatar
                  src={_.get(chatDetails, "chatter.avatar.url", "")}
                  alt="avatar"
                  sx={{ width: 28, height: 28 }}
                />
                <Typography
                  variant="subtitle1"
                  color="primary"
                  sx={{ fontSize: 20 }}
                >
                  {_.get(chatDetails, "chatter.username", "")}
                </Typography>
              </Stack>
              <RoundButton
                variant="contained"
                color="primary"
                size="small"
                LinkComponent={Link}
                href={`/account/profile/${_.get(
                  chatDetails,
                  "chatter.username",
                  ""
                )}`}
                onClick={() =>
                  pushLoadingRoute(
                    `/account/profile/${_.get(
                      chatDetails,
                      "chatter.username",
                      ""
                    )}`
                  )
                }
              >
                View Profile
                <ArrowOutwardIcon fontSize="small" sx={{ ml: "3px" }} />
              </RoundButton>
            </Stack>
          )}

          <Stack
            flex={1}
            height={`calc(100%${routeHash === "support" ? "" : " - 59px"})`}
            justifyContent="flex-end"
            spacing={3}
          >
            <Stack
              ref={messagesWrapperRef}
              direction="column"
              height="100%"
              flex={1}
              spacing={2}
              pr={2}
              sx={{
                overflowY: "auto",
                scrollBehavior: "smooth",
                "&:last-child": {
                  scrollMarginBottom: 0,
                },
              }}
              onScroll={handleScrollMessages}
            >
              {chatDetails &&
                chatDetails.room &&
                chatDetails.messages.map(
                  (message: MessageQueryData, index: number) => {
                    const otherChatter: UserQueryData = chatDetails.chatter;
                    const messageUser: UserQueryData = message.isMine
                      ? (authToUser() as UserQueryData)
                      : otherChatter;
                    const isUnreadCursor =
                      !message.isMine &&
                      ((index === 0 && !message.read) ||
                        (index > 0 &&
                          chatDetails.messages[index - 1].read &&
                          !message.read));
                    return (
                      <Fragment key={index}>
                        {isUnreadCursor && (
                          <Divider>
                            <Typography variant="caption" color="primary">
                              Unread messages
                            </Typography>
                          </Divider>
                        )}
                        <Box
                          display="flex"
                          justifyContent={
                            message.isMine ? "flex-end" : "flex-start"
                          }
                        >
                          {message.isNotification ? (
                            message.isMine === false && (
                              <ChatAlert
                                message={message}
                                sender={otherChatter}
                              />
                            )
                          ) : (
                            <MessageBox
                              isMine={message.isMine}
                              avatar={_.get(messageUser, "avatar.url", "")}
                              username={messageUser.username}
                              message={message.text}
                              created_at={new Date(message.created_at)}
                            />
                          )}
                        </Box>
                      </Fragment>
                    );
                  }
                )}
            </Stack>
            <Stack direction="column" spacing={2}>
              <TextField
                label=""
                type="text"
                variant="filled"
                rows={3}
                multiline
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDownMessage}
              />
              <Box width="100%" display="flex" justifyContent="flex-end">
                <RoundButton
                  variant="contained"
                  color="primary"
                  onClick={handleSendMessage}
                >
                  Send
                  <SendIcon fontSize="small" sx={{ ml: 1 }} />
                </RoundButton>
              </Box>
            </Stack>
          </Stack>
        </Grid>
      </ChatWrapper>
    </Container>
  );
};

Chat.getLayout = (page) => (
  <DefaultLayout isAuthenticated={true} isShowFooter={false}>
    {page}
  </DefaultLayout>
);

export default Chat;
