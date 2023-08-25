const base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
export const isValidBase64 = (stringToTest) => {
  return base64Regex.test(stringToTest);
};
