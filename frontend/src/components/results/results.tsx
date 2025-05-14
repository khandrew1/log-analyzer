"use client";

import Anomaly from "@/components/results/anomaly";
import LogAnalysis from "@/components/results/log-analysis";
import { AnomalyLog, Log } from "@/components/dashboard/types";
import { useEffect, useState } from "react";

import type { CombinedResult } from "@/components/dashboard/types";

const Results = () => {
  const [results, setResults] = useState<CombinedResult | null>(null);
  const [anomalies, setAnomalies] = useState<AnomalyLog[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedResults = sessionStorage.getItem("analysisResults");
      if (storedResults) {
        const parsedResults: CombinedResult = JSON.parse(storedResults);
        if (parsedResults) {
          setResults(parsedResults);
          setAnomalies(parsedResults.analysisData);
          setLogs(parsedResults.uploadData.data);
        }
      } else {
        setError("No results found. Please try uploading again.");
      }
    } catch (err) {
      console.error("Error parsing results:", err);
      setError("Could not load Results");
    } finally {
      console.log("Results:", results);
      setIsLoading(false);
    }
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <>
      {isLoading ? (
        "Loading..."
      ) : (
        <div className="flex flex-col gap-y-4 justify-center items-center w-full">
          {anomalies.map((anomaly: AnomalyLog, idx) => (
            <Anomaly
              key={idx}
              confidence={anomaly.confidence}
              description={anomaly.description}
              explanation={anomaly.explanation}
            />
          ))}
          <div className="w-full flex flex-col items-center justify-center gap-y-4">
            {logs.map((log: Log, idx) => (
              <LogAnalysis
                key={idx}
                timestamp={log.timestamp}
                action={log.action}
                url={log.url}
                category={log.category}
                user={log.user}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Results;
