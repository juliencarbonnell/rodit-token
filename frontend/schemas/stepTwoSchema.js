import * as yup from "yup"

export const formSchema = yup.object().shape({
  cidrAddresses: yup
    .string("Please enter a valid IPv4 address")
    .matches(
      /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/,
      "Please enter a valid IPv4 address range"
    )
    .required(),
  vpnPorts: yup
    .number()
    .typeError("Please enter a number")
    .positive()
    .integer()
    .required("Required"),
  postUpVpn: yup
    .string("Please enter a valid Post Up VPN command.")
    .required("Required"),
  postDownVpn: yup
    .string("Please enter a valid Post Down VPN command.")
    .required("Required"),
})
