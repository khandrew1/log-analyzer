import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "../ui/label";

type AnomalyProps = {
  confidence: number;
  description: string;
  explanation: string;
};

const Anomaly = ({ confidence, description, explanation }: AnomalyProps) => {
  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle className="text-red-500 text-center mt-4">
          Anomaly Found!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-2">
          <div>
            <Label>Confidence</Label>
            <p>{confidence}</p>
          </div>
          <div>
            <Label>Description</Label>
            <p>{description}</p>
          </div>
          <div>
            <Label>Explanation</Label>
            <p>{explanation}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default Anomaly;
