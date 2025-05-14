import { Button } from "./ui/button";
import Link from "next/link";

const Landing = () => {
  return (
    <div className="flex gap-x-4 h-full justify-center items-center">
      <Link href="/register">
        <Button variant="outline" className="cursor-pointer">
          Register
        </Button>
      </Link>
      <Link href="/login">
        <Button className="cursor-pointer">Login</Button>
      </Link>
    </div>
  );
};

export default Landing;
