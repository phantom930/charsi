/* eslint-disable @next/next/no-img-element */
import { useState, useMemo, useEffect, useContext, MouseEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/system/Stack";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Card, { CardProps } from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SvgIcon from "@mui/material/SvgIcon";
import { styled } from "@mui/material/styles";
import { formatDistance } from "date-fns";
import { enqueueSnackbar } from "notistack";
import _ from "lodash";

import BalanceIcon from "@styles/icons/balance.svg";
import ArrowNavigator from "@base/Button/ArrowNavigator";
import FullHeightSkeleton from "@base/Skeleton";
import { CharsiContext } from "@/providers/CharsiProvider";
import { switchMyFavoriteListing } from "@store/auth/auth.api";
import type { GameQueryData } from "@store/game/game.slice";
import type {
  ListingRewardQueryData,
  ListingQueryData,
  RewardQueryData,
  BidQueryData,
  UploadFile,
} from "@store/listing/listing.slice";
import type { UserQueryData } from "@/store/user/user.slice";
import type { RootState, AppDispatch } from "@/store";

interface ListingProps {
  listing: ListingRewardQueryData;
  onQuickView: Function;
  isAllListingLoaded?: boolean;
}

interface BootstrapedCardMediaProps {
  images: UploadFile[];
  isLoaded?: boolean;
  onClickQuickView: (event: MouseEvent) => void;
}

interface BidAggregateType {
  type: "NO_BIDS" | "BALANCE_BID" | "NO_BALANCE_BIDS";
  value?: number;
}

const HoverableCard = styled(Card)<CardProps>(({ theme }) => ({
  boxShadow: theme.shadows[4],
  overflow: "visible",
}));

const StyledCardContent = styled(CardContent)({
  backgroundColor: "#EEE",
});

const StyledCardActions = styled(CardActions)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#FFF",
  padding: "13px 16px !important",
}));

const RecommendButton = styled(Button)({
  width: "32px !important",
  height: "32px !important",
  minWidth: "32px !important",
  backgroundColor: "#fff",
  "&:hover": {
    backgroundColor: "rgba(250, 250, 250, 0.9)",
  },
});

const StyledChip = styled(Chip)({
  textTransform: "uppercase",
  fontSize: "15px !important",
  backgroundColor: "#865AFF",
  color: "#fff",
  padding: "4px 3px",
  borderRadius: "100px",
});

const BootstrapedCardMedia = (props: BootstrapedCardMediaProps) => {
  const [index, setIndex] = useState(0);
  const { images, onClickQuickView, isLoaded = false } = props;

  const hoverStyle = useMemo(() => {
    return {
      "& .carousel-wrapper:hover": Object.assign(
        {
          "& .MuiButton-root": {
            visibility: "visible",
            opacity: 1,
          },
        },
        Array.isArray(images) && images.length
          ? {
              "& .MuiBox-root": {
                visibility: "visible",
                opacity: 1,
              },
            }
          : {}
      ),
    };
  }, [images]);

  const StyledCarouselContainer = styled(Box)(
    {
      position: "relative",
      width: "100%",
      height: "250px",
      "& .carousel-wrapper": {
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        cursor: "pointer",
      },
      "& .carousel-wrapper img": {
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "250px",
        objectFit: "cover",
        objectPosition: "top",
        zIndex: 100,
      },
    },
    { ...hoverStyle }
  );

  const NavigatorsContainer = styled(Box)({
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    zIndex: 500,
    visibility: "hidden",
    opacity: 0,
    transition: "all 0.2s ease",
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 30%, #0000007a 75%, #000000e1 100%)",
  });

  const LeftNavigator = styled(ArrowNavigator)({
    position: "absolute",
    left: "-15px",
    top: "calc(50% - 16px)",
    fontSize: "15px",
  });

  const RightNavigator = styled(ArrowNavigator)({
    position: "absolute",
    right: "-15px",
    top: "calc(50% - 16px)",
    fontSize: "15px",
  });

  const QuickView = styled(Button)({
    position: "absolute",
    left: 0,
    right: 0,
    bottom: "18px",
    margin: "auto",
    textTransform: "uppercase",
    borderRadius: "24px",
    width: "160px",
    zIndex: 600,
    opacity: 0,
    transition: "all 0.2s ease",
  });

  const handleGoPrev = () => {
    setIndex((prev) => prev - 1);
  };

  const handleGoNext = () => {
    setIndex((prev) => prev + 1);
  };

  return (
    <StyledCarouselContainer>
      {isLoaded ? (
        <Box className="carousel-wrapper">
          <img
            src={_.get(images, `[${index}].url`, "/images/empty.jpg")}
            alt={_.get(images, `[${index}].name`, "")}
          />
          <NavigatorsContainer>
            {index > 0 && <LeftNavigator size="small" onClick={handleGoPrev} />}
            {index < images.length - 1 && (
              <RightNavigator
                size="small"
                direction="right"
                onClick={handleGoNext}
              />
            )}
          </NavigatorsContainer>
          <QuickView
            variant="outlined"
            color="secondary"
            onClick={onClickQuickView}
          >
            <RemoveRedEyeIcon sx={{ mr: 1 }} /> Quick View
          </QuickView>
        </Box>
      ) : (
        <FullHeightSkeleton width="100%" height="100%" />
      )}
    </StyledCarouselContainer>
  );
};

