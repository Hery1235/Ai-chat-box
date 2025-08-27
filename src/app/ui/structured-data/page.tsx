"use client";

import React, { useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { recipeSchema } from "@/app/api/structured-data/schema";

export default function completionPage() {
  const [dish, setDishName] = useState("");

  const { submit, object, isLoading, error } = useObject({
    api: "/api/structured-data",
    schema: recipeSchema,
  });

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    submit({ dish, age: "10" });
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {error && <p className="text-red-500">Error while fetching data </p>}
      {object?.recipe && (
        <div>
          <h2>{object.recipe.name}</h2>
          {object?.recipe?.ingrediant && (
            <div>
              <h3>Indegriants</h3>
              <div>
                {object?.recipe?.ingrediant.map((indigrient, index) => (
                  <div key={index}>
                    <p>{indigrient?.name}</p>
                    <p>{indigrient?.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {object?.recipe?.steps && (
            <div>
              <h3>
                <ol>
                  {object.recipe.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </h3>
            </div>
          )}
        </div>
      )}
      <form
        onSubmit={submitHandler}
        className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg"
      >
        <div className="flex gap-2">
          <input
            onChange={(e) => setDishName(e.target.value)}
            type="text"
            className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
            placeholder="How can I help you?"
            value={dish}
          />
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Generating" : "Generate"}
          </button>
        </div>
      </form>
    </div>
  );
}
