import * as yup from "yup"

export const formSchema = yup.object().shape({
  booking_fee: yup
    .number("Please enter a number")
    .typeError("Please enter a number")
    .positive()
    .min(2, "Minimun of minted RODiT is 2")
    .max(16, "Maximum of minted RODiT is 16")
    .integer()
    .required("Required"),
  nameofCustomer: yup
    .string("Please enter a VPN provider name")
    .required("Required"),
  locationofResource: yup
    .string("Please enter a VPN description")
    .required("Required"),
  expirationDate: yup.date().required("Required"),
  startingDate: yup.date().required("Required"),
})
