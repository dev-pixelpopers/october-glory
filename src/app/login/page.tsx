import { Suspense } from "react";
import LoginScreen from "./login-screen";

export const metadata = {
  title: "Sign In | October Glory",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#151515] flex items-center justify-center">
          <p className="gotham text-white/60 text-[18px]">Loading…</p>
        </div>
      }
    >
      <LoginScreen />
    </Suspense>
  );
}
