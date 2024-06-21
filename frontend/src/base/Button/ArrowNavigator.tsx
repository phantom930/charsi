import { FunctionComponent } from "react";
import Fab, { FabProps } from "@mui/material/Fab";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import styled from "@emotion/styled";

interface ArrowIconProps extends FabProps {
  size: "small" | "medium" | "large";
  direction?: "left" | "right";
}

const StyledFab = styled(Fab)({
  minHeight: "30px",
  backgroundColor: "#fff",
  boxShadow:
    "0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 1px 5px rgba(0, 0, 0, 0.12)",
});

const ArrowNavigator: FunctionComponent<ArrowIconProps> = ({
  size = "small",
  direction = "left",
  ...rest
}: ArrowIconProps) => {
  const ArrowIcon = direction === "left" ? ArrowBackIcon : ArrowForwardIcon;

  switch (size) {
    case "small":
      return (
        <StyledFab sx={{ width: "30px", height: "30px" }} {...rest}>
          <ArrowIcon sx={{ fontSize: 15 }} />
        </StyledFab>
      );
    case "medium":
      return (
        <StyledFab size="medium" {...rest}>
          <ArrowIcon fontSize="medium" />
        </StyledFab>
      );
    case "large":
    default:
      return (
        <StyledFab size="large" {...rest}>
          <ArrowIcon fontSize="large" />
        </StyledFab>
      );
  }
};

ArrowNavigator.displayName = "ArrowNavigator";

export default ArrowNavigator;
