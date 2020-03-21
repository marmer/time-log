import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
 response.set('Access-Control-Allow-Origin', 'https://marmer.github.io');

 // TODO: marmer 21.03.2020 serve refresh token by a given short time google token

 response.send(JSON.stringify(request.query));
});
