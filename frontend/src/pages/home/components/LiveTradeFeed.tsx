import { Fragment, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Marquee from "react-fast-marquee";
import useMediaQuery from "@mui/material/useMediaQuery";
import AppBar, { AppBarProps } from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SvgIcon from "@mui/material/SvgIcon";
import EastIcon from "@mui/icons-material/East";
import { styled } from "@mui/material/styles";
import _ from "lodash";

import ThumbnailGroup from "@modules/SlideGameSelector/SlideGameSelector";
import { CharsiContext } from "@providers/CharsiProvider";
import BalanceIcon from "@styles/icons/balance.svg";
import { GET_LATEST_SUCCESS_TRADES_QUERY } from "@store/trade/trade.graphql";
import { toCharsiDateTime } from "@/helpers";
import client from "@/graphql";
import type {
  ListingRewardQueryData,
  ListingQueryData,
  RewardQueryData,
  BidQueryData,
} from "@store/listing/listing.slice";
import type { GameQueryData } from "@store/game/game.slice";
import type { TradeQueryData } from "@store/trade/trade.slice";
import type { RootState } from "@/store";

interface TradeFeed {
  [key: string]: TradeQueryData[];
}

const GameFilterBar = styled(AppBar)<AppBarProps>(({ theme }) => ({
  background: "#E0E0E0",
  marginTop: theme.spacing(12),
  color: theme.palette?.grey?.A700,
  padding: theme.spacing(2, 0),
  boxShadow: "none",
}));

const TradeFeedBar = styled(AppBar)<AppBarProps>(({ theme }) => ({
  background: "#EEE",
  padding: theme.spacing(2, 1),
  color: theme.palette?.grey?.A700,
  boxShadow: "none",
  flexDirection: "row",
  overflow: "hidden",
  height: "72px",
}));

export const LiveText = styled(Typography)`
  ::before {
    content: url("/icons/circle.png");
    margin-right: 10px;
  }
`;

const AnimatedFeedWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  width: max-content;
  white-space: nowrap;
  position: relative;
`;

const CustomGameFilterBar = () => {
  const { pushLoadingRoute } = useContext(CharsiContext);
  const gameState = useSelector((state: RootState) => state.game);
  const [selectedGame, setSelectedGame] = useState<GameQueryData>(null);
  const [trades, setTrades] = useState<TradeFeed>({});
  const [feedTimer, setFeedTimer] = useState<NodeJS.Timer | null>(null);
  const rowAlignMode = useMediaQuery((theme: any) =>
    theme.breakpoints.up("md")
  );

  const handleGameSelect = (game: GameQueryData) => {
    setSelectedGame(game);
  };

  const handleGetTradeFeed = async () => {
    const { data } = await client.query({
      query: GET_LATEST_SUCCESS_TRADES_QUERY,
      variables: {
        gameID: selectedGame.id,
        limit: 5,
      },
      fetchPolicy: "network-only",
    });

    const currentTrades = { ...trades };
    currentTrades[selectedGame.id] = data.getLatestSuccessTradesByGame;
    setTrades({ ...currentTrades });
  };

  // eslint-disable-next-line react/display-name
  const SellerItemsJSX = (listingReward: ListingRewardQueryData) => () => {
    return (
      <Fragment>
        {listingReward.listings.map(
          (listing: ListingQueryData, index: number) => (
            <Fragment key={listing.id}>
              <Avatar
                src={listing.item.image.url}
                alt="avatar"
                style={{ width: 30, height: 30 }}
              />
              <Typography variant="h6" fontWeight={600}>
                {listing.item.name}
              </Typography>
              {/* {listing.type === "ITEM" ? (
                <>
                  <Avatar
                    src={listing.item.image.url}
                    alt="avatar"
                    imgProps={{ width: 20, height: 20 }}
                  />
                  <Typography variant="h6" fontWeight={600}>
                    {listing.item.name}
                  </Typography>
                </>
              ) : (
                <>
                  <SvgIcon fontSize="medium">
                    <BalanceIcon />
                  </SvgIcon>
                  <Typography variant="h6" fontWeight={500}>
                    {listing.balance}
                  </Typography>
                </>
              )} */}
              {index < listingReward.listings.length - 1 && (
                <Typography variant="h6" fontWeight={500}>
                  +
                </Typography>
              )}
            </Fragment>
          )
        )}
      </Fragment>
    );
  };

  // eslint-disable-next-line react/display-name
  const BuyerItemsJSX = (bid: BidQueryData) => () => {
    return (
      <Fragment>
        {bid.rewards.map((reward: RewardQueryData, index: number) => (
          <Fragment key={reward.id}>
            {reward.type === "ITEM" ? (
              <>
                <Avatar
                  src={reward.item.image.url}
                  alt="avatar"
                  imgProps={{ width: 13, height: 13 }}
                />
                <Typography variant="h6" fontWeight={600}>
                  {reward.item.name}
                </Typography>
              </>
            ) : (
              <>
                <SvgIcon fontSize="medium">
                  <BalanceIcon />
                </SvgIcon>
                <Typography variant="h6" fontWeight={500}>
                  {reward.balance}
                </Typography>
              </>
            )}
            {index < bid.rewards.length - 1 && (
              <Typography variant="h6" fontWeight={500}>
                +
              </Typography>
            )}
          </Fragment>
        ))}
      </Fragment>
    );
  };

  useEffect(() => {
    return () => {
      clearInterval(feedTimer);
      setFeedTimer(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (gameState.games.length) {
      setSelectedGame(gameState.games[0]);
    }
  }, [gameState]);

  useEffect(() => {
    if (selectedGame) {
      if (feedTimer) clearInterval(feedTimer);

      setFeedTimer(
        setInterval(async () => {
          await handleGetTradeFeed();
        }, 1000 * 60)
      );

      (async () => {
        await handleGetTradeFeed();
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGame]);

  return (
    <Fragment>
      <GameFilterBar position="static">
        <Toolbar>
          <Stack
            spacing={2}
            direction={rowAlignMode ? "row" : "column"}
            alignItems="center"
            sx={{ width: "100%" }}
            justifyContent={rowAlignMode ? "flex-start" : "center"}
          >
            <LiveText variant="h4" ml={1} mr={1} color="black">
              Live Trade Feed
            </LiveText>
            <Typography ml={3}>Filter by game</Typography>
            <ThumbnailGroup
              size="small"
              active={_.get(selectedGame, "id", "")}
              onSelect={handleGameSelect}
            />
          </Stack>
        </Toolbar>
      </GameFilterBar>
      <TradeFeedBar position="static">
        <Marquee autoFill pauseOnHover speed={25}>
          <AnimatedFeedWrapper>
            {selectedGame &&
              trades[selectedGame.id] &&
              trades[selectedGame.id].length > 0 &&
              trades[selectedGame.id].map((trade: TradeQueryData) => (
                <Stack
                  key={trade.id}
                  spacing={1}
                  flex="none"
                  direction="row"
                  flexWrap="nowrap"
                  alignItems="center"
                >
                  <Typography variant="h6" fontWeight={400}>
                    {toCharsiDateTime(trade.updated_at)}
                  </Typography>
                  <Avatar
                    src={trade.listing_reward.owner.avatar.url}
                    alt="avatar"
                    imgProps={{ width: 26, height: 26 }}
                  />
                  <Typography variant="h6" fontWeight={500} color="black">
                    {trade.listing_reward.owner.username}
                  </Typography>
                  <Typography variant="h6" fontWeight={400}>
                    traded
                  </Typography>
                  {(() => {
                    const Component = SellerItemsJSX(trade.listing_reward);
                    return <Component />;
                  })()}
                  <Typography variant="h6" fontWeight={400}>
                    to
                  </Typography>
                  <Avatar
                    src={trade.bid.owner.avatar.url}
                    alt="avatar"
                    imgProps={{ width: 26, height: 26 }}
                  />
                  <Typography variant="h6" fontWeight={500} color="black">
                    {trade.bid.owner.username}
                  </Typography>
                  <Typography variant="h6" fontWeight={400}>
                    for
                  </Typography>
                  {(() => {
                    const Component = BuyerItemsJSX(trade.bid);
                    return <Component />;
                  })()}
                  <EastIcon />
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color="primary"
                    sx={{ textDecoration: "underline", cursor: "pointer" }}
                    onClick={() =>
                      pushLoadingRoute(`/listing/${trade.listing_reward.id}`)
                    }
                  >
                    {trade.listing_reward.title}
                  </Typography>
                  <Box
                    sx={{
                      marginLeft: "16px !important",
                      marginRight: "16px !important",
                      width: 14,
                      height: 14,
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      borderRadius: "50%",
                    }}
                  ></Box>
                </Stack>
              ))}
          </AnimatedFeedWrapper>
        </Marquee>
      </TradeFeedBar>
    </Fragment>
  );
};

export default CustomGameFilterBar;
