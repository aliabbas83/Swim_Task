import type { Metadata } from "next";
import { PeriodScreen } from "@/features/registration/screens/PeriodScreen";

export const metadata: Metadata = { title: "Choose your period" };

export default function PeriodPage() {
  return <PeriodScreen />;
}
