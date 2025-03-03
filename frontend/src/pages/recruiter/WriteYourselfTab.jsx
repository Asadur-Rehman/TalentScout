"use client";
import Stars from "../../assets/stars.svg";

export default function WriteYourselfTab({ description, setDescription }) {
  const handleGenerate = () => {
    console.log("Generating description...");
  };

  return (
    <div>
      <div className="space-y-4">
        <h2 className="text-lg text-gray-700">
          Write the job description or let our AI write it for you!
        </h2>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6">
              <img src={Stars}  className="h-10" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Generate with AI
              </span>
            </div>
            <button
              onClick={handleGenerate}
              className="px-4 py-2 text-sm font-medium text-white bg-[#0B2544] hover:bg-[#0B2544]/90 rounded-md transition-colors"
            >
              Generate
            </button>
          </div>

          <div className="p-4">
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                console.log(e.target.value);
              }}
              placeholder="Write Job description"
              className="w-full min-h-[200px] resize-none border-0 focus:outline-none focus:ring-0 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
