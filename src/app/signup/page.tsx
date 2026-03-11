import { AuthShell } from "@/components/auth-shell";

export default function SignUpPage() {
  return (
    <AuthShell
      mode="signup"
      title="Create your demo account"
      subtitle="Show a realistic onboarding experience, then move directly into the product without implementing a full identity stack."
    />
  );
}
