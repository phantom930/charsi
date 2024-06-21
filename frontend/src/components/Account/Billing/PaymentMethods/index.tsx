import { useState, useImperativeHandle, forwardRef } from "react";
import { useSelector } from "react-redux";
import Stack from "@mui/material/Stack";

import PaymentMethod from "./PaymentMethod";
import type { RootState } from "@/store";

export interface PaymentMethodsRef {
  activePayment: string | null;
}

const PaymentMethods = forwardRef<PaymentMethodsRef>((_props, ref) => {
  const { stripePaymentMethods } = useSelector(
    (state: RootState) => state.auth
  );
  const [activePayment, setActivePayment] = useState<string | null>(null);

  const handleOnClickPaymentMethod = (id: string) => {
    console.log("id: ", id);
    setActivePayment(id);
  };

  useImperativeHandle(ref, () => ({
    activePayment: activePayment,
  }));

  if (!stripePaymentMethods.length) return null;

  return (
    <Stack
      direction="row"
      spacing={2}
      mb={3}
      alignItems="center"
      sx={{ zIndex: 999 }}
    >
      {stripePaymentMethods.map((paymentMethod) => (
        <PaymentMethod
          key={paymentMethod.id}
          method={paymentMethod}
          isActive={paymentMethod.id === activePayment}
          onClick={handleOnClickPaymentMethod}
        />
      ))}
    </Stack>
  );
});

PaymentMethods.displayName = "PaymentMethods";

export default PaymentMethods;
