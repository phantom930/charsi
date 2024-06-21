import Rater from "react-rater";
import styled from "styled-components";

const StyledRater = styled(Rater)`
  font-size: 24px;
  & > div {
    display: inline-block;
  }
`;

const StarsRater = (props) => {
  return <StyledRater total={5} rating={1} {...props} />;
};

export default StarsRater;
