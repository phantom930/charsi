import { useState, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import Grid from "@mui/material/Grid";
import { Theme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import _ from "lodash";

import SignWithDiscord, {
  MobileSignWithDiscord,
} from "@base/Button/SignWithDiscord";
import Logo from "@base/Logo";
import Mobilebar from "@modules/MobileToolbar";
import { Container, SearchInput } from "./Appbar.style";
import BalanceDisplay from "./BalanceDisplay";
import type { RootState } from "@/store";

const Appbar = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const [pattern, setPattern] = useState<string>("");
  const breakpointsMd = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("md")
  );
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      router.push(`/search?pattern=${pattern}`);
    }
  };

  const { isAuthenticated } = authState;

  return (
    <Container>
      <Toolbar variant="dense">
        <Grid
          container
          mt={1}
          mb={1}
          columnGap={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 7, xxl: 10 }}
          rowSpacing={1}
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <Grid>
            <Link href="/">
              <Logo height={40} white />
            </Link>
          </Grid>

          <Grid sx={{ flexGrow: 1 }}>
            <SearchInput
              value={pattern}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPattern(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="SEARCH YOUR FAVOURITE ITEM"
            />
          </Grid>

          <Grid>
            {breakpointsMd ? (
              isAuthenticated ? (
                <BalanceDisplay />
              ) : (
                <SignWithDiscord />
              )
            ) : isAuthenticated ? (
              <Mobilebar />
            ) : (
              <MobileSignWithDiscord />
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </Container>
  );
};

export default Appbar;
