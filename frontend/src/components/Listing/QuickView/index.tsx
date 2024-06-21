import { MouseEvent } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Container from "@mui/material/Container";

import BootstrapDialogTitle from "@components/Listing/BootstrapDialogTitle";
import type {
  ListingQueryData,
  RewardQueryData,
} from "@store/listing/listing.slice";
import ViewerContent from "./ViewerContent";

interface QuickViewProps {
  open: boolean;
  onClose: (event: MouseEvent) => void;
  listings: ListingQueryData[];
  rewards: RewardQueryData[];
}

const QuickView = ({
  open,
  onClose,
  listings = [],
  rewards = [],
}: QuickViewProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <BootstrapDialogTitle onClose={onClose}>Quick View</BootstrapDialogTitle>
      <DialogContent>
        <Container maxWidth="xl" sx={{ py: 5 }}>
          <ViewerContent listings={listings} rewards={rewards} />
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default QuickView;
