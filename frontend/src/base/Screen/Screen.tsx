import React, { ReactNode } from "react";
import styled from "@emotion/styled";

type Props = {
  children: ReactNode;
};

const Container = styled.div`
  margin: 10vh auto;
  width: 100%;
  height: 600px;
  text-align: center;
`;

const Screen = ({ children }: Props) => {
  return <Container>{children}</Container>;
};

export default Screen;
