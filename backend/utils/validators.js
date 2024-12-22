const emailValidator = require("email-validator");
const SmartySDK = require("smartystreets-javascript-sdk");
const axios = require("axios");
const { phone } = require("phone");

const SmartyCore = SmartySDK.core;
const Lookup = SmartySDK.usStreet.Lookup;

const isEmailValid = (email) => {
  return emailValidator.validate(email);
};

const isAddressValid = async (address) => {
  const { countryCode, state, zipCode, street, city } = address;

  if (!countryCode || !state || !zipCode || !street || !city) {
    return false;
  }

  const authId = process.env.SMARTY_AUTH_ID;
  const authToken = process.env.SMARTY_AUTH_TOKEN;

  let clientBuilder = new SmartyCore.ClientBuilder(
    new SmartyCore.StaticCredentials(authId, authToken)
  ).withLicenses(["us-core-cloud"]);

  let client = clientBuilder.buildUsStreetApiClient();

  let lookup = new Lookup();
  lookup.state = state;
  lookup.street = street;
  lookup.city = city;
  lookup.zipCode = zipCode;

  // NOTE: batches are not supported when using SharedCredentials.
  let batch = new SmartyCore.Batch();

  batch.add(lookup);
  try {
    const result = await client.send(batch);
    // console.log("smarty result:", result);
    const response = result.lookups.map((lookup) => {
      if (lookup.result.length === 0) return false;
      return lookup.result[0].metadata;
    });
    // console.log("response:", response);

    return response[0];
  } catch (err) {
    console.log("smarty", err);
  }
};

const isPhoneValid = (contactNumber) => {
  return phone(contactNumber).isValid;
};

module.exports = {
  isEmailValid,
  isAddressValid,
  isPhoneValid,
};
