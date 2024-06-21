import { ReactNode, useContext } from "react";
import Stack, { StackProps } from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme, type Theme } from "@mui/material/styles";
import { formatDistance } from "date-fns";
import _ from "lodash";

import {
  WhiteOutlinedRoundButton,
  BlackOutlinedRoundButton,
} from "@base/Button/RoundBtn";
import { CharsiContext } from "@providers/CharsiProvider";
import type { NotificationQueryData } from "@store/user/user.slice";

export interface PanelProps extends StackProps {
  color?:
    | "primary"
    | "secondary"
    | "error"
    | "warning"
    | "info"
    | "success"
    | "disabled"
    | "gradient";
  isChatAlert?: boolean;
  dateLabel?: string;
}

interface NotificationProps extends PanelProps {
  notification: NotificationQueryData;
}

const Panel = ({
  color = "primary",
  isChatAlert = false,
  dateLabel,
  children,
  ...rest
}: PanelProps) => {
  const theme: Theme = useTheme();
  const style = {
    width: "100%",
    background: theme.palette[color].main,
    color: theme.palette[color].contrastText,
    borderRadius: "8px",
    padding: "10px 15px",
  };

  const CloseIconStyle = {
    position: "absolute",
    top: -15,
    right: -25,
    color: "rgba(0, 0, 0, 0.56)",
    cursor: "pointer",
    marginBottom: "3px",
  };

  return (
    <Stack alignItems="flex-end" sx={{ position: "relative" }} {...rest}>
      {!isChatAlert && <CloseIcon sx={CloseIconStyle} />}
      <Stack direction="row" alignItems="center" spacing={1} sx={style}>
        {children}
      </Stack>
      <Typography variant="body1" color="text.secondary" mt={1}>
        {dateLabel}
      </Typography>
    </Stack>
  );
};

const Notification = ({
  notification,
  isChatAlert = false,
  ...rest
}: NotificationProps) => {
  const { pushLoadingRoute } = useContext(CharsiContext);
  const { sender, type, data } = notification;

  const PanelColor: string = (() => {
    switch (type) {
      case "ChatMessages":
        return "disabled";
      case "PurchasedMyListing":
        return "success";
      case "BidOnMyListing":
        return "info";
      case "MyOfferAccepted":
        return "warning";
      case "MyOfferDeclined":
        return "error";
      case "MyRequestResponse":
        return "gradient";
    }
  })();

  const SenderJSX: ReactNode = (
    <>
      <Avatar
        src={_.get(sender, "avatar.url", "")}
        sx={{ width: 24, height: 24 }}
      />
      <Typography variant="h6" fontWeight={500}>
        {sender.username}
      </Typography>
    </>
  );

  const Verb: string = (() => {
    switch (type) {
      case "ChatMessages":
        return "sent";
      case "PurchasedMyListing":
        return "marked";
      case "BidOnMyListing":
        return "placed a bid on";
      case "MyOfferAccepted":
        return "accepted";
      case "MyOfferDeclined":
        return "declined";
      case "MyRequestResponse":
        return "replied to";
    }
  })();

  const RecipientJSX: ReactNode = (() => {
    const YouJSX = (
      <Typography variant="h6" fontWeight={400}>
        you
      </Typography>
    );

    const YourJSX = (
      <Typography variant="h6" fontWeight={400}>
        your
      </Typography>
    );

    switch (type) {
      case "ChatMessages":
        return YouJSX;
      case "PurchasedMyListing":
        return <></>;
      case "BidOnMyListing":
        return <></>;
      case "MyOfferAccepted":
        return YourJSX;
      case "MyOfferDeclined":
        return YourJSX;
      case "MyRequestResponse":
        return YourJSX;
    }
  })();

  const ObjectJSX: ReactNode = (() => {
    switch (type) {
      case "ChatMessages":
        return (
          <Typography variant="h6" fontWeight={400}>
            a new message!
          </Typography>
        );
      case "PurchasedMyListing":
        return (
          <>
            <Typography
              color="primary"
              variant="h6"
              fontWeight={500}
              onClick={() =>
                pushLoadingRoute(`/listing/${(data as any).listing_reward.id}`)
              }
              sx={{ textDecoration: "underline", cursor: "pointer" }}
            >
              {_.get(data, "listing_reward.title", "")}
            </Typography>
            <Typography variant="h6" fontWeight={400}>
              as complete
            </Typography>
          </>
        );
      case "BidOnMyListing":
        return (
          <Typography variant="h6" fontWeight={500}>
            {_.get(data, "listing_reward.title", "")}
          </Typography>
        );
      case "MyOfferAccepted":
        return (
          <>
            <Typography variant="h6" fontWeight={400}>
              offer on
            </Typography>
            <Typography variant="h6" fontWeight={500}>
              {_.get(data, "listing_reward.title", "")}
            </Typography>
          </>
        );
      case "MyOfferDeclined":
        return (
          <>
            <Typography variant="h6" fontWeight={400}>
              offer on
            </Typography>
            <Typography variant="h6" fontWeight={500}>
              {_.get(data, "listing_reward.title", "")}
            </Typography>
          </>
        );
      case "MyRequestResponse":
      //return YourJSX;
    }
  })();

  const NavicationButton: ReactNode = (() => {
    let buttonInfo: {
      text: string;
      link: string;
    } = { text: "", link: "" };
    switch (type) {
      case "ChatMessages":
        buttonInfo.text = "View Message";
        buttonInfo.link = `/chat#${_.get(data, "chatRoomID", "")}`;
        break;
      case "PurchasedMyListing":
        buttonInfo.text = "Confirm Trade";
        buttonInfo.link = `/account/past-trades#${_.get(data, "tradeID", "")}`;
        break;
      case "BidOnMyListing":
        buttonInfo.text = "View Bid";
        buttonInfo.link = `/listing/${_.get(
          data,
          "listing_reward.id",
          ""
        )}#${_.get(data, "bidID", "")}`;
        break;
      case "MyOfferAccepted":
        buttonInfo.text = "Confirm Trade";
        buttonInfo.link = `/account/past-trades#${_.get(data, "tradeID", "")}`;
        break;
      case "MyOfferDeclined":
        break;
      case "MyRequestResponse":
        break;
    }

    if (type === "ChatMessages") {
      return (
        <BlackOutlinedRoundButton
          onClick={() => pushLoadingRoute(buttonInfo.link)}
        >
          {buttonInfo.text}
          <ArrowForwardIcon fontSize="small" sx={{ ml: "5px" }} />
        </BlackOutlinedRoundButton>
      );
    }
    return (
      <WhiteOutlinedRoundButton
        onClick={() => pushLoadingRoute(buttonInfo.link)}
      >
        {buttonInfo.text}
        <ArrowForwardIcon fontSize="small" sx={{ ml: "5px" }} />
      </WhiteOutlinedRoundButton>
    );
  })();

  return (
    <Panel
      color={
        PanelColor as
          | "primary"
          | "secondary"
          | "error"
          | "warning"
          | "gradient"
          | "info"
          | "disabled"
      }
      dateLabel={`${formatDistance(
        new Date(notification.created_at),
        new Date()
      )} ago`}
      isChatAlert={isChatAlert}
      {...rest}
    >
      {SenderJSX}
      <Typography variant="h6" fontWeight={400}>
        {Verb}
      </Typography>
      {RecipientJSX}
      {ObjectJSX}
      <Stack flex={1} alignItems="flex-end">
        {NavicationButton}
      </Stack>
    </Panel>
  );
};

export default Notification;
