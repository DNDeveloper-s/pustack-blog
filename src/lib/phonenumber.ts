import {
  CountryCallingCode,
  CountryCode,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

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

export function validatePhoneNumber(phoneNumber: string, country: CountryCode) {
  const parsedNumber = parsePhoneNumberFromString(phoneNumber, country);
  if (parsedNumber) {
    return parsedNumber.isValid();
  }
  return false;
}

export function getCountryCodeFromDialingCode(dialingCode: CountryCallingCode) {
  const countries = getCountries();
  for (const country of countries) {
    if (getCountryCallingCode(country) === dialingCode) {
      return country;
    }
  }
  return null;
}
