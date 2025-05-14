export type Log = {
  timestamp: string;
  action: string;
  url: string;
  category: string;
  user: string;
  log_id: string;
  owner_username: string;
};

export type UploadResponse = {
  filename: string;
  rows_parsed: number;
  data: Log[];
};

export type AnomalyLog = {
  anomaly_id: string;
  description: string;
  explanation: string;
  confidence: number;
  log_id: string;
};

export type AnalysisResponse = AnomalyLog[];

export type FormValues = {
  file: FileList | null;
};

export type CombinedResult = {
  uploadData: UploadResponse;
  analysisData: AnalysisResponse;
};
