import { useContext } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import _ from "lodash";

import { CharsiContext } from "@providers/CharsiProvider";
import type { UserQueryData } from "@store/user/user.slice";

interface UserPanelProps {
  user: UserQueryData;
}

const StyledBox = styled(Box)({
  borderRadius: "8px",
  backgroundColor: "#E0E0E0",
});

const UserPanel = ({ user }: UserPanelProps) => {
  const { pushLoadingRoute } = useContext(CharsiContext);

  return (
    <StyledBox
      display="flex"
      alignItems="center"
      px={1}
      py="6px"
      onClick={() => pushLoadingRoute(`/account/profile/${user.username}`)}
      sx={{ cursor: "pointer", width: "fit-content" }}
    >
      <Avatar
        src={_.get(user, "avatar.url", "")}
        alt="avatar"
        sx={{ width: 24, height: 24, mr: 1 }}
      />
      <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
        {user.username}
      </Typography>
    </StyledBox>
  );
};

export default UserPanel;
