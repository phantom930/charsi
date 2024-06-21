import { FunctionComponent, useRef, useContext } from "react";
import useArray from "use-array";
import { useRouter } from "next/router";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import RoundBtn from "@base/Button/RoundBtn";
import MyGames from "@components/Account/Settings/MyGames";
import { OngoingContext } from "@providers/OngoingProvider";

const FirstStep: FunctionComponent = () => {
  const { setAccountData } = useContext(OngoingContext);
  const [selectedGames, { set: setSelectedGames }] = useArray<[string] | []>(
    []
  );
  const myGamesRef = useRef(null);
  const router = useRouter();

  const handleContinue = () => {
    router.push("/create-account/1");
    setAccountData({ games: selectedGames, phone: 123 });
  };

  const breakpoints_sm = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("sm")
  );

  const handleGamesChange = (gameIDs: string[]) => {
    setSelectedGames(gameIDs);
  };

  return (
    <>
      <Typography textAlign="center" variant={breakpoints_sm ? "h4" : "h6"}>
        Please tell us what games you play!
      </Typography>
      <Typography
        textAlign="center"
        color="grey"
        fontWeight={400}
        variant={breakpoints_sm ? "h6" : "subtitle1"}
      >
        Help us tailor your Charsi experience! Don’t worry, you can always
        modify
        <br />
        your “games played” from the Account Settings page.
      </Typography>

      <Grid container display="flex" justifyContent="center">
        <MyGames
          ref={myGamesRef}
          isShowLabel={false}
          alignItems="center"
          onGamesChange={handleGamesChange}
        />
      </Grid>

      <RoundBtn
        variant="contained"
        size="large"
        onClick={handleContinue}
        fullWidth={!breakpoints_sm}
        disabled={!Boolean(selectedGames.length)}
      >
        Continue
      </RoundBtn>
    </>
  );
};

export default FirstStep;
