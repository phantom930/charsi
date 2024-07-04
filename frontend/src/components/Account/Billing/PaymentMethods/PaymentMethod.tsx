import Image from "next/image";
import Stack, { StackProps } from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import _ from "lodash";

import { paymentLogo } from "@utility/stripe";

export interface PaymentMethodProps {
  method: any;
  isActive?: boolean;
  onClick?: (id: string) => void;
}

export interface PanelProps extends StackProps {
  isActive?: boolean;
}

const Panel = ({ isActive = false, children, ...rest }: PanelProps) => (
  <Stack
    sx={{
      minWidth: "240px",
      backgroundColor: "#EEE",
      borderRadius: "8px",
      padding: "10px 30px",
      position: "relative",
      cursor: "pointer",
      "&::before": {
        content: '""',
        position: "absolute",
        top: -2,
        left: -2,
        width: "calc(100% + 4px)",
        height: "calc(100% + 4px)",
        zIndex: -1,
        background: isActive
          ? "linear-gradient(252.31deg, #7C4DFF 37.91%, #7C4DFF 37.91%, #FB4DFF 86.97%)"
          : "#FFF",
        borderRadius: "10px",
      },
    }}
    {...rest}
  >
    {children}
  </Stack>
);

const PaymentMethod = ({
  method,
  isActive = false,
  onClick,
}: PaymentMethodProps) => {
  const type = method.type === "card" ? method.card.brand : method.type;

  return (
    <Panel spacing={1} isActive={isActive} onClick={() => onClick(method.id)}>
      <Image src={paymentLogo(type)} alt={type} width={75} height={60} />
      <Typography variant="h6">
        {_.get(method, "billing_details.name", "")}
      </Typography>
      <Typography variant="body1" color="grey">
        {method.type === "card"
          ? `**** **** **** ${method.card.last4}`
          : "Savings account"}
      </Typography>
    </Panel>
  );
};

export default PaymentMethod;
