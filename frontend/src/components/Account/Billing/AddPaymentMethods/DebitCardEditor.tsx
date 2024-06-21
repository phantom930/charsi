import { useState, useContext } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { useMutation } from "@apollo/client";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { enqueueSnackbar } from "notistack";

import RoundButton from "@base/Button/RoundBtn";
import { CharsiContext } from "@providers/CharsiProvider";
import { ATTACH_STRIPE_PAYMENT_METHOD_MUTATION } from "@store/auth/auth.graphql";
import styles from "./DebitCardEditor.module.css";

export interface DebitCardEditorProps {
  onSuccess: () => void;
}

const DebitCardEditor = ({ onSuccess }: DebitCardEditorProps) => {
  const [name, setName] = useState<string>("");
  const [isProcessingAddDebitCard, setIsProcessingAddDebitCard] =
    useState<boolean>(false);
  const [attachStripePaymentMethod] = useMutation(
    ATTACH_STRIPE_PAYMENT_METHOD_MUTATION
  );
  const { labels } = useContext(CharsiContext);
  const stripe = useStripe();
  const elements = useElements();

  const handleAddDebitCardMethod = async () => {
    try {
      if (!stripe || !elements) {
        return;
      }

      setIsProcessingAddDebitCard(true);

      const cardNumberElement = elements.getElement(CardNumberElement);

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement,
        billing_details: {
          name: name,
        },
      });

      if (error) {
        throw new Error(error.message);
      } else {
        if (paymentMethod.card && paymentMethod.card.brand) {
          if (paymentMethod.card.funding === "debit") {
            const { data } = await attachStripePaymentMethod({
              variables: {
                input: paymentMethod.id,
              },
            });

            if (data) {
              setIsProcessingAddDebitCard(false);
              enqueueSnackbar(labels.SUCCESS_ADD_PAYMENT_METHOD, {
                variant: "success",
              });
              onSuccess();
            } else {
              setIsProcessingAddDebitCard(false);
              enqueueSnackbar(labels.FAIL_ADD_PAYMENT_METHOD, {
                variant: "error",
              });
            }
          } else {
            setIsProcessingAddDebitCard(false);
            throw new Error(labels.WARNING_ONLY_DEBIT_CARD_ACCEPTED);
          }
        } else {
          setIsProcessingAddDebitCard(false);
          throw new Error(labels.WARNING_ONLY_DEBIT_CARD_ACCEPTED);
        }
      }
    } catch (error) {
      setIsProcessingAddDebitCard(false);
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <CardNumberElement
          options={{
            classes: {
              base: styles["card-element-base"],
              focus: styles["card-element-focus"],
            },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Cardholder name"
          placeholder="J Smith"
          onChange={(e) => setName(e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <CardExpiryElement
          options={{
            classes: {
              base: styles["card-element-base"],
              focus: styles["card-element-focus"],
            },
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <CardCvcElement
          options={{
            classes: {
              base: styles["card-element-base"],
              focus: styles["card-element-focus"],
            },
          }}
        />
      </Grid>
      <Grid item xs={12} display="flex" justifyContent="center">
        <RoundButton
          variant="contained"
          color="primary"
          disabled={isProcessingAddDebitCard}
          onClick={handleAddDebitCardMethod}
          sx={{ mt: 3 }}
        >
          {isProcessingAddDebitCard && (
            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
          )}
          Add Debit Card
        </RoundButton>
      </Grid>
    </Grid>
  );
};

export default DebitCardEditor;
