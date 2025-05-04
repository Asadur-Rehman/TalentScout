import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function EvaluationDisplay() {
  const { id } = useParams();
  const [entries, setEntries] = useState([]);
  const [totalScore, setTotalScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`/api/candidate/getEvaluation/${id}`);
        const { evaluationScore, evaluationReport } = response.data;

        const lines = evaluationReport
          .trim()
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        const parsedEntries = [];

        for (let i = 0; i < lines.length - 1; i += 4) {
          // Stop if we reach "Total score" prematurely
          if (lines[i].toLowerCase().includes("total score")) break;

          parsedEntries.push({
            question: lines[i],
            answer: lines[i + 1],
            evaluation: lines[i + 2],
            score: lines[i + 3],
          });
        }

        setEntries(parsedEntries);
        setTotalScore(evaluationScore);
      } catch (err) {
        setError("Failed to fetch the report.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Candidate Evaluation Report
      </h2>

      {entries.map((entry, idx) => (
        <div key={idx} className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold text-blue-700">
            Q{idx + 1}: {entry.question}
          </h3>
          <p className="mt-1 text-gray-800">
            <span className="font-medium text-gray-600">Answer:</span>{" "}
            {entry.answer}
          </p>
          <p className="mt-1 text-gray-800">
            <span className="font-medium text-gray-600">Evaluation:</span>{" "}
            {entry.evaluation}
          </p>
          <p className="mt-1 text-sm text-green-600 font-semibold">
            Score: {entry.score}
          </p>
        </div>
      ))}

      <div className="text-right text-xl font-bold text-purple-700">
        Total Score: {totalScore}
      </div>
    </div>
  );
}
