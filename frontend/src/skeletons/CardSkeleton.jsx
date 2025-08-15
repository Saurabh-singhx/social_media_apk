import React from "react";

const CardSkeleton = () => {
  return (
    <div className="w-full max-w-screen-md mx-auto bg-slate-100 rounded-2xl shadow-md overflow-hidden mb-6 border border-gray-100 animate-pulse">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        <div className="flex flex-col gap-1 flex-1">
          <div className="w-24 h-3 bg-gray-300 rounded"></div>
          <div className="w-16 h-2 bg-gray-300 rounded"></div>
        </div>
        <div className="w-16 h-6 bg-gray-300 rounded-full"></div>
      </div>

      {/* Media */}
      <div className="w-full h-64 bg-gray-300"></div>

      {/* Content */}
      <div className="px-4 py-3 space-y-2">
        <div className="w-full h-3 bg-gray-300 rounded"></div>
        <div className="w-3/4 h-3 bg-gray-300 rounded"></div>
      </div>

      {/* Actions */}
      <div className="px-4 py-2 border-t flex items-center justify-around">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-16 h-4 bg-gray-300 rounded"></div>
        ))}
      </div>

      {/* Comment Input */}
      <div className="px-4 pb-3 mt-2 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gray-300"></div>
        <div className="flex-1 h-9 bg-gray-300 rounded-full"></div>
      </div>

      {/* Comments */}
      <div className="px-4 pb-4 space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex items-start gap-2 bg-gray-200 rounded-xl px-3 py-2"
          >
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
            <div className="flex-1 space-y-1">
              <div className="w-20 h-3 bg-gray-300 rounded"></div>
              <div className="w-32 h-3 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardSkeleton;
