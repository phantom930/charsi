import { useState, useContext, MouseEvent } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Badge from "@mui/material/Badge";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/material/styles";
import { format, formatDistance } from "date-fns";
import _ from "lodash";

import RoundButton from "@base/Button/RoundBtn";
import UserPanel from "@base/Panel/UserPanel";
import GradientTypography from "@base/Typography/GradientTypography";
import ReportScamDialog from "@components/Account/ReportScamDialog";
import ViewerContent from "@components/Listing/QuickView/ViewerContent";
import Divider from "@modules/Separator/Divider";
import { CharsiContext } from "@providers/CharsiProvider";
import TradeCompletionForSellerDialog from "./TradeCompletionForSellerDialog";
import TradeCompletionForBuyerDialog from "./TradeCompletionForBuyerDialog";
import type { TradeQueryData } from "@store/trade/trade.slice";
import type { RootState } from "@/store";

export interface TradePanelProps {
  trade: TradeQueryData;
}

export interface AlertPanelProps {
  trade: TradeQueryData;
  onClickMarkComplete: (event: MouseEvent<HTMLElement>) => void;
  onClickReportScam: (event: MouseEvent<HTMLElement>) => void;
}

const StyledBox = styled(Box)({
  width: "100%",
  border: "2px solid #FF9800",
  backgroundColor: "#EEE",
  borderRadius: "8px",
});

const StyledChip = styled(Chip)({
  textTransform: "uppercase",
});

const AlertPanelBox = styled(Box)({
  width: "100%",
  backgroundColor: "#FFF",
  position: "relative",
  borderRadius: "8px",
  borderWidth: "2px",
  borderStyle: "solid",
  borderImage:
    "linear-gradient(to right, #7C4DFF 0%, #7C4DFF 0.01%, #FB4DFF 100%) 1",
});

const AlertPanel = ({
  trade,
  onClickMarkComplete,
  onClickReportScam,
}: AlertPanelProps) => {
  const authState = useSelector((state: RootState) => state.auth);
  const ownerType: "LISTING" | "BID" | "" =
    authState.id === trade.listing_reward.owner.id
      ? "LISTING"
      : authState.id === trade.bid.owner.id
      ? "BID"
      : "";

  return (
    <AlertPanelBox px={2} py={3}>
      <Grid container>
        <Grid item xs={12} md={2} display="flex" justifyContent="center">
          <Image src="/icons/icon_info.svg" width={45} height={45} alt="info" />
        </Grid>
        <Grid item xs={12} md={10}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <GradientTypography fontSize={30} fontWeight={500}>
                Important: Next step
              </GradientTypography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                {ownerType === "LISTING"
                  ? "You just accepted an offer. Excellent! The next step is to conduct the trade."
                  : ownerType === "BID"
                  ? "Your offer was just accepted. Excellent! The next step is to conduct the trade."
                  : ""}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    visibility:
                      (ownerType === "LISTING" && trade.isSellerConfirmed) ||
                      (ownerType === "BID" && trade.isBuyerConfirmed)
                        ? "hidden"
                        : "visible",
                  }}
                >
                  <Badge
                    badgeContent={
                      <InfoIcon sx={{ color: "rgba(0, 0, 0, 0.56)", ml: 2 }} />
                    }
                  >
                    <RoundButton
                      variant="contained"
                      color="primary"
                      onClick={onClickMarkComplete}
                      fullWidth
                    >
                      Mark Trade Complete
                    </RoundButton>
                  </Badge>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Tooltip title="Feature coming soon...">
                    <div>
                      <RoundButton
                        variant="outlined"
                        color="secondary"
                        fullWidth
                      >
                        Request Middle Man
                      </RoundButton>
                    </div>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
            {ownerType === "BID" && (
              <Grid item xs={12}>
                <RoundButton
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={onClickReportScam}
                >
                  Report Scam
                </RoundButton>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </AlertPanelBox>
  );
};

