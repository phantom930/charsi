import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/system/Stack";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import styled from "@emotion/styled";
import _ from "lodash";

import CreateListing from "@components/Listing/Create";
import {
  StyledListItemButton,
  StyledListItemText,
} from "@modules/Appbar/BalanceDisplay.style";
import { clearAuth } from "@store/auth/auth.slice";
import { RootState } from "@/store";

const FloatingToolbar = styled(Paper)`
  position: fixed !important;
  border-radius: 50px !important;
  top: 50%;
  right: 10px;
  transform: translate(0, -50%);
`;

const SideToolbar = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleOpenDialog = () => {
    setIsOpenDialog(true);
  };

  const handleCloseDialog = (
    _event: {},
    _reason: "backdropClick" | "escapeKeyDown"
  ): void => {
    setIsOpenDialog(false);
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setIsOpenDrawer(open);
    };

  const handleGotoPage = (route: string) => {
    router.push(route);
    toggleDrawer(false)(null);
  };

  const handleLogout = () => {
    dispatch(clearAuth());
    toggleDrawer(false)(null);
  };

  return (
    <AppBar>
      <FloatingToolbar elevation={10}>
        <Stack alignItems="center" sx={{ height: "100%" }} spacing={2} py={2}>
          <Tooltip title="create new listing" placement="left">
            <IconButton color="inherit" size="large" onClick={handleOpenDialog}>
              <AddIcon color="inherit" />
            </IconButton>
          </Tooltip>

          <Tooltip title="notification" placement="left">
            <IconButton color="inherit" size="large">
              <Badge badgeContent={5} color="error">
                <NotificationsIcon color="inherit" />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="message" placement="left">
            <IconButton color="inherit" size="medium">
              <Badge badgeContent={5} color="error">
                <ChatBubbleOutlineIcon color="inherit" />
              </Badge>
            </IconButton>
          </Tooltip>

          <IconButton onClick={toggleDrawer(true)}>
            <Avatar src={_.get(auth, "avatar.url", "")} />
          </IconButton>
        </Stack>
      </FloatingToolbar>

      <CreateListing open={isOpenDialog} onClose={handleCloseDialog} />
      <SwipeableDrawer
        anchor="right"
        open={isOpenDrawer}
        onOpen={toggleDrawer(true)}
        onClose={toggleDrawer(false)}
      >
        <List dense>
          <StyledListItemButton
            onClick={() => handleGotoPage("/account/settings")}
          >
            <Image
              src="/icons/icon_person.svg"
              width={20}
              height={20}
              alt="person"
            />
            <StyledListItemText primary="Account Settings" />
          </StyledListItemButton>
          <StyledListItemButton
            onClick={() => handleGotoPage("/account/bids-on-items")}
          >
            <Image
              src="/icons/icon_group.svg"
              width={20}
              height={20}
              alt="group"
            />
            <StyledListItemText primary="Bids on my items" />
          </StyledListItemButton>
          <StyledListItemButton
            onClick={() => handleGotoPage("/account/outgoing-offers")}
          >
            <Image
              src="/icons/icon_layer.svg"
              width={20}
              height={20}
              alt="group"
            />
            <StyledListItemText primary="My outgoing offers" />
          </StyledListItemButton>
          <StyledListItemButton
            onClick={() => handleGotoPage("/account/past-trades")}
          >
            <Image
              src="/icons/icon_briefcase.svg"
              width={20}
              height={20}
              alt="briefcase"
            />
            <StyledListItemText primary="Past trades" />
          </StyledListItemButton>
          <ListItemButton
            color="primary"
            sx={{ mt: 1 }}
            onClick={() => handleLogout()}
          >
            <LogoutIcon color="primary" />
            <ListItemText
              sx={{
                textTransform: "uppercase",
                color: "primary.main",
                fontSize: "15px",
                fontWeight: 500,
                ml: "4px",
              }}
              color="primary"
            >
              Sign Out
            </ListItemText>
          </ListItemButton>
        </List>
      </SwipeableDrawer>
    </AppBar>
  );
};

export default SideToolbar;
