import type { Metadata } from "next";
import { ChildrenScreen } from "@/features/registration/screens/ChildrenScreen";

export const metadata: Metadata = { title: "Your children" };

export default function ChildrenPage() {
  return <ChildrenScreen />;
}