const TradePanel = ({ trade }: TradePanelProps) => {
  const authState = useSelector((state: RootState) => state.auth);
  const { pushLoadingRoute } = useContext(CharsiContext);
  const [
    isOpenTradeCompletionForSellerDialog,
    setIsOpenTradeCompletionForSellerDialog,
  ] = useState<boolean>(false);
  const [
    isOpenTradeCompletionForBuyerDialog,
    setIsOpenTradeCompletionForBuyerDialog,
  ] = useState<boolean>(false);
  const [isOpenReportScamDialog, setIsOpenReportScamDialog] =
    useState<boolean>(false);
  const listingOwner = _.get(trade, "listing_reward.owner", {});
  const bidOwner = _.get(trade, "bid.owner", {});

  return (
    <>
      <StyledBox px={4} py={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <Stack spacing={3}>
              <Stack direction="row" alignItems="center">
                {trade.status === "TRADING" ? (
                  <StyledChip label="Trade in Progress" color="warning" />
                ) : listingOwner.id === authState.id ? (
                  <StyledChip label="Items Traded" color="primary" />
                ) : (
                  <StyledChip label="Items Received" color="secondary" />
                )}
                <Typography
                  variant="h4"
                  fontWeight={600}
                  ml={2}
                  alignItems="center"
                >
                  {trade.listing_reward.title}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center">
                <Typography
                  variant="subtitle1"
                  fontWeight={trade.status === "TRADING" ? 600 : 500}
                  color="text.secondary"
                >
                  {trade.status === "TRADING"
                    ? "trade not completed •"
                    : `trade completed ${formatDistance(
                        new Date(trade.updated_at),
                        new Date()
                      )} ago •`}
                </Typography>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  ml={1}
                  color="text.secondary"
                >
                  listing created{" "}
                  {format(
                    new Date(trade.listing_reward.created_at),
                    "MMM. dd, yyyy @ h:mm a"
                  )}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={2}>
                <UserPanel user={listingOwner} />
                <ArrowForwardIcon sx={{ mx: 2, color: "rgba(0, 0, 0, 0.6)" }} />
                <UserPanel user={bidOwner} />
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={5} display="flex" justifyContent="flex-end">
            {trade.status === "TRADING" ? (
              <AlertPanel
                trade={trade}
                onClickMarkComplete={() =>
                  authState.id === listingOwner.id
                    ? setIsOpenTradeCompletionForSellerDialog(true)
                    : setIsOpenTradeCompletionForBuyerDialog(true)
                }
                onClickReportScam={() => setIsOpenReportScamDialog(true)}
              />
            ) : (
              <Stack direction="column" spacing={2}>
                <RoundButton
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    pushLoadingRoute(`/listing/${trade.listing_reward.id}`)
                  }
                  sx={{ height: "fit-content" }}
                >
                  View Listing
                  <ArrowForwardIcon sx={{ ml: 1 }} />
                </RoundButton>
                <RoundButton
                  variant="contained"
                  color="secondary"
                  sx={{ height: "fit-content" }}
                >
                  Leave a Review
                </RoundButton>
              </Stack>
            )}
          </Grid>
          <Grid
            item
            xs={12}
            my={1}
            pr={10}
            display="flex"
            justifyContent="flex-start"
          >
            <Divider direction="horizontal" width="100%" height={0} />
          </Grid>
          <Grid item xs={12} display="flex">
            <ViewerContent
              listings={_.get(trade, "listing_reward.listings", [])}
              listingLabel="Items to be Given"
            />
            <Divider
              direction="vertical"
              width={0}
              height="100%"
              sx={{ marginLeft: "16px", marginRight: "16px" }}
            />
            <ViewerContent
              rewards={_.get(trade, "bid.rewards", [])}
              rewardLabel="Items to be Received"
            />
          </Grid>
        </Grid>
      </StyledBox>
      <ReportScamDialog
        open={isOpenReportScamDialog}
        onClose={() => setIsOpenReportScamDialog(false)}
        accusedUser={listingOwner}
        trade={trade}
      />
      <TradeCompletionForSellerDialog
        open={isOpenTradeCompletionForSellerDialog}
        onClose={() => setIsOpenTradeCompletionForSellerDialog(false)}
        tradeID={trade.id}
        listingOwner={_.get(trade, "bid.owner", {})}
        listings={_.get(trade, "listing_reward.listings", [])}
        rewards={_.get(trade, "bid.rewards", [])}
      />
      <TradeCompletionForBuyerDialog
        open={isOpenTradeCompletionForBuyerDialog}
        onClose={() => setIsOpenTradeCompletionForBuyerDialog(false)}
        trade={trade}
      />
    </>
  );
};

export default TradePanel;
