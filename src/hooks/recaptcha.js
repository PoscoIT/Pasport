// import {
//   Recaptcha,
//   RecaptchaAction,
// } from '@google-cloud/recaptcha-enterprise-react-native';
// import { REACT_APP_RECAPTCHA_SITE_KEY } from "@env";
// const SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

// let client = null;

// const initialize = async () => {
//   if (client) {
//     return client;
//   }

//   client = await Recaptcha.fetchClient(SITE_KEY);

//   return client;
// };

// export const executeRecaptcha = async (actionName) => {
//   const recaptchaClient = await initialize();

//   const action = RecaptchaAction.custom(actionName);

//   const token = await recaptchaClient.execute(action);

//   return token;
// };