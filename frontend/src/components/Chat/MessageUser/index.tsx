import { useMemo, useState } from "react";
import Image from "next/image";
import Stack, { StackProps } from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

import GradientTypography from "@base/Typography/GradientTypography";
import MessagePanel from "./MessagePanel";

interface MessageUserProps extends StackProps {
  isSupportTeam?: boolean;
  isActive?: boolean;
  status?: "ACTIVE" | "IDLE" | "BUSY" | "INVISIBLE";
  avatar?: string;
  name?: string;
  unreadMessages?: number;
}

const StyledBadge = styled(Badge)({
  "& .MuiBadge-badge": {
    padding: "0 4px",
    width: 12,
    height: 12,
    minWidth: 12,
  },
});

const MessageUser = ({
  isSupportTeam = false,
  isActive = false,
  avatar,
  name,
  unreadMessages = 0,
  status = "ACTIVE",
  ...rest
}: MessageUserProps) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const statusColor: string = useMemo(() => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "IDLE":
        return "warning";
      case "BUSY":
        return "error";
      case "INVISIBLE":
      default:
        return "disabled";
    }
  }, [status]);

  const Logo = isSupportTeam ? (
    <Image src="/icons/logo_gradient.svg" width={50} height={50} alt="logo" />
  ) : (
    <Avatar src={avatar} alt="avatar" sx={{ width: 50, height: 50 }} />
  );

  return (
    <MessagePanel
      isSupportTeam={isSupportTeam}
      isActive={isActive}
      flexDirection="row"
      alignItems="center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {isHovering && !isSupportTeam && (
        <CloseIcon
          sx={{
            position: "absolute",
            color: "rgba(0, 0, 0, 0.56)",
            top: 10,
            right: 15,
          }}
        />
      )}
      {unreadMessages > 0 ? (
        <Badge
          color="error"
          badgeContent={unreadMessages}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          sx={{
            "& .MuiBadge-badge": {
              left: 5,
              top: 5,
            },
          }}
        >
          {Logo}
        </Badge>
      ) : (
        <>{Logo}</>
      )}
      <Stack ml={1}>
        {isSupportTeam ? (
          <>
            <GradientTypography variant="h5">Charsi</GradientTypography>
            <Typography variant="body2" color="textSecondary">
              Official Support
            </Typography>
          </>
        ) : (
          <Typography variant="h5" color="black">
            {name}
          </Typography>
        )}
      </Stack>
      {!isSupportTeam && (
        <Stack ml={2}>
          <StyledBadge badgeContent="" color={statusColor as any} />
        </Stack>
      )}
    </MessagePanel>
  );
};

export default MessageUser;
