/* eslint-disable @next/next/no-img-element */
import { Fragment, useState, useEffect, useContext, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import styled from "@emotion/styled";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SvgIcon from "@mui/material/SvgIcon";
import { format } from "date-fns";
import { enqueueSnackbar } from "notistack";
import { parse } from "url";
import _ from "lodash";

import DefaultLayout from "@layouts/DefaultLayout";
import { UppercaseRoundBtn } from "@base/Button/RoundBtn";
import FullHeightSkeleton from "@base/Skeleton";
import UserInfo from "@components/Account/UserInfo";
import ViewerContent from "@components/Listing/QuickView/ViewerContent";
import ItemMultipleSlider from "@components/Listing/ItemMultipleSlider";
import PlaceBid from "@components/Listing/PlaceBid";
import AllBidsView from "@components/Listing/AllBidsView";
import CommentsAndBids from "@components/Listing/CommentsAndBids";
import UserReviewsDialog from "@components/Listing/UserReviewsDialog";
import { CharsiContext } from "@providers/CharsiProvider";
import HorizontalSeparator from "@modules/Separator/HorizontalSeparator";
import { countVisitingListing } from "@store/listing/listing.api";
import BalanceIcon from "@styles/icons/balance.svg";
import type { GameQueryData } from "@store/game/game.slice";
import type {
  ListingRewardQueryData,
  ListingQueryData,
  RewardQueryData,
  UploadFile,
  BidQueryData,
} from "@store/listing/listing.slice";
import type { UserQueryData } from "@store/user/user.slice";
import type { RootState, AppDispatch } from "@/store";

interface BidAggregateType {
  type: "NO_BIDS" | "BALANCE_BID" | "NO_BALANCE_BIDS";
  value?: number;
  bidder?: UserQueryData;
}

const StyledChip = styled(Chip)`
  padding: 4px 4px;
`;

const CurrentBalanceBid = styled(Box)`
  width: fit-content;
  background: linear-gradient(
    252.31deg,
    #7c4dff 37.91%,
    #7c4dff 37.91%,
    #fb4dff 86.97%
  );
  border-radius: 8px;
  color: white;
`;

const ListingDetail = () => {
  const router = useRouter();
  const authState = useSelector((state: RootState) => state.auth);
  const gameState = useSelector((state: RootState) => state.game);
  const listingState = useSelector((state: RootState) => state.listing);
  const { labels, getGamesData, getListingRewardByID, setIsShowLoadingScreen } =
    useContext(CharsiContext);
  const listingReward: ListingRewardQueryData | null = useMemo(
    () =>
      _.find(
        listingState.listingRewards,
        (listingReward: ListingRewardQueryData) =>
          listingReward.id === router.query?.listingId
      ) || null,
    [listingState.listingRewards, router.query?.listingId]
  );
  const [info, setInfo] = useState(null);
  const [activeBidID, setActiveBidID] = useState<string>("");
  const [isOpenAllBidsView, setIsOpenAllBidsView] = useState<boolean>(false);
  const [isOpenPlaceBid, setIsOpenPlaceBid] = useState<boolean>(false);
  const [isOpenUserReviews, setIsOpenUserReviews] = useState<boolean>(false);
  const [bidAggregate, setBidAggregate] = useState<BidAggregateType | null>(
    null
  );
  const dispatch: AppDispatch = useDispatch();

  const handleOpenViewAllBids = () => {
    setIsOpenAllBidsView(true);
  };

  const handleOpenPlaceBid = () => {
    if (!listingReward.isOpenBids) {
      enqueueSnackbar(labels.NOT_OPEN_FOR_BIDDING_MESSAGE, {
        variant: "error",
      });
      return;
    } else if (_.get(listingReward, "owner.id", "owner") === authState.id) {
      enqueueSnackbar(labels.CANNOT_BID_ON_OWN_LISTING_MESSAGE, {
        variant: "error",
      });
      return;
    } else if (
      _.findIndex(
        listingReward.bids,
        (bid: BidQueryData) => bid.owner.id === authState.id
      ) !== -1
    ) {
      enqueueSnackbar(labels.ALREADY_BID_ON_LISTING_MESSAGE, {
        variant: "error",
      });
      return;
    }

    setIsOpenPlaceBid(true);
  };

  const handleOpenUserReviews = () => {
    setIsOpenUserReviews(true);
  };

  useMemo(async () => {
    if (!listingReward) return;

    const seekingBalance: number = _.get(
      listingReward.rewards.find(
        (reward: RewardQueryData) => reward.type === "BALANCE"
      ),
      "balance",
      0
    );
    const seekingGames: string = _.get(
      listingReward.rewards.find(
        (reward: RewardQueryData) => reward.type === "ITEM"
      ),
      "game.title",
      ""
    );
    const itemGames: GameQueryData[] = _.reduce(
      listingReward.listings,
      function (currentItemGames: GameQueryData[], listing: ListingQueryData) {
        const game: GameQueryData = _.find(
          (gameState as any).games,
          (game: GameQueryData) => game.id === listing.game.id
        );
        const isIncluded: boolean =
          _.findIndex(
            currentItemGames,
            (currentGame: GameQueryData) => game.id === currentGame.id
          ) !== -1;
        if (!isIncluded) {
          return [...currentItemGames, game];
        }

        return currentItemGames;
      },
      []
    );

    setInfo({
      seekingBalance,
      seekingGames,
      itemGames,
    });

    if (!listingReward.bids.length) {
      setBidAggregate({
        type: "NO_BIDS",
      });

      return;
    }

    let highestBid: number = 0,
      highestBidder: UserQueryData | null = null;

    listingReward.bids.map((bid: BidQueryData) => {
      for (let i = 0; i < bid.rewards.length; i++) {
        if (
          bid.rewards[i].type === "BALANCE" &&
          highestBid < bid.rewards[i].balance
        ) {
          highestBid = bid.rewards[i].balance;
          highestBidder = bid.owner;
        }
      }
    });

    setBidAggregate({
      type: highestBid > 0 ? "BALANCE_BID" : "NO_BALANCE_BIDS",
      value: highestBid > 0 ? highestBid : listingReward.bids.length,
      bidder: highestBidder,
    });
  }, [gameState, listingReward]);

  const allListingImages: UploadFile[] = useMemo(() => {
    if (!listingReward) return [];
    return listingReward.listings.reduce(function (
      total: UploadFile[],
      currentListing: ListingQueryData
    ) {
      return [...total, ...currentListing.images];
    },
    []);
  }, [listingReward]);

  useEffect(() => {
    getGamesData();
    !listingReward && setIsShowLoadingScreen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (router.query?.listingId && authState.isAuthenticated) {
      dispatch(
        countVisitingListing({
          listingRewardID: router.query?.listingId,
        })
      );
    }
  }, [authState.isAuthenticated, router.query?.listingId, dispatch]);
  useEffect(() => {
    if (router.query?.listingId) {
      getListingRewardByID(router.query?.listingId as string, () => {
        setIsShowLoadingScreen(false);

        const fullURI = router.asPath;
        const { hash } = parse(fullURI || "");
        const routeHash = hash ? hash.substring(1) : "";

        if (routeHash) {
          setIsOpenAllBidsView(true);
          setActiveBidID(routeHash);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getListingRewardByID, router.query?.listingId]);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Button
        variant="outlined"
        sx={{ mb: 4, display: "flex", alignItems: "center", borderRadius: 8 }}
        onClick={() => router.back()}
      >
        <ArrowBackIcon sx={{ mr: "4px" }} />
        Go Back
      </Button>
      <Grid container spacing={2}>
        <Grid item xs={7} md={7}>
          <Stack sx={{ width: "100%" }} spacing={3}>
            <Typography variant="h4" fontWeight={500}>
              {listingReward ? (
                _.get(listingReward, "title", "")
              ) : (
                <FullHeightSkeleton width={500} />
              )}
            </Typography>
            <Stack direction="row" alignItems="center" gap={2}>
              {listingReward ? (
                <Fragment>
                  {info &&
                    info.itemGames.map((game: GameQueryData) => (
                      <StyledChip
                        key={game.id}
                        label={game.title}
                        deleteIcon={
                          <Avatar
                            src={game.image.url}
                            sx={{ width: 27, height: 27 }}
                          />
                        }
                        onDelete={() => {}}
                      />
                    ))}

                  {listingReward.isOpenBids ? (
                    <StyledChip label="Status: OPEN" color="success" />
                  ) : (
                    <StyledChip label="Status: CLOSE" color="error" />
                  )}
                </Fragment>
              ) : (
                <FullHeightSkeleton width={200} height={35} />
              )}
              {listingReward ? (
                <StyledChip
                  label={`${listingReward.visits} views`}
                  avatar={<RemoveRedEyeIcon />}
                  variant="outlined"
                />
              ) : (
                <FullHeightSkeleton width={110} height={35} />
              )}
            </Stack>
            <Typography color="grey">
              {listingReward ? (
                <Fragment>
                  Posted{" "}
                  {format(
                    new Date(listingReward.created_at),
                    "MMM. dd, yyyy @ h:mm a"
                  )}
                </Fragment>
              ) : (
                <Skeleton width={200} />
              )}
            </Typography>
            <Typography color="grey" sx={{ mt: "3px !important" }}>
              {listingReward ? (
                <Fragment>
                  Edited{" "}
                  {format(
                    new Date(listingReward.updated_at),
                    "MMM. dd, yyyy @ h:mm a"
                  )}
                </Fragment>
              ) : (
                <Skeleton width={200} />
              )}
            </Typography>
            {listingReward ? (
              <UserInfo
                user={listingReward.owner}
                onClick={handleOpenUserReviews}
                sx={{ cursor: "pointer" }}
              />
            ) : (
              <UserInfo isLoading />
            )}
            <Typography variant="h5" color="GrayText" maxWidth={620}>
              {listingReward ? (
                listingReward.description
              ) : (
                <FullHeightSkeleton width={600} height={65} />
              )}
            </Typography>
          </Stack>

          {listingReward ? (
            <ViewerContent
              listings={listingReward.listings}
              rewards={listingReward.rewards}
              sx={{ mt: 8 }}
            />
          ) : (
            <ViewerContent isLoading />
          )}
        </Grid>

        {listingReward ? (
          <Fragment>
            {allListingImages.length > 0 && (
              <Grid item xs={5} md={5}>
                <Typography variant="h5">
                  Item screenshots in this listing
                </Typography>
                <Box mt={4}>
                  <ItemMultipleSlider images={allListingImages} />
                </Box>
              </Grid>
            )}
          </Fragment>
        ) : (
          <Grid item xs={5} md={5}>
            <Typography variant="h5">
              <Skeleton width={400} />
            </Typography>
            <Box mt={4}>
              <FullHeightSkeleton width={620} height={445} />
            </Box>
          </Grid>
        )}
      </Grid>
      <Grid container spacing={10}>
        <Grid item xs={6} md={6}>
          <Stack spacing={2}>
            <Stack sx={{ mt: "50px !important" }}>
              {bidAggregate && bidAggregate.type === "BALANCE_BID" && (
                <Fragment>
                  <Typography variant="h6" textTransform="uppercase">
                    Current Charsi Balance Bid
                  </Typography>
                  <CurrentBalanceBid sx={{ mt: 2, px: 4, py: 2 }}>
                    <Typography
                      variant="h4"
                      fontWeight={500}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <SvgIcon fontSize="large" sx={{ mr: 1 }}>
                        <BalanceIcon />
                      </SvgIcon>
                      {bidAggregate.value}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <Avatar
                        src={bidAggregate.bidder.avatar.url}
                        alt="avatar"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body1" fontWeight={400}>
                        {bidAggregate.bidder.username}
                      </Typography>
                    </Box>
                  </CurrentBalanceBid>
                </Fragment>
              )}
            </Stack>

            {listingReward ? (
              <Stack direction="row" spacing={2} sx={{ mt: "30px !important" }}>
                <UppercaseRoundBtn
                  variant="contained"
                  color="primary"
                  sx={{ padding: "8px 22px" }}
                  onClick={handleOpenViewAllBids}
                >
                  View All Bids ({_.get(listingReward, "bids.length", 0)})
                </UppercaseRoundBtn>
                {listingReward.isOpenBids && (
                  <UppercaseRoundBtn
                    variant="contained"
                    color="primary"
                    sx={{ padding: "8px 22px", width: "300px" }}
                    onClick={handleOpenPlaceBid}
                    disabled={!authState.id}
                  >
                    Place Bid
                  </UppercaseRoundBtn>
                )}
              </Stack>
            ) : (
              <Box display="flex">
                <FullHeightSkeleton
                  width={170}
                  height={40}
                  sx={{ borderRadius: 48 }}
                />
                <FullHeightSkeleton
                  width={300}
                  height={40}
                  sx={{ ml: 2, borderRadius: 48 }}
                />
              </Box>
            )}
            <HorizontalSeparator label="Or" sx={{ my: "35px !important" }} />
            <UppercaseRoundBtn
              variant="contained"
              color="secondary"
              size="small"
              sx={{ padding: "8px 22px" }}
            >
              Buy Now For
              <SvgIcon fontSize="large" sx={{ mx: 1 }}>
                <BalanceIcon />
              </SvgIcon>
              15.00
            </UppercaseRoundBtn>

            <CommentsAndBids listingReward={listingReward} />
          </Stack>
        </Grid>

        <Grid item xs={6} md={6}>
          <Box
            sx={{
              width: "100%",
              height: "2px",
              border: "1px solid #E0E0E0",
              my: 10,
            }}
          />
          <Stack spacing={3}>
            <Typography variant="h5">Similar Listings</Typography>
            <Box>
              {/* <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Listing image='/tradelistings/listing_4.png' seeking={342} current_bid={43} trading='Pent Up' avatar='/avatars/james.png' name="James" />
                </Grid>
                <Grid item xs={6}>
                  <Listing image='/tradelistings/listing_4.png' seeking={342} current_bid={43} trading='Pent Up' avatar='/avatars/james.png' name="James" />
                </Grid>
              </Grid> */}
            </Box>
          </Stack>
        </Grid>
      </Grid>
      <PlaceBid
        listingReward={listingReward}
        open={isOpenPlaceBid}
        onClose={() => setIsOpenPlaceBid(false)}
      />
      <AllBidsView
        listingRewardID={router.query?.listingId as string}
        activeBidID={activeBidID}
        bids={_.get(listingReward, "bids", [])}
        isOwner={_.get(listingReward, "owner.id", "owner_id") === authState.id}
        open={isOpenAllBidsView}
        onClose={() => setIsOpenAllBidsView(false)}
      />
      {listingReward && (
        <UserReviewsDialog
          listingReward={listingReward}
          open={isOpenUserReviews}
          onClose={() => setIsOpenUserReviews(false)}
        />
      )}
    </Container>
  );
};

ListingDetail.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export default ListingDetail;