const Listing = (props: ListingProps) => {
  const { listing: listingData, onQuickView } = props;
  const authState = useSelector((state: RootState) => state.auth);
  const gameState = useSelector((state: RootState) => state.game);
  const {
    labels,
    getGamesData,
    getUserByID,
    getMultipleListings,
    getMultipleRewards,
    getBidsByListingRewardID,
  } = useContext(CharsiContext);
  const [listings, setListings] = useState<ListingQueryData[]>([]);
  const [rewards, setRewards] = useState<RewardQueryData[]>([]);
  const [bidAggregate, setBidAggregate] = useState<BidAggregateType | null>(
    null
  );
  const [owner, setOwner] = useState<UserQueryData>(null);
  const [info, setInfo] = useState(null);
  const [favoriteListings, setFavoriteListings] = useState<string[]>(
    authState.favoriteListings
  );
  const dispatch: AppDispatch = useDispatch();

  useMemo(async () => {
    const listingIDs = listingData.listings.map(
      (listing: ListingQueryData) => listing.id
    );
    const rewardIDs = listingData.rewards.map(
      (reward: RewardQueryData) => reward.id
    );
    setListings(await getMultipleListings(listingIDs));
    setRewards(await getMultipleRewards(rewardIDs));
  }, [
    listingData.listings,
    listingData.rewards,
    getMultipleListings,
    getMultipleRewards,
  ]);

  useMemo(async () => {
    setOwner(await getUserByID(listingData.owner.id));
  }, [getUserByID, listingData.owner.id]);

  useMemo(async () => {
    const seekingBalance: number = _.get(
      rewards.find((reward: RewardQueryData) => reward.type === "BALANCE"),
      "balance",
      0
    );
    const seekingGames: string = _.get(
      rewards.find((reward: RewardQueryData) => reward.type === "ITEM"),
      "game.title",
      ""
    );
    const itemGames: GameQueryData[] = _.reduce(
      listings,
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
  }, [gameState, listings, rewards]);

  const allListingImages: UploadFile[] = useMemo(() => {
    return listings.reduce(function (
      total: UploadFile[],
      currentListing: ListingQueryData
    ) {
      return [...total, ...currentListing.images];
    },
    []);
  }, [listings]);

  const handleQuickView = () => {
    onQuickView(listings, rewards);
  };

  const handleFavoriteGame = () => {
    if (_.get(listingData, "owner.id", "owner") === authState.id) {
      enqueueSnackbar(labels.CANNOT_FAVORITE_LISTING_MESSAGE, {
        variant: "error",
      });
      return;
    }

    let favoriteListings: string[] = [...authState.favoriteListings];
    if (favoriteListings.includes(listingData.id as never)) {
      const index = favoriteListings.indexOf(listingData.id);
      favoriteListings.splice(index, 1);
    } else {
      favoriteListings.push(listingData.id);
    }

    setFavoriteListings(favoriteListings);

    dispatch(
      switchMyFavoriteListing({ me: authState.id, listings: favoriteListings })
    );
  };

  useEffect(() => {
    getGamesData();
  }, [getGamesData]);

  useEffect(() => {
    setFavoriteListings(authState.favoriteListings);
  }, [authState.favoriteListings]);

  const isLoaded: boolean = useMemo(() => {
    if (listings.length === 0 || rewards.length === 0 || !owner || !info)
      return false;
    const isIncludingImages: boolean = !listings.every(function (
      currentListing: ListingQueryData
    ) {
      return currentListing.images.length === 0;
    });
    if (isIncludingImages && allListingImages.length === 0) return false;
    return true;
  }, [allListingImages.length, info, listings, owner, rewards.length]);

  useMemo(() => {
    (async () => {
      const bids: BidQueryData[] = await getBidsByListingRewardID(
        listingData.id
      );

      if (!bids.length) {
        setBidAggregate({
          type: "NO_BIDS",
        });

        return;
      }

      let highestBid = 0;

      bids.map((bid: BidQueryData) => {
        for (let i = 0; i < bid.rewards.length; i++) {
          if (
            bid.rewards[i].type === "BALANCE" &&
            highestBid < bid.rewards[i].balance
          )
            highestBid = bid.rewards[i].balance;
        }
      });

      setBidAggregate({
        type: highestBid > 0 ? "BALANCE_BID" : "NO_BALANCE_BIDS",
        value: highestBid > 0 ? highestBid : bids.length,
      });

      return;
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingData.id]);

  return (
    <HoverableCard>
      <BootstrapedCardMedia
        images={allListingImages}
        onClickQuickView={handleQuickView}
        isLoaded={isLoaded}
      />
      <StyledCardContent>
        <Typography color="grey" variant="body2" textTransform="uppercase">
          Trading
        </Typography>
        {isLoaded ? (
          <Link href={`/listing/${listingData.id}`}>
            <Typography
              color="primary"
              variant="h6"
              display="flex"
              alignItems="center"
              sx={{ textDecoration: "underline" }}
            >
              {listingData.title}
              <ArrowOutwardIcon fontSize="medium" />
            </Typography>
          </Link>
        ) : (
          <Typography variant="h6">
            <Skeleton width="100%" />
          </Typography>
        )}

        <Typography
          color="grey"
          variant="body2"
          mt={2}
          textTransform="uppercase"
        >
          Seeking
        </Typography>
        {isLoaded ? (
          <>
            {info && (
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
              >
                {info.seekingBalance != 0 && (
                  <Typography
                    display="flex"
                    color="green"
                    variant="h6"
                    fontWeight={600}
                    textTransform="uppercase"
                    alignItems="center"
                  >
                    <SvgIcon fontSize="medium" sx={{ mr: "5px" }}>
                      <BalanceIcon />
                    </SvgIcon>
                    {info.seekingBalance}
                  </Typography>
                )}
                {info.seekingGames && (
                  <>
                    {info.seekingBalance != 0 && (
                      <Typography
                        color="black"
                        variant="subtitle1"
                        textTransform="uppercase"
                      >
                        Or
                      </Typography>
                    )}
                    <Typography
                      color="black"
                      variant="h6"
                      fontWeight={600}
                      textTransform="uppercase"
                      paragraph
                    >
                      {info.seekingGames} Items
                    </Typography>
                  </>
                )}
              </Stack>
            )}
          </>
        ) : (
          <Typography variant="h6">
            <Skeleton width="100%" />
          </Typography>
        )}

        {isLoaded && bidAggregate !== null ? (
          <Typography
            color="grey"
            variant="body2"
            mt={2}
            textTransform="uppercase"
          >
            {bidAggregate.type === "NO_BALANCE_BIDS"
              ? "Number of Bidders"
              : "Highest Bid"}
          </Typography>
        ) : (
          <Typography variant="body1">
            <Skeleton width="100%" />
          </Typography>
        )}

        {isLoaded && bidAggregate !== null ? (
          <Stack direction="row" spacing={1} alignItems="center">
            {bidAggregate.type === "BALANCE_BID" ? (
              <Typography
                display="flex"
                color="green"
                variant="h6"
                fontWeight={600}
                textTransform="uppercase"
                alignItems="center"
              >
                <SvgIcon fontSize="medium" sx={{ mr: "5px" }}>
                  <BalanceIcon />
                </SvgIcon>
                {bidAggregate.value}
              </Typography>
            ) : bidAggregate.type === "NO_BALANCE_BIDS" ? (
              <Typography variant="h5" color="grey">
                {bidAggregate.value}
              </Typography>
            ) : (
              <Typography variant="h5" color="grey">
                ---
              </Typography>
            )}
          </Stack>
        ) : (
          <Typography variant="h5">
            <Skeleton width="100%" />
          </Typography>
        )}
      </StyledCardContent>
      <StyledCardActions>
        <Stack sx={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {isLoaded ? (
              <Stack direction="column" spacing={1}>
                {info &&
                  info.itemGames.map((game: GameQueryData) => (
                    <StyledChip
                      key={game.id}
                      label={_.get(game, "title", "")}
                      deleteIcon={
                        <Avatar
                          src={game.image.url}
                          sx={{ width: 27, height: 27 }}
                        />
                      }
                      sx={{ width: "fit-content" }}
                      onDelete={() => {}}
                    />
                  ))}
              </Stack>
            ) : (
              <Skeleton width={120} />
            )}
            <RecommendButton onClick={handleFavoriteGame}>
              {favoriteListings.includes(listingData.id as never) ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon color="error" />
              )}
            </RecommendButton>
          </Box>
          <Stack
            mt={2}
            direction="row"
            alignItems="center"
            spacing={1}
            flexWrap="wrap"
          >
            {isLoaded ? (
              <>
                <Avatar src={_.get(owner, "avatar.url", "")} />
                <Typography variant="subtitle1">
                  {_.get(owner, "username", "")}
                </Typography>
                <Typography variant="subtitle2" color="lightGrey">
                  posted{" "}
                  {formatDistance(new Date(listingData.created_at), new Date())}{" "}
                  ago
                </Typography>
              </>
            ) : (
              <>
                <Skeleton variant="circular">
                  <Avatar />
                </Skeleton>
                <Typography variant="h5">
                  <Skeleton width={70} />
                </Typography>
                <Typography variant="subtitle1">
                  <Skeleton width={140} />
                </Typography>
              </>
            )}
          </Stack>
        </Stack>
      </StyledCardActions>
    </HoverableCard>
  );
};

export default Listing;
