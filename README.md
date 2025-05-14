# Log Analyzer

A simple log analyzer that uses AI to analyze logs and provide insights.

## Environment Variables

For this project to work, a Google Gemini API key and openssl secret key are required.
These can be set in the `docker-compose.yml` file.

To generate an openssl secret key, run the following command:

```bash
  openssl rand -hex 32
```

To generate a Google Gemini API key, follow the instructions in the [Google Gemini documentation](https://developers.google.com/gemini/docs/getting-started).

## Running Docker

After the environment variables are set, run the following command to start the Docker container:

```bash
docker-compose up --build
```

## Usage of AI

In order to detect anomalies of the log files, Google Gemini was given the following prompt:

You are a cybersecurity AI assistant. Analyze the following Zscaler web proxy log entries and identify any anomalies.
For each anomaly, provide a JSON object with keys: description (short summary), explanation (why it's anomalous), confidence (0–1), log*id, anomaly_id (same as log id, prefixed with 'anomaly*').
If no anomalies are found, return an empty JSON array. \nEntries:\n

We then append a JSONL version of the logs to the prompt. Then thanks to Gemini's structured output mode, we are able to get back easily parsable JSON objects to send to the frontend.
