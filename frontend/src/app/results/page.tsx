import Results from "@/components/results/results";
import ProtectedPage from "@/components/protected";

const Page = () => {
  return (
    <ProtectedPage>
      <Results />
    </ProtectedPage>
  );
};

export default Page;
