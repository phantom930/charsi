import { FunctionComponent, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import "react-multi-carousel/lib/styles.css";
import styled from "@emotion/styled";

import {
  LargeThumbnail,
  MediumThumbnail,
  SmallThumbnail,
} from "@base/GameThumbnail/roundThumbnail";
import ArrowNavigator from "@base/Button/ArrowNavigator";
import type { GameQueryData } from "@store/game/game.slice";
import { CharsiContext } from "@providers/CharsiProvider";
import { uriIdGenerator } from "@/helpers";
import type { RootState } from "@/store";

type Props = {
  size: "small" | "large" | "medium";
  showCaption?: boolean;
  active?: string;
  onSelect?: (selected: any) => void;
};

const RelativeContainer = styled.div`
  position: relative;
`;

const Caption = styled(Typography)`
  position: absolute;
  width: 100%;
`;

const GameContainer = styled.div`
  position: relative;
  cursor: pointer;
`;

interface SmallProps {
  active: string;
  onSelect: (selected: GameQueryData) => void;
}

const SmallSlider = (props: SmallProps) => {
  const game = useSelector((state: RootState) => state.game);
  const breakpoints_sm = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("sm")
  );
  const borderStyle = (activated) => ({
    background: activated
      ? "linear-gradient(252.31deg, #7C4DFF 37.91%, #7C4DFF 37.91%, #FB4DFF 86.97%)"
      : "#E0E0E0",
    border: "none",
    borderRadius: "50%",
    padding: "3px",
  });
  const navigatorStyle = {
    width: 30,
    height: 30,
    minHeight: 30,
    "& svg": {
      width: 15,
      height: 15,
    },
  };

  return (
    <RelativeContainer>
      <Stack direction="row" spacing={1} alignItems="center">
        {breakpoints_sm && (
          <Fab size="small" sx={navigatorStyle}>
            <ArrowBackIcon />
          </Fab>
        )}
        {game.games.map((game: GameQueryData) => (
          <Tooltip title={game.title} key={game.id}>
            <Box sx={borderStyle(game.id === props.active)}>
              <SmallThumbnail
                src={game.image.url}
                onClick={() => props.onSelect(game)}
              />
            </Box>
          </Tooltip>
        ))}
        {breakpoints_sm && (
          <Fab size="small" sx={navigatorStyle}>
            <ArrowForwardIcon />
          </Fab>
        )}
      </Stack>
    </RelativeContainer>
  );
};

interface MediumProps {
  active: string;
  onSelect: (selected: GameQueryData) => void;
}

const MediumSlider = (props: MediumProps) => {
  const game = useSelector((state: RootState) => state.game);
  const breakpoints_sm = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("sm")
  );
  const borderStyle = (activated) => ({
    background: activated
      ? "linear-gradient(252.31deg, #7C4DFF 37.91%, #7C4DFF 37.91%, #FB4DFF 86.97%)"
      : "#E0E0E0",
    border: "none",
    borderRadius: "50%",
    padding: "3px",
  });

  return (
    <RelativeContainer>
      <Stack direction="row" spacing={1} alignItems="center">
        {breakpoints_sm && <ArrowNavigator direction="left" size="small" />}
        {game.games.map((game: GameQueryData) => (
          <Tooltip title={game.title} key={game.id}>
            <Box sx={borderStyle(game.id === props.active)}>
              <MediumThumbnail
                src={game.image.url}
                onClick={() => props.onSelect(game)}
              />
            </Box>
          </Tooltip>
        ))}
        {breakpoints_sm && <ArrowNavigator direction="right" size="small" />}
      </Stack>
    </RelativeContainer>
  );
};

const LargeSlider = () => {
  const game = useSelector((state: RootState) => state.game);
  const { pushLoadingRoute } = useContext(CharsiContext);
  const breakpoints_sm = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("sm")
  );

  const pushGameRoute = (route: string) => {
    pushLoadingRoute(route);
  };

  return (
    <RelativeContainer>
      <Stack
        direction="row"
        alignItems="center"
        spacing={{ xs: 1, sm: 2, md: 3, lg: 5 }}
      >
        {breakpoints_sm && (
          <Fab>
            <ArrowBackIcon />
          </Fab>
        )}
        {game.games.map((game: GameQueryData) => (
          <GameContainer
            key={game.id}
            onClick={() =>
              pushGameRoute(`/category/${uriIdGenerator(game.title)}`)
            }
          >
            <LargeThumbnail src={game.image.url}></LargeThumbnail>
            <Tooltip title={game.title}>
              <Caption textAlign="center" variant="body2" noWrap>
                {game.title}
              </Caption>
            </Tooltip>
          </GameContainer>
        ))}
        {breakpoints_sm && (
          <Fab>
            <ArrowForwardIcon />
          </Fab>
        )}
      </Stack>
    </RelativeContainer>
  );
};

const SlideGameSelector: FunctionComponent<Props> = (props: Props) => {
  const { getGamesData } = useContext(CharsiContext);

  useEffect(() => {
    getGamesData();
  }, [getGamesData]);

  if (props.size === "large") {
    return <LargeSlider />;
  } else if (props.size === "medium") {
    return (
      <MediumSlider
        onSelect={props.onSelect as any}
        active={props.active as string}
      />
    );
  }

  return (
    <SmallSlider
      onSelect={props.onSelect as any}
      active={props.active as string}
    />
  );
};

export default SlideGameSelector;
