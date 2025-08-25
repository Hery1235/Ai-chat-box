"use client";

import React, { useState } from "react";

export default function completionPage() {
  const [prompt, setPrompt] = useState("");
  const [completion, setCompletion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emptyPrompt, setEmptyPrompt] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (prompt.trim() == "") {
      return setEmptyPrompt(true);
    }

    setIsLoading(true);
    setEmptyPrompt(false);
    try {
      const response = await fetch("/api/completion/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong ");
      }

      setCompletion(data.text);
      setPrompt("");
    } catch (error) {
      console.log(error);
      setError(error instanceof Error ? error.message : "Please try again ");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : completion ? (
        <div className="whitespace-pre-wrap">{completion}</div>
      ) : null}
      <form
        onSubmit={submitHandler}
        className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg"
      >
        {emptyPrompt && (
          <p className="mb-1 text-xs text-red-500">Please Provide an Prompt</p>
        )}
        <div className="flex gap-2">
          <input
            onChange={(e) => setPrompt(e.target.value)}
            type="text"
            className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
            placeholder="How can I help you?"
            value={prompt}
          />
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
