import Box from "@mui/material/Box";
import styled from "@emotion/styled";

import { mq } from "@helpers/breakpoints";

interface Props {
  src: string;
}

export const LargeThumbnail = styled(Box)`
  border-radius: 50%;
  background-image: url(${(props: Props) => props.src});
  background-position: center;
  background-size: 100% 100%;
  transition: 0.4s ease-in-out;
  :hover {
    cursor: pointer;
    background-size: 120% 120%;
  }

  ${mq["xxs"]} {
    width: 50px;
    height: 50px;
  }
  ${mq["xs"]} {
    width: 80px;
    height: 80px;
  }
  ${mq["sm"]} {
    width: 100px;
    height: 100px;
  }
  ${mq["md"]} {
    width: 130px;
    height: 130px;
  }
  ${mq["lg"]} {
    width: 150px;
    height: 150px;
  }
  ${mq["xl"]} {
    width: 200px;
    height: 200px;
  }
`;

export const MediumThumbnail = styled(Box)`
  border-radius: 50%;
  width: 67px;
  height: 67px;
  border: 3px solid #fff;
  background-image: url(${(props: Props) => props.src});
  background-position: center;
  background-size: 100% 100%;
  transition: 0.08s;
  :hover {
    cursor: pointer;
  }
`;

export const SmallThumbnail = styled(Box)`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background-image: url(${(props: Props) => props.src});
  background-position: center;
  background-size: 100% 100%;
  :hover {
    cursor: pointer;
  }
`;
