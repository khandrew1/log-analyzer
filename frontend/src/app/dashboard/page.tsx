import ProtectedPage from "@/components/protected";
import Dashboard from "@/components/dashboard/dashboard";

const Page = () => {
  return (
    <ProtectedPage>
      <Dashboard />
    </ProtectedPage>
  );
};

export default Page;
