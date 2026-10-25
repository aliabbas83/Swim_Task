import type { Metadata } from "next";
import { ReviewScreen } from "@/features/registration/screens/ReviewScreen";

export const metadata: Metadata = { title: "Review and confirm" };

export default function ReviewPage() {
  return <ReviewScreen />;
}
