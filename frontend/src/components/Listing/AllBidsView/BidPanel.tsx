import React, {
  Fragment,
  useMemo,
  useState,
  useEffect,
  useContext,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { formatDistance } from "date-fns";
import { useSnackbar } from "notistack";
import _ from "lodash";

import RoundButton from "@base/Button/RoundBtn";
import HighlightsAutoComplete from "@base/Autocomplete";
import type { OptionData } from "@base/Autocomplete";
import { ConfirmationDialog } from "@base/Alert";
import ViewerContent from "@components/Listing/QuickView/ViewerContent";
import { extractMyBid } from "@store/listing/listing.api";
import type {
  BidDeclineReasonQueryData,
  BidQueryData,
} from "@store/listing/listing.slice";
import { CharsiContext } from "@providers/CharsiProvider";
import type { RootState, AppDispatch } from "@/store";

interface BidPanelProps {
  bid: BidQueryData;
  isActive?: boolean;
  isOwner?: boolean;
  onRetractMyBid?: Function | undefined;
  onAccept?: Function | undefined;
  onDecline?: Function | undefined;
}

const MyBidChip = styled(Chip)({
  background:
    "#DDD !important",
  borderRadius: "100px",
  padding: "4px 16px",
  textTransform: "uppercase",
  color: "white",
});
export const BidPanel = ({
  bid,
  isActive = false,
  isOwner = false,
  onRetractMyBid = undefined,
  onAccept = undefined,
  onDecline = undefined,
}: BidPanelProps) => {
  const authState = useSelector((state: RootState) => state.auth);
  const bidDeclineReasons = useSelector(
    (state: RootState) => (state.listing as any).bidDeclineReasons
  );
  const { labels, getBidDeclineReasons, setIsShowLoadingScreen } =
    useContext(CharsiContext);
  const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] =
    useState<boolean>(false);
  const [
    isOpenBidAcceptConfirmationDialog,
    setIsOpenBidAcceptConfirmationDialog,
  ] = useState<boolean>(false);
  const [isShowDeclineReasons, setIsShowDeclineReasons] =
    useState<boolean>(false);
  const [isRetractingBid, setIsRetractingBid] = useState<boolean>(false);
  const [selectedDeclineReason, setSelectedDeclineReason] =
    useState<OptionData>(null);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch: AppDispatch = useDispatch();

  const isMyBid: boolean =
    _.get(bid, "owner.id", "owner") === _.get(authState, "id", "auth");

  const isAcceptedBid: boolean = useMemo(() => {
    return bid.status === "ACCEPTED";
  }, [bid.status]);

  const BidDeclineReasonOptions = bidDeclineReasons.map(
    (bidDeclineReason: BidDeclineReasonQueryData) => ({
      id: bidDeclineReason.id,
      title: bidDeclineReason.reason,
    })
  );
  const handleRetractMyBid = async () => {
    try {
      if (!isMyBid) return;

      setIsRetractingBid(true);
      setIsShowLoadingScreen(true);

      dispatch(
        extractMyBid({
          input: {
            where: {
              id: bid.id,
            },
          },
          onSuccess: () => {
            enqueueSnackbar(labels.SUCCESS_BID_RETRACTED, {
              variant: "success",
            });
            setIsRetractingBid(false);
            setIsOpenConfirmationDialog(false);
            setIsShowLoadingScreen(false);
            onRetractMyBid && onRetractMyBid();
          },
        })
      );
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
      setIsRetractingBid(false);
      setIsShowLoadingScreen(false);
    }
  };

  const handleSelectDeclineReason = (_event: any, newOption: OptionData) => {
    setSelectedDeclineReason(newOption);
  };

  useEffect(() => {
    if (isShowDeclineReasons) {
      getBidDeclineReasons();
    }
  }, [isShowDeclineReasons, getBidDeclineReasons]);

  return (
    <Fragment>
      <Box
        sx={Object.assign(
          {
            width: "100%",
            borderRadius: "8px",
            background:
              isAcceptedBid || isMyBid
                ? "#DDD"
                : isActive
                ? "linear-gradient(265.32deg, rgba(124, 77, 255, 0.15) -3.64%, rgba(124, 77, 255, 0.26) -3.63%, rgba(251, 77, 255, 0.15) 67.56%)"
                : "#E0E0E0",
          },
          isMyBid
            ? {
                border: "none",
                padding: "2px",
              }
            : {}
        )}
      >
        <Container
          maxWidth="lg"
          sx={Object.assign(
            { py: 2 },
            isMyBid ? { backgroundColor: "#E0E0E0", borderRadius: "5px" } : {}
          )}
        >
          <Grid container>
            <Grid item md={isOwner ? 9 : 12}>
              <Stack direction="column" spacing={2}>
                {isMyBid && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: " space-between",
                      alignItems: "center",
                    }}
                  >
                    <MyBidChip label="My Bid" />
                    {!isAcceptedBid && (
                      <RoundButton
                        variant="contained"
                        color="secondary"
                        sx={{ textTransform: "uppercase" }}
                        onClick={() => setIsOpenConfirmationDialog(true)}
                        disabled={isRetractingBid}
                      >
                        <CloseIcon />
                        Retract Bid
                      </RoundButton>
                    )}
                  </Box>
                )}
                <Stack>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center" }}
                  >
                    <Typography
                      variant="subtitle1"
                      color={isAcceptedBid && !isMyBid ? "white" : "black"}
                      fontWeight={400}
                      gutterBottom
                    >
                      Offer by
                    </Typography>
                    <Avatar
                      src={_.get(bid, "owner.avatar.url", "")}
                      alt={_.get(bid, "owner.avatar.name", "avatar")}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Typography
                      variant="subtitle1"
                      color={isAcceptedBid && !isMyBid ? "white" : "black"}
                      fontWeight={500}
                      gutterBottom
                    >
                      {_.get(bid, "owner.username", "")}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    fontWeight={300}
                    color={isAcceptedBid && !isMyBid ? "white" : "black"}
                  >
                    bid placed{" "}
                    {formatDistance(new Date(bid.created_at), new Date())} ago
                  </Typography>
                </Stack>
                <ViewerContent
                  rewards={bid.rewards}
                  isShowLabel={false}
                  isDark={isAcceptedBid && !isMyBid}
                  isBid={true}
                />
              </Stack>
            </Grid>
            {isOwner && (
              <Grid item md={3} py={2}>
                <Stack
                  width="100%"
                  height="100%"
                  direction="column"
                  justifyContent="center"
                  px={2}
                  spacing={1}
                  borderLeft="2px solid rgba(0, 0, 0, 0.12)"
                >
                  {bid.status === "ACTIVE" && (
                    <Fragment>
                      <RoundButton
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          setIsOpenBidAcceptConfirmationDialog(true)
                        }
                      >
                        <CheckIcon sx={{ mr: 1 }} />
                        Accept
                      </RoundButton>
                      <RoundButton
                        variant="contained"
                        color="secondary"
                        onClick={() => setIsShowDeclineReasons(true)}
                      >
                        <CloseIcon sx={{ mr: 1 }} />
                        Decline
                      </RoundButton>
                    </Fragment>
                  )}
                  <Collapse in={isShowDeclineReasons}>
                    <Stack direction="column" spacing={1}>
                      <HighlightsAutoComplete
                        label="Search for properties"
                        value={selectedDeclineReason}
                        options={BidDeclineReasonOptions}
                        onChange={handleSelectDeclineReason}
                        sx={{ width: "100%" }}
                      />
                      <RoundButton
                        color="primary"
                        sx={{ textTransform: "uppercase" }}
                        onClick={
                          onDecline &&
                          onDecline(
                            bid.id,
                            _.get(selectedDeclineReason, "id", null)
                          )
                        }
                      >
                        Confirm Decline
                      </RoundButton>
                    </Stack>
                  </Collapse>
                  <RoundButton variant="outlined" color="secondary">
                    Counter Offer
                  </RoundButton>
                </Stack>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
      <ConfirmationDialog
        open={isOpenConfirmationDialog}
        onClose={() => setIsOpenConfirmationDialog(false)}
        onConfirm={handleRetractMyBid}
        title={labels.RETRACT_BID_CONFIRMATION_TITLE}
        description={labels.RETRACT_BID_CONFIRMATION_MESSAGE}
        confirmButtonText="Yes, Delete"
        cancelButtonText="Cancel"
      />
      <ConfirmationDialog
        open={isOpenBidAcceptConfirmationDialog}
        onClose={() => setIsOpenBidAcceptConfirmationDialog(false)}
        onConfirm={() => onAccept && onAccept(bid.id)}
        title={labels.ACCEPT_BID_CONFIRMATION_TITLE}
        description={labels.ACCEPT_BID_CONFIRMATION_MESSAGE}
        confirmButtonText="Yes, Accept"
        cancelButtonText="Cancel"
      />
    </Fragment>
  );
};

export default BidPanel;
