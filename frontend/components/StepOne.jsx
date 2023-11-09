import { Form, Formik } from "formik"
import { formSchema } from "../schemas/stepOneSchema"
import { Input } from "./Input"

const todayDate = () => {
  let date = new Date()
  let currentDate = date.getDate()
  let currentMonth = date.getMonth() + 1
  let currentYear = date.getFullYear()
  return (
    currentYear +
    "-" +
    (currentMonth < 10 ? "0" + currentMonth : currentMonth) +
    "-" +
    (currentDate < 10 ? "0" + currentDate : currentDate)
  )
}
const nextYearDate = () => {
  let date = new Date()
  let currentDate = date.getDate()
  let currentMonth = date.getMonth() + 1
  let currentYear = date.getFullYear() + 1
  return (
    currentYear +
    "-" +
    (currentMonth < 10 ? "0" + currentMonth : currentMonth) +
    "-" +
    (currentDate < 10 ? "0" + currentDate : currentDate)
  )
}

export const StepOne = (props) => {
  const handleSubmit = (values) => {
    props.next(values, false)
  }

  const initialValues = {
    booking_fee: "",
    nameofCustomer: "",
    locationofResource: "",
    expirationDate: nextYearDate(),
    startingDate: todayDate(),
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={formSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="grid my-2 md:grid-cols-2 md:gap-6">
            <Input
              label="Booking Fee"
              name="booking_fee"
              type="text"
              placeholder=""
            />
            <Input
              label="Partage BnB Provider Name"
              name="nameofCustomer"
              type="text"
              placeholder=""
            />
          </div>
          <div className="my-2">
            <Input
              label="Room"
              name="locationofResource"
              type="text"
              placeholder=""
            />
          </div>
          <div className="grid my-2 md:grid-cols-2 md:gap-6">
            <Input
              label="Exit Date"
              name="expirationDate"
              type="date"
              placeholder=""
            />
            <Input
              label="Starting Date"
              name="startingDate"
              type="date"
              placeholder=""
            />
          </div>
          <div className="flex items-center justify-center mt-4">
            <button
              className="rounded-xl duration-300 ease-in-out my-2.5 bg-indigo-700 w-full py-3 text-white shadow-lg transition hover:bg-indigo-600 focus:outline-none"
              disabled={isSubmitting}
              type="submit"
            >
              Next
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
