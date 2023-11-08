import { Step } from "./Step";
import { StepOne } from "./StepOne";
import { StepThree } from "./StepThree";
import { StepTwo } from "./StepTwo";

export default function RODTForm({ data, step, prev, next }) {
  const steps = [
    <StepOne next={next} data={data} />,
    <StepTwo next={next} prev={prev} data={data} />,
    <StepThree next={next} prev={prev} data={data} />,
  ];

  return (
    <div className="flex mt-12 lg:mt-2 flex-col w-fit px-6 pt-2 pb-8 items-center justify-center rounded-xl border bg-slate-100 border-gray-100 shadow-xl">
      <div>
        <h1 className="text-2xl tracking-wide font-semibold py-3">
          Cableguard FORGE
        </h1>
      </div>
      <div className="flex flex-col items-center  justify-center">
        <Step current={step} />
        <div className="flex items-center mt-4 justify-center ">
          {steps[step]}
        </div>
      </div>
    </div>
  );
}
