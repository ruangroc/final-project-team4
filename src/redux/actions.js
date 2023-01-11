export const LOG_IN = "LOG_IN";

export function logIn(accessToken) {
  return { type: LOG_IN, accessToken };
}
