import * as yup from "yup";

export const formSchema = yup.object().shape({
  allowedIPv4: yup.string("Please enter a valid IPv4.").required("Required"),
  initialendpoint_url: yup
    .string()
    .matches(
      /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]\.[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]\.[a-zA-Z]{2,}(\/.*)?$/, // Updated regex pattern
      "Please enter a valid subdomain URL (https:// is implicit)"
    )
    .required("Required"),
  maximumKb: yup
    .number("Please enter a number.")
    .typeError("Please enter a number")
    .positive()
    .integer()
    .required("Required"),
  privateKey: yup
    .string()
    .matches(
    /^[1-9A-HJ-NP-Za-km-z]+$/g,
    "Please enter a valid base58 value"
    )
    .required("Required"),
  account: yup.string().required("Required"),
});
