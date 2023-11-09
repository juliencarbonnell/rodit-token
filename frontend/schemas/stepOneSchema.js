import * as yup from "yup"

export const formSchema = yup.object().shape({
  booking_fee: yup
    .number("Please enter a number")
    .typeError("Please enter a number")
    .positive()
    .min(2, "Minimun  is 2")
    .max(16000, "Maximum is 16000")
    .integer()
    .required("Required"),
  nameofCustomer: yup
    .string("Please enter a Partage BnB provider name")
    .required("Required"),
  locationofResource: yup
    .string("Please enter a Partage BnB location")
    .required("Required"),
  expirationDate: yup.date().required("Required"),
  startingDate: yup.date().required("Required"),
})
