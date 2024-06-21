import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { enqueueSnackbar } from "notistack";

import BootstrapDialogTitle from "@components/Listing/BootstrapDialogTitle";
import { ReversedSearchInput as SearchInput } from "@modules/Appbar/Appbar.style";
import { CharsiContext } from "@providers/CharsiProvider";
import { DECLINE_BID_MUTATION } from "@store/listing/listing.graphql";
import {
  updateBidStatus,
  closeListingRewardBid,
} from "@store/listing/listing.api";
import { createNewTrade } from "@store/trade/trade.api";
import BidPanel from "./BidPanel";
import client from "@/graphql";
import type { BidQueryData } from "@store/listing/listing.slice";
import type { AppDispatch } from "@/store";

interface AllBidsViewDialogProps {
  listingRewardID: string;
  activeBidID?: string;
  bids: BidQueryData[];
  isOwner: boolean;
  open: boolean;
  onClose: any;
}

export default function AllBidsViewDialog({
  listingRewardID,
  activeBidID = "",
  bids,
  isOwner = false,
  open,
  onClose,
}: AllBidsViewDialogProps) {
  const { labels, pushLoadingRoute } = useContext(CharsiContext);
  const dispatch: AppDispatch = useDispatch();

  const handleAcceptBid = (bidID: string) => {
    if (!listingRewardID || !bidID) return;

    dispatch(
      createNewTrade({
        listing_reward: listingRewardID,
        bid: bidID,
        onSuccess: () => {
          dispatch(
            closeListingRewardBid({
              listingRewardID: listingRewardID,
            })
          );

          dispatch(
            updateBidStatus({
              bidID: bidID,
              status: "ACCEPTED",
              onSuccess: () => {
                enqueueSnackbar(labels.SUCCESS_ACCEPTED_BID, {
                  variant: "success",
                });
                pushLoadingRoute("/account/past-trades");
              },
              onFail: (error) => {
                enqueueSnackbar(error.message, { variant: "error" });
              },
            })
          );
        },
        onFail: (error) => {
          enqueueSnackbar(error.message, { variant: "error" });
        },
      } as any)
    );
  };

  const handleDeclineBid =
    (bidID: string, bidDeclineReasonID: string | null) => async () => {
      try {
        if (!bidID || !bidDeclineReasonID) return;

        await client.mutate({
          mutation: DECLINE_BID_MUTATION,
          variables: {
            bidID: bidID,
            declineReasonID: bidDeclineReasonID,
          },
        });
        enqueueSnackbar(labels.SUCCESS_DECLINED_BID, { variant: "success" });
      } catch (error) {
        enqueueSnackbar(error.message, { variant: "error" });
      }
    };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <BootstrapDialogTitle onClose={onClose as any}>
        View All Bids
      </BootstrapDialogTitle>
      <DialogContent>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Stack direction="row" spacing={2}>
            <Typography variant="h5" gutterBottom>
              Current bids ({bids.length})
            </Typography>
            <SearchInput placeholder="Search for items or users associated with a bid" />
          </Stack>
          <Stack direction="column" spacing={2} sx={{ mt: 4 }}>
            {bids.length === 0 && (
              <Typography variant="h4" gutterBottom textAlign="center">
                No bids yet
              </Typography>
            )}
            {bids.map((bid: BidQueryData) => (
              <BidPanel
                key={bid.id}
                bid={bid}
                isActive={bid.id === activeBidID}
                isOwner={isOwner}
                onAccept={handleAcceptBid}
                onDecline={handleDeclineBid}
              />
            ))}
          </Stack>
        </Container>
      </DialogContent>
    </Dialog>
  );
}
