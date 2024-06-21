import { useContext, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import firebase from "firebase/app";
import Image from "next/image";
import { useMutation } from "@apollo/client";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import AddIcon from "@mui/icons-material/Add";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LogoutIcon from "@mui/icons-material/Logout";
import { styled } from "@mui/material/styles";
import { enqueueSnackbar } from "notistack";

import CreateNewList from "@base/Button/CreateNewList";
import RoundButton from "@base/Button/RoundBtn";
import PopupBinder from "@base/PopupBinder";
import { CharsiContext } from "@providers/CharsiProvider";
import { UPDATE_FCM_REGISTRATION_TOKEN_MUTATION } from "@store/auth/auth.graphql";
import { clearAuth } from "@store/auth/auth.slice";
import {
  countUnreadNotifications,
  pushNewNotification,
} from "@store/user/user.api";
import { firebaseFCMVapidKey } from "@/config";
import type { RootState, AppDispatch } from "@/store";

interface AvatarProps {
  src: string;
  id: string;
}

export const StyledListItemButton = styled(ListItemButton)({
  display: "flex",
  alignItems: "center",
  marginLeft: "5px",
});

export const StyledListItemText = styled(ListItemText)({
  marginLeft: "12px",
});

export const CreateBtn = () => {
  const largeMode = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));
  return largeMode ? (
    <CreateNewList />
  ) : (
    <Fab size="small" color="primary">
      <AddIcon />
    </Fab>
  );
};

const popupStyles = {
  "& .MuiPopover-paper": {
    borderRadius: "4px !important",
    boxShadow:
      "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12) !important",
  },
};

export const UserAvatar = (props: AvatarProps) => {
  const { pushLoadingRoute } = useContext(CharsiContext);
  const auth = useSelector((state: RootState) => state.auth);
  const largeMode = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));
  const dispatch: AppDispatch = useDispatch();

  const handleGotoPage = (route: string, callback: () => void) => {
    callback();
    pushLoadingRoute(route);
  };

  const handleLogout = (callback: () => void) => {
    dispatch(clearAuth());
    callback();
  };

  return (
    <PopupBinder
      Trigger={(triggerProps) => (
        <IconButton {...triggerProps}>
          {auth.premium ? (
            <Badge
              overlap="circular"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              badgeContent={
                <Image
                  alt="premium"
                  src="/icons/logo_gradient.svg"
                  width={15}
                  height={15}
                />
              }
            >
              <Avatar src={props.src} />
            </Badge>
          ) : (
            <Avatar src={props.src} />
          )}
          {largeMode && (
            <Typography variant="body2" color="white" ml={1}>
              {props.id}
            </Typography>
          )}
        </IconButton>
      )}
      Content={(props: any) => (
        <List dense>
          <StyledListItemButton
            onClick={() =>
              handleGotoPage("/account/settings", props.handleClose)
            }
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
            onClick={() =>
              handleGotoPage("/account/bids-on-items", props.handleClose)
            }
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
            onClick={() =>
              handleGotoPage("/account/outgoing-offers", props.handleClose)
            }
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
            onClick={() =>
              handleGotoPage("/account/past-trades", props.handleClose)
            }
          >
            <Image
              src="/icons/icon_briefcase.svg"
              width={20}
              height={20}
              alt="briefcase"
            />
            <StyledListItemText primary="Past trades" />
          </StyledListItemButton>
          <StyledListItemButton
            onClick={() =>
              handleGotoPage(
                `/account/profile/${auth.username}`,
                props.handleClose
              )
            }
          >
            <Image
              src="/icons/icon_layout.svg"
              width={20}
              height={20}
              alt="layout"
            />
            <StyledListItemText primary="Public profile" />
          </StyledListItemButton>
          <ListItemButton
            color="primary"
            sx={{ mt: 1 }}
            onClick={() => handleLogout(props.handleClose)}
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
      )}
      popupStyles={popupStyles}
    />
  );
};

export const Notification = () => {
  const { pushLoadingRoute } = useContext(CharsiContext);
  const auth = useSelector((state: RootState) => state.auth);
  const [updateFCMRegistrationToken] = useMutation(
    UPDATE_FCM_REGISTRATION_TOKEN_MUTATION
  );
  const { notificationsCount } = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();

  const handleGotoPage = (route: string, callback: () => void) => {
    callback();
    pushLoadingRoute(route);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setForegroundMessageHandler = useCallback(
    (() => {
      let cache = null;

      return () => {
        if (!cache) {
          cache = true;
          // Handle incoming messages while the app is in the foreground
          const messaging = firebase.messaging();

          window.Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              // Get the registration token for this device

              messaging
                .getToken({ vapidKey: firebaseFCMVapidKey })
                .then(async (token) => {
                  messaging.onMessage((payload) => {
                    // Show a notification or update the UI here
                    const { data } = payload;
                    dispatch(
                      pushNewNotification({
                        notificationID: data.notificationID,
                      })
                    );
                  });

                  const channel = new BroadcastChannel("fcm-notifications");
                  channel.addEventListener("message", (event) => {
                    const { data: payload } = event.data.payload;
                    dispatch(
                      pushNewNotification({
                        notificationID: payload.notificationID,
                      })
                    );
                  });

                  try {
                    await updateFCMRegistrationToken({
                      variables: {
                        token: token,
                      },
                    });
                  } catch (error) {
                    console.error(error);
                    enqueueSnackbar(error.message, { variant: "error" });
                  }
                })
                .catch((error) => console.error(error));
            }
          });
        }
      };
    })(),
    []
  );

  useEffect(() => {
    setForegroundMessageHandler();
  }, [setForegroundMessageHandler]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      dispatch(
        countUnreadNotifications({
          recipient: auth.id,
        })
      );
    }
  }, [dispatch, auth]);

  return (
    <PopupBinder
      Trigger={(triggerProps) => (
        <Tooltip title="notification">
          <IconButton color="inherit" size="medium" {...triggerProps}>
            {notificationsCount ? (
              <Badge badgeContent={notificationsCount} color="error">
                <NotificationsIcon color="inherit" />
              </Badge>
            ) : (
              <NotificationsIcon color="inherit" />
            )}
          </IconButton>
        </Tooltip>
      )}
      Content={(props: any) => (
        <List sx={{ minWidth: 345 }}>
          <Stack direction="row" justifyContent="center">
            <RoundButton
              variant="contained"
              color="primary"
              onClick={() =>
                handleGotoPage("/notifications", props.handleClose)
              }
            >
              View All Notifications
              <ArrowForwardIcon fontSize="small" sx={{ ml: 1 }} />
            </RoundButton>
            <IconButton
              onClick={() =>
                handleGotoPage("/notifications/settings", props.handleClose)
              }
              sx={{ ml: 2 }}
            >
              <SettingsIcon color="primary" fontSize="medium" />
            </IconButton>
          </Stack>
        </List>
      )}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      popupStyles={popupStyles}
    />
  );
};
