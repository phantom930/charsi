import { MouseEvent } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import RoundButton from "@base/Button/RoundBtn";
import BootstrapDialogTitle from "@components/Listing/BootstrapDialogTitle";
import type { RootState } from "@/store";

interface SuccessSubscribeDialogProps {
  open: boolean;
  onClose: (event: MouseEvent) => void;
}

const SuccessSubscribeDialog = ({
  open,
  onClose,
}: SuccessSubscribeDialogProps) => {
  const auth = useSelector((state: RootState) => state.auth);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <BootstrapDialogTitle onClose={onClose}>
        Subscribe to Charsi Premium
      </BootstrapDialogTitle>
      <DialogContent>
        <Container maxWidth="xl" sx={{ pt: 5 }}>
          <Stack direction="column" alignItems="center" spacing={3}>
            <Image
              src="/icons/icon_gradient_border_heart.svg"
              width={165}
              height={130}
              alt="success"
            />
            <Typography variant="h5" color="black">
              You’re now a Charsi Premium member.
            </Typography>
            <Box>
              <Typography
                variant="body1"
                color="grey"
                textAlign="center"
                sx={{ width: 415 }}
              >
                Enjoy unlimited listings, 75% Charsi Balance cashout rate, and
                stylistic options for your{" "}
                <Link
                  href={`/account/profile/${auth.username}`}
                  style={{
                    width: "fit-content",
                    borderBottom: "1px solid",
                    color: "#7C4DFF",
                    borderColor: "#7C4DFF",
                  }}
                >
                  profile page.
                </Link>
              </Typography>
            </Box>
            <RoundButton
              variant="outlined"
              color="primary"
              onClick={() => onClose(null)}
            >
              Close Window
            </RoundButton>
          </Stack>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessSubscribeDialog;
