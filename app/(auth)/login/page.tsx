import FormLogin from "@/app/components/form-login";


const LoginPage = ({
  searchParams,
}: {
  searchParams: { verified: string; error: string };
}) => {
  const isVerified = searchParams.verified === "true";

  return (
    <FormLogin
      isVerified={isVerified}
    />
  );
};
export default LoginPage;