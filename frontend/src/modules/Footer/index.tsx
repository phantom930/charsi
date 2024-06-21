import Link from "next/link";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import { Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import styled from "@emotion/styled";

import ViewLiveTradeFeeds from "@base/Button/ViewLiveTradeFeeds";
import { Instagram, Twitter, Youtube } from "@base/Icon";
import Logo from "@base/Logo";
import { website_name } from "@/config";

export const Root = styled.div`
  background: #000000de;
  padding: 40px;
  padding-top: 60px;
  padding-bottom: 60px;
  color: white;
`;

const HoverableLink = styled(Link)`
  transition: 0.4s;
  color: white;
  text-decoration: none;
  :hover {
    color: #ffffff77;
  }
`;

const Footer = () => {
  const breakpoints_lg = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("lg")
  );

  return (
    <Root>
      <Container>
        <Grid container mt={3}>
          <Grid item xs={7} md={3}>
            <Logo height={40} />
          </Grid>
        </Grid>
        <Grid container mt={3}>
          <Grid item xs={6} md={6} lg>
            <Stack spacing={2}>
              <HoverableLink href="/about">About</HoverableLink>
              <HoverableLink href="/">Terms of Use</HoverableLink>
              <HoverableLink href="/">Privacy Policy</HoverableLink>
              <HoverableLink href="/">Cookie Policy</HoverableLink>
            </Stack>
          </Grid>
          <Grid item xs={6} md={6} lg>
            <Stack spacing={2}>
              <HoverableLink href="/">Report a Scam</HoverableLink>
              <HoverableLink href="/">Report a Bug</HoverableLink>
            </Stack>
          </Grid>
          <Grid item xs={12} lg={5} mt={breakpoints_lg ? 0 : 6}>
            <Stack spacing={2}>
              <HoverableLink href="/">
                <Typography variant="h5">Join our Discord community</Typography>
              </HoverableLink>
              <Typography variant="caption">
                All trades are posted - live - to our Discord!
              </Typography>
              <ViewLiveTradeFeeds fullWidth={false} />
            </Stack>
          </Grid>
        </Grid>

        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ marginTop: "70px", marginBottom: "20px" }}
        >
          <IconButton>
            <Youtube />
          </IconButton>
          <IconButton>
            <Twitter />
          </IconButton>
          <IconButton>
            <Instagram />
          </IconButton>
        </Stack>
        <Typography textAlign="center">
          © {website_name} Trade 2023. All rights reserved.
        </Typography>
      </Container>
    </Root>
  );
};

export default Footer;
