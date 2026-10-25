import type { Metadata } from "next";
import { SuccessScreen } from "@/features/registration/screens/SuccessScreen";

export const metadata: Metadata = { title: "You're registered" };

export default function SuccessPage() {
  return <SuccessScreen />;
}
