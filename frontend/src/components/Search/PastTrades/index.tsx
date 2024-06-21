import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";

import PastTradePanel from "./PastTradePanel";
import FilterOptions from "@components/Category/FilterOptions";
import { SEARCH_TRADES_BY_PATTERN_QUERY } from "@store/trade/trade.graphql";
import type { TradeQueryData } from "@store/trade/trade.slice";
import client from "@/graphql";

export interface PastTradesProps {
  pattern: string;
}
const PastTrades = ({ pattern }: PastTradesProps) => {
  const [trades, setTrades] = useState<TradeQueryData[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await client.query({
        query: SEARCH_TRADES_BY_PATTERN_QUERY,
        //variables: { pattern },
      });
      setTrades(data.trades);
    })();
  }, [pattern]);

  return (
    <Grid container spacing={2} sx={{ mt: 5 }}>
      <Grid item xs={12} md={3}>
        <FilterOptions onFilterChange={() => {}} />
      </Grid>
      <Grid item xs={12} md={9}>
        <Grid container spacing={3}>
          {trades.map((trade: TradeQueryData) => (
            <PastTradePanel key={trade.id} trade={trade} />
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PastTrades;
