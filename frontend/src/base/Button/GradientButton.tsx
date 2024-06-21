import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

export default styled(Button)(({ theme }) => ({
  background: theme.palette.gradient.main,
  color: theme.palette.gradient.contrastText,
  borderRadius: "8px",
}));
