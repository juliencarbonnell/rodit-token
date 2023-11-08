import { Form, Formik } from "formik";
import React from "react";
import { formSchema } from "../schemas/stepTwoSchema";
import { Input } from "./Input";

export const StepTwo = (props) => {
  const handleSubmit = (values) => {
    props.next(values, false);
  };

  const initialValues = {
    cidrAddresses: "172.16.0.0/12",
    vpnPorts: "49194",
    dnsServerIp: "4.4.4.4",
    postUpVpn:
      "iptables -A FORWARD -i %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE",
    postDownVpn:
      "iptables -D FORWARD -i %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={formSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values }) => (
        <Form>
          <div className="grid md:grid-cols-2 md:gap-6">
            <Input
              label="Client Ipv4 Addresses"
              name="cidrAddresses"
              type="text"
              placeholder="172.16.0.0/12"
            />
            <Input
              label="Server Vpn Ports"
              name="vpnPorts"
              type="text"
              placeholder="49194"
            />
          </div>

          <Input
            label="DNS Server Ip"
            name="dnsServerIp"
            type="text"
            placeholder=""
          />
          <Input
            label="PostUp Server command"
            name="postUpVpn"
            type="text"
            placeholder="iptables -A FORWARD -i %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE"
          />
          <Input
            label="PostDown Server command"
            name="postDownVpn"
            type="text"
            placeholder="iptables -D FORWARD -i %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE"
          />

          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              className="inline-flex items-center rounded-xl duration-300 ease-in-out my-2.5 bg-indigo-700 px-4 py-3 text-white shadow-lg transition hover:bg-indigo-600 focus:outline-none"
              disabled={isSubmitting}
              type="button"
              onClick={() => props.prev(values)}
            >
              Back
            </button>
            <button
              className="inline-flex items-center rounded-xl duration-300 ease-in-out my-2.5 bg-indigo-700 px-4 py-3 text-white shadow-lg transition hover:bg-indigo-600 focus:outline-none"
              disabled={isSubmitting}
              type="submit"
            >
              Next
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
