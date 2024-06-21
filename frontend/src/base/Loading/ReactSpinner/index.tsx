import LinearProgress from "@mui/material/LinearProgress";
import { Oval } from "react-loader-spinner";
import styled from "@emotion/styled";

const FullWidthContainer = styled.div`
  position: fixed;
  top: 50vh;
  right: 50vw;
  transform: translate(50%, 50%);
`;

export const Loading = () => (
  <>
    <LinearProgress />
    <FullWidthContainer>
      <Oval
        height={80}
        width={80}
        color="#4fa94d"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#4fa94d"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </FullWidthContainer>
  </>
);
