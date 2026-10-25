import type { Metadata } from "next";
import { ParentScreen } from "@/features/registration/screens/ParentScreen";

export const metadata: Metadata = { title: "Parent details" };

export default function ParentPage() {
  return <ParentScreen />;
}
