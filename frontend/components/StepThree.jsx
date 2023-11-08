import React, { useState } from "react";
import { formSchema } from "../schemas/stepThreeSchema";
import { Field, Form, Formik } from "formik";
import { Input } from "./Input";

export const StepThree = (props) => {
  const handleSubmit = (values, actions) => {
    props.next(values, true);
    // actions.resetForm()
  };

  const initialValues = {
    allowedIPv4: "0.0.0.0/0",
    initialendpoint_url: "",
    maximumKb: "",
    privateKey: "",
    account: "",
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
              label="Range of accessible Ipv4 Addresses"
              name="allowedIPv4"
              type="text"
              placeholder="0.0.0.0/0"
            />
            <Input
              label="Server Endpoint Default URL"
              name="initialendpoint_url"
              type="text"
              placeholder=""
            />
          </div>
          <Input
            label="Maximum KB per second"
            name="maximumKb"
            type="text"
            placeholder="100000 "
          />

          <Input
            label="Private Key in Base58"
            name="privateKey"
            type="text"
            placeholder=""
          />
          <Input
            label="Account of the service provider"
            name="account"
            type="text"
            placeholder=""
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
              Mint
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
