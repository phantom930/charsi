require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const app = express();

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET;

app.post(
  "/stripe-webhooks",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    console.log("type: ", event.type);
    // Handle the event
    switch (event.type) {
      case "balance.available":
        const balanceAvailable = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded

        console.log("available: ", balanceAvailable);
        break;
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;

        console.log("paymentIntent: ", paymentIntentSucceeded);

        break;
      // ... handle other event types+
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.status(204).send();
  }
);

app.listen(4242, () => console.log("Running on port 4242"));
