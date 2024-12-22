const objectToStringAddress = (address) => {
  if (address === "undefined" || address === "null") return;
  const stringAddress = `${address?.street}, ${address?.city}, ${address?.state} ${address?.zipCode}`;
  console.log("stringAddress:", stringAddress);
  return stringAddress;
};

module.exports = {
  objectToStringAddress,
};
