import { NextResponse } from "next/server";
import { CLUB } from "@/features/registration/config";
import { calculatePrice } from "@/features/registration/lib/pricing";
import { validateRegistrationPayload } from "@/features/registration/lib/validation";
import type { RegistrationReceipt } from "@/features/registration/types";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "The request body must be valid JSON." }, { status: 400 });
  }

  const result = validateRegistrationPayload(body);
  if (!result.ok) {
    return NextResponse.json(
      { error: "Some registration details are missing or invalid.", details: result.errors },
      { status: 422 },
    );
  }

  // The server recomputes the price: never trust a total sent by the client.
  const price = calculatePrice(result.value.children.length);

  // TODO: persist the registration (database / email) before returning the receipt.
  const receipt: RegistrationReceipt = {
    reference: `DOL-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    total: price.total,
    currency: CLUB.currency,
  };

  return NextResponse.json(receipt, { status: 201 });
}
