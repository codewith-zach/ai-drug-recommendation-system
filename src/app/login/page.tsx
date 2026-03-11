import { AuthShell } from "@/components/auth-shell";

export default function LoginPage() {
  return (
    <AuthShell
      mode="login"
      title="Login to your wellness dashboard"
      subtitle="Use this screen in the presentation to show returning-user flow. It routes directly into the demo dashboard."
    />
  );
}
