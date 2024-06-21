import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

export default styled(Typography)(({ theme }) => ({
  position: "relative",
  "&:before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: 0,
    width: "100%",
    borderBottom: `4px solid ${(theme as any).palette.primary.main}`,
    transform: "rotate(-30deg)",
  },
}));
