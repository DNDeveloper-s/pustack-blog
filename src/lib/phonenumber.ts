import { parsePhoneNumberFromString } from "libphonenumber-js";

export const extractCountryCodeAndNumber = (phoneString: string) => {
  const phoneNumber = parsePhoneNumberFromString(phoneString);

  if (!phoneNumber) {
    throw new Error("Invalid phone number");
  }

  const countryCode = phoneNumber.countryCallingCode;
  const nationalNumber = phoneNumber.nationalNumber;

  return {
    countryCode,
    nationalNumber,
  };
};
