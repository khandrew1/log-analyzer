"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import type {
  UploadResponse,
  FormValues,
  AnalysisResponse,
  CombinedResult,
} from "./types";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<FormValues>({
    defaultValues: {
      file: null,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    console.log(values);
    setIsLoading(true);

    const fileToUpload = values.file?.[0];

    if (!fileToUpload) {
      console.error("No file selected");
      form.setError("file", { type: "manual", message: "File is required" });
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      const uploadLogsRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadLogsRes.ok) {
        const errorData = await uploadLogsRes
          .json()
          .catch(() => ({ message: "Upload failed with no error message." }));
        throw new Error(
          errorData.message || `HTTP error! status: ${uploadLogsRes.status}`,
        );
      }

      const uploadResult: UploadResponse = await uploadLogsRes.json();
      console.log("Upload successful:", uploadResult);

      const analysisRes = await fetch("/api/analyze", {
        method: "GET",
        credentials: "include",
      });

      if (!analysisRes.ok) {
        let errorMsg = `Analysis failed: ${analysisRes.statusText}`;
        try {
          const errorData = await analysisRes.json();
          errorMsg = errorData.detail || errorData.message || errorMsg;
        } catch {
          /* Ignore if response isn't JSON */
        }
        throw new Error(errorMsg);
      }

      const analysisResult: AnalysisResponse = await analysisRes.json();
      console.log("Analysis successful:", analysisResult);

      // 3. Prepare data for redirection
      const combinedData: CombinedResult = {
        uploadData: uploadResult,
        analysisData: analysisResult,
      };

      sessionStorage.setItem("analysisResults", JSON.stringify(combinedData));

      // 4. Redirect to the results page
      router.push("/results"); // Replace with your actual results page route
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex justify-center items-center">
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle className="text-center w-full">
            Upload your proxy log file here (CSV Files only)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex justify-center items-center h-full">
                <FormField
                  control={form.control}
                  name="file"
                  rules={{ required: "A CSV file is required." }}
                  render={({
                    field: { onChange, onBlur, name, ref },
                    fieldState,
                  }) => (
                    <FormItem>
                      <FormLabel>File</FormLabel>
                      <FormControl>
                        <Input
                          id="file-upload"
                          type="file"
                          accept=".csv"
                          onChange={(e) => {
                            onChange(e.target.files);
                          }}
                          onBlur={onBlur}
                          name={name}
                          ref={ref}
                          className={fieldState.error ? "border-red-500" : ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end gap-4 pt-5">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="cursor-pointer"
                >
                  {isLoading ? "Analyzing..." : "Analyze"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
