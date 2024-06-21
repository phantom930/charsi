import {
  useState,
  useEffect,
  useContext,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useSelector } from "react-redux";
import useArray from "use-array";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import _ from "lodash";

import HighlightsAutoComplete, { OptionData } from "@base/Autocomplete";
import { CharsiContext } from "@/providers/CharsiProvider";
import type { GameQueryData } from "@store/game/game.slice";
import { RootState } from "@/store";

interface GameProps {
  id: string;
  title: string;
  src: string;
  onRemoveGame: Function;
}

type MyGamesRef = {
  games: [string];
};

interface MyGameProps {
  isShowLabel?: boolean;
  alignItems?: string;
  onGamesChange?: Function;
}

const Game = ({ id, title, src, onRemoveGame }: GameProps) => {
  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      badgeContent={
        <CloseIcon
          sx={{ cursor: "pointer" }}
          color="disabled"
          onClick={() => onRemoveGame(id)}
        />
      }
      sx={{ pt: 2, pr: 2 }}
    >
      <Avatar alt={title} src={src} sx={{ width: "65px", height: "65px" }} />
    </Badge>
  );
};

const MyGames = forwardRef<MyGamesRef, MyGameProps>(
  (
    {
      isShowLabel = true,
      alignItems = "flex-start",
      onGamesChange,
    }: MyGameProps,
    ref
  ) => {
    const auth = useSelector((state: RootState) => state.auth);
    const gameState = useSelector((state: RootState) => state.game);
    const [selectedGame, setSelectedGame] = useState<OptionData>(null);
    const [selectedGames, { push, removeAt, set }] = useArray<[string] | []>(
      []
    );
    const { getGamesData } = useContext(CharsiContext);
    const breakpointsMd = useMediaQuery((theme: Theme) =>
      theme.breakpoints.up("md")
    );

    const games: [OptionData] = _.get(gameState, "games", [])
      .map((game: GameQueryData) => {
        const response: OptionData = {
          id: game.id,
          title: game.title,
          image: game.image.url,
        };

        return response;
      })
      .filter((game: OptionData) => {
        return selectedGames.includes(game?.id) === false;
      });

    const handleSelectChange = (_event: any, newOption: OptionData) => {
      setSelectedGame(newOption);
    };

    const handleAddNewGame = (_event: any) => {
      selectedGame !== null && push(selectedGame?.id);
      onGamesChange && onGamesChange([...selectedGames, selectedGame?.id]);
      setSelectedGame(null);
    };

    const handleRemoveGame = (id: string) => {
      const removeIndex: number = selectedGames.indexOf(id);

      removeAt(removeIndex);
    };

    useEffect(() => {
      auth.games.length && set(auth.games);
    }, [auth.games, set]);

    useEffect(() => {
      getGamesData();
    }, [getGamesData]);

    useImperativeHandle(ref, () => ({
      games: selectedGames,
    }));

    return (
      <>
        {isShowLabel && (
          <Grid
            item
            xs={12}
            md={3}
            display="flex"
            alignItems="center"
            justifyContent={breakpointsMd ? "flex-end" : "flex-start"}
          >
            <Typography variant="h5">Games</Typography>
          </Grid>
        )}
        <Grid
          item
          xs={12}
          md={9}
          display="flex"
          flexDirection="column"
          alignItems={alignItems}
        >
          <Stack direction="row" spacing={1}>
            {selectedGames.map((gameId: string) => {
              const game: GameQueryData = _.get(gameState, "games", []).find(
                (game: GameQueryData) => game.id === gameId
              );

              if (game)
                return (
                  <Game
                    key={game.id}
                    id={game.id}
                    title={game.title}
                    src={game.image.url}
                    onRemoveGame={handleRemoveGame}
                  />
                );

              return null;
            })}
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <HighlightsAutoComplete
              label="Add another game"
              value={selectedGame}
              options={games}
              onChange={handleSelectChange}
            />
            <Fab
              color="secondary"
              aria-label="add"
              size="small"
              onClick={handleAddNewGame}
            >
              <AddIcon />
            </Fab>
          </Stack>
        </Grid>
      </>
    );
  }
);

MyGames.displayName = "MyGames";

export default MyGames;
