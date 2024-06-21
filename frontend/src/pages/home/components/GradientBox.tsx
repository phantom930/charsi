import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

import { website_name } from "@/config";

// import ScrollingText from "./ScrollingText";

const moveXTop = keyframes`
  50% {
    transform: translate3d(-18em, 0, 0);
  }
`;

const moveYTop = keyframes`
  30% {
    transform: translate3d(0, -10em, 0) scale(.95);
  }
  70% {
    transform: translate3d(0, 20em, 0) scale(1.05);
  }
`;

const moveXMiddle = keyframes`
  50% {
    transform: translate3d(-16em, 0, 0);
  }
`;

const moveYMiddle = keyframes`
  25% {
    transform: translate3d(0, -8em, 0) scale(.95);
  }
  70% {
    transform: translate3d(0, 12em, 0) scale(1.2);
  }
`;

const moveXBottom = keyframes`
  30% {
    transform: translate3d(-24em, 0, 0);
  }
  60% {
    transform: translate3d(24em, 0, 0);
  }
`;

const moveYBottom = keyframes`
  25% {
    transform: translate3d(0, -18em, 0) scale(1.05);
  }
  60% {
    transform: translate3d(0, 4em, 0) scale(.95);
  }
`;

const GradientCircle = styled.div`
  position: absolute;
  pointer-events: none;
  opacity: 0.65;
  width: 1em;
  height: 1em;
  border-radius: 50%;
`;

const GradientTop = styled(GradientCircle)`
  top: 0;
  left: 105em;
  animation: ${moveXTop} 15s ease infinite, ${moveYTop} 15s ease infinite;
  background: #ffcd92;
  box-shadow: 0 0 16em 16em #ffcd92;
`;

const GradientMiddle = styled(GradientCircle)`
  top: 50%;
  left: 85em;
  animation: ${moveXMiddle} 12s ease infinite, ${moveYMiddle} 20s ease infinite;
  background: #ff8c8c;
  box-shadow: 0 0 28em 28em #ff8c8c;
`;

const GradientBottom = styled(GradientCircle)`
  bottom: -12em;
  left: 50%;
  animation: ${moveXBottom} 19s ease infinite, ${moveYBottom} 14s ease infinite;
  background: #6cc4ff;
  box-shadow: 0 0 24em 24em #6cc4ff;
`;

const GradientBoxInner = () => {
  return (
    <>
      <GradientTop />
      <GradientMiddle />
      <GradientBottom />
      {/* <ScrollingText text="Buy Sell Trade" /> */}
    </>
  );
};

const GradientBox = styled.div`
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #ec5dff 0%, #5605ff 100%);
  height: 445px;
  background-position: center;
  color: white;
  display: flex;
  align-items: center;
  padding-bottom: 4em;
`;

const Underline = styled.span`
  text-decoration: underline;
`;

const CustomGradientBox = () => (
  <GradientBox>
    <GradientBoxInner />
    <Container sx={{ position: "relative" }}>
      <Typography variant="h4" gutterBottom>
        Trade across every game you love.
      </Typography>
      <Typography variant="h5">
        Safely, securely, and transparently trade or sell your ingame items.{" "}
        <br />
        Earn <Underline>{website_name} Balance</Underline> today by listing your
        items, it is easy!
      </Typography>
    </Container>
  </GradientBox>
);

export default CustomGradientBox;
