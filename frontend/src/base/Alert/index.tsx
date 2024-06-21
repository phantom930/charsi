import { MouseEvent } from "react";
import Image from "next/image";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import RoundButton from "@base/Button/RoundBtn";
import BootstrapDialogTitle from "@components/Listing/BootstrapDialogTitle";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: (event: MouseEvent) => void;
  onConfirm: (event: MouseEvent) => void;
  title: string;
  description: string;
  confirmButtonText: string;
  cancelButtonText: string;
}

export const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmButtonText,
  cancelButtonText,
}: ConfirmationDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <BootstrapDialogTitle onClose={onClose}>{title}</BootstrapDialogTitle>
      <DialogContent>
        <Container maxWidth="xl" sx={{ py: 5 }}>
          <Stack alignItems="center" spacing={3}>
            <Image
              src="/icons/icon_info.svg"
              width={66}
              height={66}
              alt="Information"
            />
            <Typography variant="h5" align="center">
              {description}
            </Typography>
            <Stack direction="row" spacing={2}>
              <RoundButton
                sx={{ textTransform: "uppercase" }}
                onClick={onClose}
              >
                {cancelButtonText}
              </RoundButton>
              <RoundButton
                variant="contained"
                color="secondary"
                sx={{ textTransform: "uppercase" }}
                onClick={onConfirm}
              >
                {confirmButtonText}
              </RoundButton>
            </Stack>
          </Stack>
        </Container>
      </DialogContent>
    </Dialog>
  );
};
