import { useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";

import DefaultLayout from "@layouts/DefaultLayout";
import RoundButton from "@base/Button/RoundBtn";
import Notification from "@components/Notifications/Notification";
import { CharsiContext } from "@providers/CharsiProvider";
import { getNotifications } from "@store/user/user.api";
import type { NotificationQueryData } from "@store/user/user.slice";
import type { AppDispatch, RootState } from "@/store";

const NotificationPage = () => {
  const { setIsShowLoadingScreen, pushLoadingRoute } =
    useContext(CharsiContext);
  const { notifications, isNotificationsLoaded } = useSelector(
    (state: RootState) => state.user
  );
  const authState = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    setIsShowLoadingScreen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (authState.isAuthenticated) {
      dispatch(
        getNotifications({
          recipient: authState.id,
        })
      );
    }
  }, [authState, dispatch]);

  useEffect(() => {
    if (isNotificationsLoaded) {
      setIsShowLoadingScreen(false);
    }
  }, [isNotificationsLoaded, setIsShowLoadingScreen]);

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Grid container>
        <Grid item xs={12} md={3}>
          <Stack gap={2}>
            <Typography variant="h4">Notifications</Typography>
            <RoundButton
              variant="contained"
              color="primary"
              size="large"
              sx={{ width: "fit-content" }}
            >
              Clear All
              <DeleteIcon color="inherit" sx={{ ml: "5px" }} />
            </RoundButton>
            <RoundButton
              variant="contained"
              color="secondary"
              size="large"
              sx={{ width: "fit-content" }}
              onClick={() => pushLoadingRoute("/notifications/settings")}
            >
              Settings
              <SettingsIcon color="inherit" sx={{ ml: "5px" }} />
            </RoundButton>
          </Stack>
        </Grid>
        <Grid item xs={12} md={9}>
          {notifications.map((notification: NotificationQueryData) => (
            <Notification
              key={notification.id}
              notification={notification}
              mb={2}
            />
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

NotificationPage.getLayout = (page) => (
  <DefaultLayout isAuthenticated>{page}</DefaultLayout>
);

export default NotificationPage;
