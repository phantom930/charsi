import { Fragment, useContext, useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack, { StackProps } from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import SvgIcon from "@mui/material/SvgIcon";
import { styled } from "@mui/material/styles";
import EastIcon from "@mui/icons-material/East";

import { LiveText } from "@pages/home/components/LiveTradeFeed";
import { CharsiContext } from "@providers/CharsiProvider";
import { GET_LATEST_SUCCESS_TRADES_QUERY } from "@store/trade/trade.graphql";
import BalanceIcon from "@styles/icons/balance.svg";
import client from "@/graphql";
import type {
  ListingRewardQueryData,
  ListingQueryData,
  RewardQueryData,
  BidQueryData,
} from "@store/listing/listing.slice";
import type { TradeQueryData } from "@store/trade/trade.slice";

const TradeFeedPanel = styled(Box)`
  display: flex;
  box-shadow: none;
  flex-direction: row;
  overflow: hidden;
  height: 72px;
`;

const AnimatedFeedWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  width: max-content;
  white-space: nowrap;
  position: relative;
`;

export interface GameLiveTradeFeedProps extends StackProps {
  gameID: string;
}

const GameLiveTradeFeed = ({ gameID, ...rest }: GameLiveTradeFeedProps) => {
  const { pushLoadingRoute } = useContext(CharsiContext);
  const [feedTimer, setFeedTimer] = useState<NodeJS.Timer | null>(null);
  const [trades, setTrades] = useState<TradeQueryData[]>([]);

  const handleGetTradeFeed = async () => {
    const { data } = await client.query({
      query: GET_LATEST_SUCCESS_TRADES_QUERY,
      variables: {
        gameID: gameID,
        limit: 5,
      },
      fetchPolicy: "network-only",
    });

    setTrades(data.getLatestSuccessTradesByGame);
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
                style={{ width: 23, height: 23 }}
              />
              <Typography variant="h6" fontWeight={500}>
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
                  style={{ width: 23, height: 23 }}
                />
                <Typography variant="h6" fontWeight={500}>
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
    if (gameID) {
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
  }, [gameID]);

  return (
    <Container maxWidth="xl" sx={{ mb: 10 }}>
      <Stack spacing={3} {...rest}>
        <LiveText variant="h4" ml={1} mr={1} color="black">
          Live Trade Feed
        </LiveText>

        <TradeFeedPanel>
          <Marquee autoFill speed={25} style={{ width: "100%" }}>
            <AnimatedFeedWrapper>
              {trades.map((trade: TradeQueryData) => (
                <Stack
                  key={trade.id}
                  spacing={1}
                  flex="none"
                  direction="row"
                  flexWrap="nowrap"
                  alignItems="center"
                >
                  <Avatar
                    src={trade.listing_reward.owner.avatar.url}
                    alt="avatar"
                    style={{ width: 23, height: 23 }}
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
                    style={{ width: 23, height: 23 }}
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
                      width: 10,
                      height: 10,
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      borderRadius: "50%",
                    }}
                  ></Box>
                </Stack>
              ))}
            </AnimatedFeedWrapper>
          </Marquee>
        </TradeFeedPanel>
      </Stack>
    </Container>
  );
};

GameLiveTradeFeed.displayName = "GameLiveTradeFeed";
export default GameLiveTradeFeed;
