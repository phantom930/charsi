import { useMemo, useContext, FunctionComponent } from "react";
import { useSelector } from "react-redux";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ChatIcon from "@mui/icons-material/Chat";
import styled from "@emotion/styled";
import _ from "lodash";

import { Balance as BalanceIcon } from "@base/Icon";
import { CreateBtn, UserAvatar, Notification } from "./BalanceDisplay.style";
import { CharsiContext } from "@providers/CharsiProvider";
import type { ChatRoomQueryData } from "@store/user/user.slice";
import type { RootState } from "@/store";

const BalanceDisplayComp: FunctionComponent = () => {
  const { pushLoadingRoute } = useContext(CharsiContext);
  const auth = useSelector((state: RootState) => state.auth);
  const user = useSelector((state: RootState) => state.user);

  const unreadMessagesCount: number = useMemo(() => {
    const unreadRooms = _.filter(
      user.chatRooms,
      (chatRoom: ChatRoomQueryData) => chatRoom.unreadMessages > 0
    );
    return _.sumBy(unreadRooms, "unreadMessages");
  }, [user.chatRooms]);

  const AlignText = styled.div`
    display: flex;
    align-items: flex-end;
    flex-direction: column;
  `;

  return (
    <Stack
      spacing={1}
      alignItems="center"
      sx={{ color: "white" }}
      direction="row"
    >
      <CreateBtn />

      <Stack
        ml="24px !important"
        spacing={1}
        alignItems="center"
        direction="row"
        sx={{ cursor: "pointer" }}
        onClick={() => pushLoadingRoute("/account/billing")}
      >
        <BalanceIcon size={40} />

        <AlignText>
          <Typography
            variant="caption"
            textAlign="right"
            sx={{ fontSize: ".6em" }}
          >
            BALANCE
          </Typography>
          <Typography
            variant="h6"
            textAlign="right"
            sx={{ lineHeight: 1, color: "#4CAF50" }}
          >
            {auth.balance.toFixed(2)}
          </Typography>
        </AlignText>
      </Stack>

      <Notification />

      <IconButton
        color="inherit"
        size="medium"
        onClick={() => pushLoadingRoute("/chat")}
      >
        {unreadMessagesCount > 0 ? (
          <Badge badgeContent={unreadMessagesCount} color="error">
            <ChatIcon color="inherit" />
          </Badge>
        ) : (
          <ChatBubbleOutlineIcon color="inherit" />
        )}
      </IconButton>

      <UserAvatar src={_.get(auth, "avatar.url", "")} id={`${auth.username}`} />
    </Stack>
  );
};

export default BalanceDisplayComp;
