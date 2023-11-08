import React from "react";
import safe from "../assets/safe.png";

export const RODTset = ({ tx }) => {
  return (
    <div className="max-w-sm mt-12 bg-slate-100 border-gray-100 border  rounded-lg shadow-md ">
      <div className="h-48 ">
        <img className="rounded-t-lg" src={safe} alt="safe" />
      </div>
      <div className="p-5 mt-12 ">
        <div>
          <h5 className="mb-2 text-2xl font-bold tracking-wide ">
            Cableguard RODT set minted!
          </h5>
        </div>
        <a href={tx}>
          <div className="flex items-center justify-center">
            <button className="inline-flex items-center rounded-xl duration-300 ease-in-out my-2.5 bg-indigo-700 px-4 py-3 text-white shadow-lg transition hover:bg-indigo-600 focus:outline-none">
              Download JSON the generated rodts
            </button>
          </div>
        </a>
      </div>
    </div>
  );
};
