import Grid from "@mui/material/Grid";
import { Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import TradeListing from "@base/TradeListing/TradeListing";

const dataSourse = [
  {
    image: "tradelistings/listing_1.png",
    seeking: 85,
    current_bid: 55.56,
    trading: "Pent-Up Glowing Essence",
    avatar: "avatar1.png",
    name: "Vexious",
  },
  {
    image: "tradelistings/listing_2.png",
    seeking: 85,
    current_bid: 55.56,
    trading: "Pent-Up Glowing Essence",
    avatar: "avatar2.png",
    name: "iLikeToPlayDiabloGames",
  },
  {
    image: "tradelistings/listing_3.png",
    seeking: 85,
    current_bid: 55.56,
    trading: "Pent-Up Glowing Essence",
    avatar: "avatar2.png",
    name: "iLikeToPlayDiabloGames",
  },
  {
    image: "tradelistings/listing_2.png",
    seeking: 85,
    current_bid: 55.56,
    trading: "Pent-Up Glowing Essence",
    avatar: "avatar2.png",
    name: "iLikeToPlayDiabloGames",
  },
];

const TradeListingGroup = () => {
  const md = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const list = md ? dataSourse.slice(0, -1) : dataSourse;
  return (
    <Grid container>
      {list.map((item, key) => (
        <Grid item key={key} xs={12} sm={6} md={6} lg={4} p={1}>
          <TradeListing {...item} />
        </Grid>
      ))}
    </Grid>
  );
};

export default TradeListingGroup;
