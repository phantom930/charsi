import { useState, MouseEvent } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Container from "@mui/material/Container";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { styled } from "@mui/material/styles";

import { TabPanel } from "@base/Tab";
import DebitCardEditor from "./DebitCardEditor";

import BootstrapDialogTitle from "@components/Listing/BootstrapDialogTitle";

interface AddPaymentMethodsProps {
  open: boolean;
  onSuccess: () => void;
  onClose: (event: MouseEvent) => void;
}

const StyledTab = styled(Tab)({
  textTransform: "none",
});

const AddPaymentMethods = ({
  open,
  onSuccess,
  onClose,
}: AddPaymentMethodsProps) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newTabIndex: number
  ) => {
    setTabIndex(newTabIndex);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <BootstrapDialogTitle onClose={onClose}>
        Add Payment Method
      </BootstrapDialogTitle>
      <DialogContent>
        <Container maxWidth="xl" sx={{ pt: 5 }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            aria-label="Charsi Account Management"
            variant="scrollable"
            scrollButtons="auto"
          >
            <StyledTab label="Debit Card" />
            <StyledTab label="Bank" />
            <StyledTab label="Paypal" />
            <StyledTab label="ApplePay" />
          </Tabs>
          <TabPanel value={tabIndex} index={0} panelStyles={{ px: 0 }}>
            <DebitCardEditor onSuccess={onSuccess} />
          </TabPanel>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentMethods;
