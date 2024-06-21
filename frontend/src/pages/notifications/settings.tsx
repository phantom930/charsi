import { useContext, useEffect, ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MonitorIcon from "@mui/icons-material/Monitor";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { enqueueSnackbar } from "notistack";
import _ from "lodash";

import DefaultLayout from "@layouts/DefaultLayout";
import RoundButton from "@base/Button/RoundBtn";
import { CharsiContext } from "@providers/CharsiProvider";
import { updateMyNotificationSettings } from "@store/auth/auth.api";
import { updateNotificationSetting } from "@store/auth/auth.slice";
import type { RootState, AppDispatch } from "@/store";

const rows = {
  ChatMessages: "Chat messages",
  PurchasedMyListing: "Someone purchased one of your listings",
  BidOnMyListing: "Someone bid on one of your listings",
  MyOfferAccepted: "One of your offers was accepted",
  MyOfferDeclined: "One of your offers was denied",
  MyRequestResponse:
    "You receive a response to your request (ie: middleman service)",
};

const borderStyle = "1px solid rgba(224, 224, 224, 1)";

const NotificationSettings = () => {
  const { labels, setIsShowLoadingScreen, pushLoadingRoute } =
    useContext(CharsiContext);
  const { notificationSettings, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch: AppDispatch = useDispatch();

  const handleChangeSetting =
    (setting: string, method: "browser" | "text" | "email") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      if (method === "text" && event.target.checked) {
        enqueueSnackbar("We don't support text option for now", {
          variant: "error",
        });

        return;
      }

      dispatch(
        updateNotificationSetting({
          setting,
          method,
          checked: event.target.checked,
        })
      );
      dispatch(
        updateMyNotificationSettings({
          setting,
          method,
          checked: event.target.checked,
          onSuccess: () => {
            enqueueSnackbar(labels.SUCCESS_CHANGED_NOTIFICATION_SETTINGS, {
              variant: "success",
            });
          },
          onFail: (error: Error) => {
            enqueueSnackbar(error.message, { variant: "error" });
          },
        })
      );
    };

  useEffect(() => {
    if (isAuthenticated) {
      setIsShowLoadingScreen(false);
    }
  }, [isAuthenticated, setIsShowLoadingScreen]);

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Grid container>
        <Grid item xs={12} md={3}>
          <Stack gap={2}>
            <Typography variant="h4">
              Notification
              <br />
              Settings
            </Typography>
            <RoundButton
              variant="contained"
              color="primary"
              size="large"
              onClick={() => pushLoadingRoute("/notifications")}
              sx={{ width: "fit-content" }}
            >
              View All
              <NotificationsIcon color="inherit" sx={{ ml: "5px" }} />
            </RoundButton>
          </Stack>
        </Grid>
        <Grid item xs={12} md={9}>
          <TableContainer sx={{ mt: 3 }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow sx={{ fontSize: 24, fontWeight: 400 }}>
                  <TableCell sx={{ minWidth: 400 }}></TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "inherit",
                      fontWeight: "inherit",
                      borderRight: borderStyle,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <MonitorIcon color="primary" sx={{ mr: "3px" }} />
                      Browser
                    </Stack>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "inherit",
                      fontWeight: "inherit",
                      borderRight: borderStyle,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <PhoneIphoneIcon color="primary" sx={{ mr: "3px" }} />
                      Text
                    </Stack>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "inherit",
                      fontWeight: "inherit",
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <MailOutlineIcon color="primary" sx={{ mr: "3px" }} />
                      Email
                    </Stack>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(notificationSettings).map(
                  (setting: string, index: number) => (
                    <TableRow key={index}>
                      <TableCell
                        component="th"
                        scope="row"
                        color="black"
                        sx={{ fontSize: 20 }}
                      >
                        {rows[setting]}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ borderRight: borderStyle }}
                      >
                        <Switch
                          checked={notificationSettings[setting].browser}
                          onChange={handleChangeSetting(setting, "browser")}
                        />
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ borderRight: borderStyle }}
                      >
                        <Switch
                          checked={notificationSettings[setting].text}
                          onChange={handleChangeSetting(setting, "text")}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Switch
                          checked={notificationSettings[setting].email}
                          onChange={handleChangeSetting(setting, "email")}
                        />
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

NotificationSettings.getLayout = (page) => (
  <DefaultLayout isAuthenticated>{page}</DefaultLayout>
);

export default NotificationSettings;
