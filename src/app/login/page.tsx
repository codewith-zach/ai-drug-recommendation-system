import { AuthShell } from "@/components/auth-shell";

export default function LoginPage() {
  return (
    <AuthShell
      mode="login"
      title="Login to the OTC suggestion dashboard"
      subtitle="Use this screen in the presentation to show returning-user flow before entering the personalized OTC assessment."
    />
  );
}
