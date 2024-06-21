import styled from "@emotion/styled";
import PageSpinner from "../PageSpinner";

const DimmedBG = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #2228;
  top: 0;
  left: 0;
  z-index: 4;
  position: fixed;
  padding-top: 30vh;
`;

export const DimmedLoading = () => {
  return (
    <DimmedBG>
      <PageSpinner />
    </DimmedBG>
  );
};

export default DimmedLoading;
