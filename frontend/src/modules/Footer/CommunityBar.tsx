import Image from "next/image";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { Root } from "./index";

const CommunityBar = () => {
  return (
    <Root>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <Typography variant="h4">
            Never miss a beat. View live trade feeds for all of your favorite
            games.
          </Typography>
          <Button
            startIcon={
              <Image
                src="/icons/icon_discord_white.svg"
                width={30}
                height={23}
                alt="discord"
              />
            }
            variant="contained"
            sx={{ borderRadius: 50, width: 340, height: 50 }}
          >
            Join the Charsi Community
          </Button>
        </Stack>
      </Container>
    </Root>
  );
};

CommunityBar.displayName = "CommunityBar";
export default CommunityBar;
