import * as functions from "firebase-functions";
import * as admin from "firebase-admin";


admin.initializeApp();


// Import the SendGrid SDK
import * as sgMail from "@sendgrid/mail";

// Get the apikey nad the tempalte id from firebase config as to not show them publicly
const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);

export const newQuoteRequest = functions.firestore
    .document("Messages/{quoteId}")
    .onCreate(async (change, context) => {
      const data = change.data();

      // The confirmation to send to the customer after submiting the form
      const msg = {
        from: "youssef@lasheen.dev",
        to: data.email,
        templateId: TEMPLATE_ID,
        dynamic_template_data: {
          "name": data.name,
        },
      };
      // The message to send to me with the details of the form
      const msg1 = {
        from: "youssef@lasheen.dev",
        to: "youssef@lasheen.dev",
        subject: "New Quote Request from "+data.name,
        text: "name: "+data.name+"\nSubject: "+data.subject+
        "\nEmail: "+data.email+
        "\nMessage Text: "+data.messageText+
        "\nTime: "+data.time,
      };

      await sgMail.send(msg);
      await sgMail.send(msg1);

      return {success: true};
    });


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
