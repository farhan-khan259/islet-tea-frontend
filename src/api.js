const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

export const apiUrl = (path) =>
  `${configuredApiUrl ? configuredApiUrl.replace(/\/$/, "") : ""}${path}`;
