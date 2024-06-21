import styled from "@emotion/styled";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import Tooltip from "@mui/material/Tooltip";

import oauth from "@base/Discord";

const DiscordIcon = () => (
  <svg
    width="24"
    height="18"
    viewBox="0 0 42 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.42201 3.39866C9.14074 2.12663 12.0477 1.20218 15.0869 0.675781C15.4602 1.3506 15.8962 2.25825 16.1969 2.98027C19.4276 2.49441 22.6287 2.49441 25.8 2.98027C26.1006 2.25825 26.5465 1.3506 26.9231 0.675781C29.9656 1.20218 32.8759 2.13003 35.5947 3.4054C41.0784 11.692 42.5649 19.7728 41.8216 27.7388C38.1846 30.4549 34.6598 32.1049 31.1945 33.1845C30.3389 32.007 29.5758 30.7552 28.9184 29.436C30.1704 28.9603 31.3696 28.3732 32.5026 27.6916C32.202 27.4689 31.908 27.2361 31.6239 26.9965C24.7132 30.2289 17.2044 30.2289 10.3762 26.9965C10.0888 27.2361 9.79483 27.4689 9.49752 27.6916C10.6339 28.3765 11.8363 28.9636 13.0883 29.4394C12.431 30.7552 11.6712 32.0104 10.8123 33.1879C7.34364 32.1082 3.8156 30.4583 0.178509 27.7388C-0.693615 18.5042 1.66834 10.4976 6.42201 3.39866ZM27.9769 22.8398C30.0515 22.8398 31.7528 20.9031 31.7528 18.5446C31.7528 16.1862 30.0878 14.2461 27.9769 14.2461C25.866 14.2461 24.1648 16.1828 24.2011 18.5446C24.1978 20.9031 25.866 22.8398 27.9769 22.8398ZM14.0232 22.8398C16.0977 22.8398 17.799 20.9031 17.799 18.5446C17.799 16.1862 16.1341 14.2461 14.0232 14.2461C11.9123 14.2461 10.211 16.1828 10.2474 18.5446C10.2474 20.9031 11.9123 22.8398 14.0232 22.8398Z"
      fill="white"
    />
  </svg>
);

const FloatingButton = styled(Fab)`
  position: fixed !important;
  border-radius: 50px !important;
  top: 100px;
  right: 10px;
  transform: translate(0, -50%);
`;

const StyledButton = styled(Button)`
  height: 37px;
`;
const handleDiscordLogin = async () => {
  const url = oauth.generateAuthUrl({
    scope: ["identify", "email"], // replace with the scopes you need
  });
  window.location.href = url;
};

const SignWithDiscord = () => {
  return (
    <StyledButton
      startIcon={<DiscordIcon />}
      onClick={handleDiscordLogin}
      variant="contained"
      size="small"
      sx={{ borderRadius: 50 }}
    >
      Sign in with Discord
    </StyledButton>
  );
};

export default SignWithDiscord;

export const MobileSignWithDiscord = () => {
  return (
    <AppBar>
      <Tooltip title="Sign in with discord">
        <FloatingButton onClick={handleDiscordLogin}>
          <Avatar sx={{ background: "#1976d2", height: 50, width: 50 }}>
            <DiscordIcon />
          </Avatar>
        </FloatingButton>
      </Tooltip>
    </AppBar>
  );
};
