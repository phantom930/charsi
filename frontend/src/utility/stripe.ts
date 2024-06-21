import { loadStripe } from "@stripe/stripe-js";

import { stripePubKey } from "@/config";

export const stripePromise = loadStripe(stripePubKey as string);

export const paymentLogo = (paymentType: string) =>
  `https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/${
    paymentType ? "mc" : paymentType
  }.svg`;
