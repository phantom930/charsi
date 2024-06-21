import React from "react";
import { Box } from "@mui/material";
import styled from "@emotion/styled";

interface GameCoverProps {
  cover: {
    url: string;
    alt: string;
  };
  logo: {
    url: string;
    alt: string;
  };
}

interface GameCoverContainerProps {
  cover: {
    url: string;
  };
}

const GameCoverContainer = styled(Box)<GameCoverContainerProps>`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  height: 110px;
  background-image: url(${({ cover }) => cover.url});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const GameLogo = styled.img`
  transform: translateY(45px);
`;

const GameCover = ({ cover, logo }: GameCoverProps) => {
  return (
    <GameCoverContainer cover={cover}>
      <GameLogo src={logo.url} alt={logo.alt} />
    </GameCoverContainer>
  );
};

GameCover.displayName = "GameCover";
export default GameCover;
