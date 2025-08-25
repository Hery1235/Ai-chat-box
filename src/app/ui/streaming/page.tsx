"use client";
import { useCompletion } from "@ai-sdk/react";

export default function StreamingTextPage() {
  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
    error,
    stop,
  } = useCompletion({
    api: "/api/streaming",
  });
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto py-24 px-4">
      {/* Error Message */}
      {error && (
        <div className="w-full mb-4 p-2 text-center text-red-600 border border-red-400 rounded-lg bg-red-50">
          Error while fetching the data.
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && !completion && (
        <div className="w-full mb-4 text-center text-gray-600">Loading...</div>
      )}

      {/* Completion Result */}
      {completion && (
        <div className="w-full mb-4 p-4 text-gray-800 border border-gray-300 rounded-lg bg-gray-50">
          {completion}
        </div>
      )}

      {/* Input Form */}
      <div className="fixed bottom-0 w-full max-w-md px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setInput("");
            handleSubmit(e);
          }}
          className="flex flex-col gap-2 bg-white border border-gray-300 rounded-lg p-2 shadow-md md:flex-row"
        >
          <textarea
            rows={3}
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type here..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          />
          {isLoading ? (
            <button
              onClick={() => {
                stop();
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg disabled:opacity-50 cursor-pointer"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50 cursor-pointer"
            >
              Generate
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
