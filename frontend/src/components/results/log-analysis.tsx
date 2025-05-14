import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "../ui/label";

type LogAnalysisProps = {
  timestamp: string;
  action: string;
  url: string;
  category: string;
  user: string;
};

const LogAnalysis = ({
  timestamp,
  action,
  url,
  category,
  user,
}: LogAnalysisProps) => {
  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle className="text-center mt-4">Standard Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-2">
          <div>
            <Label>Timestamp</Label>
            <p>{timestamp}</p>
          </div>
          <div>
            <Label>Action</Label>
            <p>{action}</p>
          </div>
          <div>
            <Label>URL</Label>
            <p>{url}</p>
          </div>
          <div>
            <Label>Category</Label>
            <p>{category}</p>
          </div>
          <div>
            <Label>User</Label>
            <p>{user}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default LogAnalysis;
