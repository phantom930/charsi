import Stack, { StackProps } from "@mui/material/Stack";

interface MessagePanelProps extends StackProps {
  isSupportTeam?: boolean;
  isActive?: boolean;
}

const Panel = ({
  isSupportTeam = false,
  isActive = false,
  children,
  ...rest
}: MessagePanelProps) => (
  <Stack
    sx={{
      background: isSupportTeam
        ? "linear-gradient(260.17deg, rgba(124, 77, 255, 0.15) -1.78%, rgba(124, 77, 255, 0.15) -1.78%, rgba(251, 77, 255, 0.15) 81.35%)"
        : isActive
        ? "#E0E0E0"
        : "#FFF",
      "&:hover": {
        backgroundColor: isSupportTeam ? "" : "#EEEEEE",
      },
      cursor: "pointer",
      position: "relative",
      paddingTop: "14px",
      paddingBottom: "14px",
      paddingRight: "32px",
      paddingLeft: isSupportTeam ? "32px" : "36px",
    }}
    {...rest}
  >
    {children}
  </Stack>
);

export default Panel;
