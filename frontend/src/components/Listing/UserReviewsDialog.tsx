import React, { Fragment, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import useArray from "use-array";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { enqueueSnackbar } from "notistack";

import RoundButton from "@base/Button/RoundBtn";
import UserPanel from "@base/Panel/UserPanel";
import StarsRater from "@components/Account/StarsRater";
import UserInfo from "@components/Account/UserInfo";
import BootstrapDialogTitle from "@components/Listing/BootstrapDialogTitle";
import { GET_TRADER_REVIEWS_QUERY } from "@store/listing/listing.graphql";
import { addUserReview } from "@store/listing/listing.api";
import { GET_VERIFIED_TRADE_BY_LISTING_REWARD_AND_BID_ID_QUERY } from "@store/trade/trade.graphql";
import { CharsiContext } from "@providers/CharsiProvider";
import { lisitingUrl, toCharsiDate } from "@/helpers";
import client from "@/graphql";
import type {
  ListingRewardQueryData,
  BidQueryData,
  TraderReviewQueryData,
} from "@store/listing/listing.slice";
import type { RootState, AppDispatch } from "@/store";

interface UserReviewsDialogProps {
  listingReward: ListingRewardQueryData;
  open: boolean;
  onClose: () => void;
}

export default function UserReviewsDialog({
  listingReward,
  open,
  onClose,
}: UserReviewsDialogProps) {
  const { owner } = listingReward;
  const authState = useSelector((state: RootState) => state.auth);
  const { labels } = useContext(CharsiContext);
  const [traderReviews, { set, empty }] = useArray<TraderReviewQueryData[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [isReviewable, setIsReviewable] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();

  const handleOnReviewRate = ({ rating }) => {
    setRating(rating);
  };

  const handleSubmitReview = async () => {
    if (!rating) {
      enqueueSnackbar(labels.REQUIRED_RATE_REVIEW_STARS, {
        variant: "error",
      });
      return;
    }
    if (!reviewText) {
      enqueueSnackbar(labels.REQUIRED_REVIEW_TEXT, {
        variant: "error",
      });
      return;
    }

    try {
      dispatch(
        addUserReview({
          data: {
            listing_reward: listingReward.id,
            text: reviewText,
            stars: rating,
          },
          onSuccess: (traderReview) => {
            const reviews = [{ ...traderReview }, ...traderReviews];

            enqueueSnackbar(labels.SUCCESS_SUBMITTED_TRADER_REVIEW, {
              variant: "success",
            });
            set(reviews);
            setRating(0);
            setReviewText("");
            setIsReviewable(false);
          },
          onFail: (error) => {
            enqueueSnackbar(error.message, {
              variant: "error",
            });
          },
        })
      );
    } catch (err) {
      console.log("error: ", err);
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    }
  };

  const handleVisitVerifiedTrade = () => {
    window.open(lisitingUrl(listingReward.id), "_blank");
  };

  useEffect(() => {
    if (open) {
      (async () => {
        const { data } = await client.query({
          query: GET_TRADER_REVIEWS_QUERY,
          variables: {
            userID: owner.id,
          },
        });

        set(data.traderReviews);
      })();
    } else {
      empty();
      setRating(0);
      setReviewText("");
      setIsReviewable(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;

    (async () => {
      if (!authState.isAuthenticated) {
        setIsReviewable(false);
        return;
      }
      if (owner.id === authState.id) {
        setIsReviewable(false);
        return;
      }
      const acceptedBid: BidQueryData | undefined = listingReward.bids.find(
        (bid: BidQueryData) => {
          return bid.status === "ACCEPTED" && bid.owner.id === authState.id;
        }
      );

      if (acceptedBid === undefined) {
        setIsReviewable(false);
        return;
      }
      const { data } = await client.query({
        query: GET_VERIFIED_TRADE_BY_LISTING_REWARD_AND_BID_ID_QUERY,
        variables: { listingRewardID: listingReward.id, bidID: acceptedBid.id },
      });

      setIsReviewable(!!data.trades.length);
    })();
  }, [
    authState.id,
    authState.isAuthenticated,
    listingReward.bids,
    listingReward.id,
    owner.id,
    open,
  ]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <BootstrapDialogTitle onClose={onClose as any}>
        Reviews For {owner.username}
      </BootstrapDialogTitle>
      <DialogContent>
        <Container maxWidth="xl" sx={{ height: "100%", py: 4 }}>
          <Stack flex="1">
            <UserInfo user={owner} size="large" justifyContent="center" />
            <Grid container spacing={2} mt={3}>
              {traderReviews.map(
                (review: TraderReviewQueryData, index: number) => (
                  <Fragment key={review.id}>
                    {index > 0 && (
                      <Grid item xs={12} my={3}>
                        <Divider variant="middle" />
                      </Grid>
                    )}
                    <Grid item xs={12} md={5}>
                      <UserInfo
                        user={review.reviewer}
                        size="small"
                        showRate={false}
                      />
                      <StarsRater rating={review.stars} interactive={false} />
                      <Typography variant="body2" color="grey">
                        reviewed on {toCharsiDate(new Date(review.created_at))}
                      </Typography>
                      <Stack spacing={1} mt={3}>
                        <Typography variant="body1" color="grey">
                          Verified trade
                        </Typography>
                        <Stack spacing={1} direction="row" alignItems="center">
                          <UserPanel user={review.trade.listing_reward.owner} />
                          <ArrowForwardIcon
                            sx={{ mx: 2, color: "rgba(0, 0, 0, 0.6)" }}
                          />
                          <UserPanel user={review.trade.bid.owner} />
                        </Stack>
                      </Stack>
                      <Typography
                        variant="body1"
                        color="primary"
                        fontWeight={500}
                        mt={3}
                        onClick={handleVisitVerifiedTrade}
                        sx={{ textDecoration: "underline", cursor: "pointer" }}
                      >
                        {review.trade.listing_reward.title}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={7}>
                      <Typography variant="body1" sx={{ whiteSpace: "nowrap" }}>
                        {review.text}
                      </Typography>
                    </Grid>
                  </Fragment>
                )
              )}
            </Grid>
          </Stack>
          <Stack direction="row" mt={4}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={2}>
                <Typography variant="h6">Rating</Typography>
                <StarsRater rating={rating} onRate={handleOnReviewRate} />
              </Grid>
              <Grid item xs={12} md={10}>
                <TextField
                  label={`Leave a review for ${owner.username}`}
                  type="text"
                  variant="filled"
                  rows={2}
                  multiline
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText={`You can only leave a review for ${owner.username} if you have completed a trade with them.`}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  disabled={!isReviewable}
                />
                <Box width="100%" display="flex" justifyContent="flex-end">
                  <RoundButton
                    variant="contained"
                    color="primary"
                    disabled={!isReviewable}
                    onClick={handleSubmitReview}
                    sx={{ px: 3 }}
                  >
                    Submit
                  </RoundButton>
                </Box>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </DialogContent>
    </Dialog>
  );
}
