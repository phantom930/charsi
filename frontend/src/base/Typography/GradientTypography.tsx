import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

export default styled(Typography)(({ theme }) => ({
  backgroundImage: theme.palette.gradient.main,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}));
