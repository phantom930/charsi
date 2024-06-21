import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import SlideGameSelector from "@modules/SlideGameSelector/SlideGameSelector";
import styled from "@emotion/styled";

const Overlaied = styled(Grid)`
  transform: translate(0, -50%);
`;

const GameSelector = () => (
  <Container>
    <Overlaied container justifyContent="center">
      <SlideGameSelector size="large" showCaption />
    </Overlaied>
  </Container>
);

export default GameSelector;
