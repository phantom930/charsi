import Box from "@mui/material/Box";
import Stack, { StackProps } from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import { formatDistance } from "date-fns";

import Panel from "@base/Panel";

export interface MessageBoxProps extends StackProps {
  avatar: string;
  username: string;
  message: string;
  created_at: Date;
  isMine?: boolean;
}

const StyledMessagePanel = styled(Panel)({
  width: "fit-content",
});

const MessageBox = ({
  avatar,
  username,
  message,
  created_at,
  isMine = false,
  ...rest
}: MessageBoxProps) => {
  return (
    <Stack spacing={1} width="fit-content" {...rest}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Avatar src={avatar} alt={username} sx={{ width: 24, height: 24 }} />
        <Typography variant="body1">{username}</Typography>
      </Stack>
      <StyledMessagePanel
        px={4}
        py={3}
        sx={{
          background: isMine
            ? "linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #DBE9FF !important"
            : "#E0E0E0",
        }}
      >
        <Typography variant="subtitle1" fontSize="1.1rem" whiteSpace="pre-wrap">
          {message}
        </Typography>
      </StyledMessagePanel>
      <Box display="flex" justifyContent="flex-end">
        <Typography variant="caption" color="text.secondary">
          {formatDistance(new Date(created_at), new Date())} ago
        </Typography>
      </Box>
    </Stack>
  );
};

export default MessageBox;
