import type { RegistrationPayload, RegistrationReceipt } from "../types";

export const GENERIC_SUBMIT_ERROR =
  "We couldn't complete your registration. Please check your internet connection and try again.";

export class RegistrationRequestError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "RegistrationRequestError";
  }
}

/** Client for `POST /api/registrations`. Throws `RegistrationRequestError` with a user-presentable message. */
export async function submitRegistration(
  payload: RegistrationPayload,
  options: { signal?: AbortSignal } = {},
): Promise<RegistrationReceipt> {
  const response = await fetch("/api/registrations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: options.signal,
  });

  if (!response.ok) {
    let message = GENERIC_SUBMIT_ERROR;
    try {
      const body: unknown = await response.json();
      if (typeof body === "object" && body !== null && "error" in body && typeof body.error === "string") {
        message = body.error;
      }
    } catch {
      /* body wasn't JSON: keep the generic message */
    }
    throw new RegistrationRequestError(message, response.status);
  }

  return (await response.json()) as RegistrationReceipt;
}
