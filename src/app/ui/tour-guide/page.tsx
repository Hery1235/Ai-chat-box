"use client";

import { useState } from "react";
import { tripSchema } from "@/app/api/tour-guide/schema";
import { experimental_useObject as useObject } from "@ai-sdk/react";

export default function TourGuidePage() {
  const [city, setCity] = useState("");
  const [duration, setDuration] = useState<number>(0);

  const { submit, object, error, isLoading } = useObject({
    api: "/api/tour-guide",
    schema: tripSchema,
  });

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(duration);
    submit({ city, duration });
    setCity("");
    setDuration(0);
  };
  return (
    <div className="flex items-center justify-center mt-8">
      {error && <div className="text-red-500">Error while loding data </div>}
      <div>
        {object?.city && <h1 className="text-xl">City: {object.city}</h1>}
        {object?.city && <h1>Number of days: {object.duration}</h1>}
        <div className="flex gap-2 flex-col">
          {object?.explore?.map((place, index) => (
            <div
              className="p-4 bg-gray-200 border border-gray-300 rounded-lg"
              key={index}
            >
              <p>
                <span className="font-semibold">Day {index + 1}:</span> {place}
              </p>
            </div>
          ))}
        </div>
        <div className="text-xl p-4">Important Packing: </div>
        <div className="flex gap-2 flex-col">
          {object?.packingList?.map((item, index) => (
            <div
              className="p-4 bg-gray-200 border border-gray-300 rounded-lg"
              key={index}
            >
              <p>
                <span className="font-semibold">Item {index + 1}:</span> {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 flex justify-center items-center w-full">
        <form
          onSubmit={submitHandler}
          className="p-4 flex gap-4 border-4 rounded-lg border-red-300"
        >
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border px-4 py-2 border-red-500 outline-none"
            placeholder="City Name"
            type="text"
          />
          <input
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className=" max-w-32 border px-4 py-2 border-red-500 outline-none"
            placeholder="Duration"
            type="number"
          />
          <button
            disabled={isLoading}
            type="submit"
            className="bg-red-500 text-white p-2 rounded-lg"
          >
            Generate
          </button>
        </form>
      </div>
    </div>
  );
}
