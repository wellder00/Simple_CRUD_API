import { UrlParts } from "src/types/interface";


export const getUrlParts = (url: string): UrlParts => {
  const urlParts: string[] = url.split("/").filter(Boolean);
  const api: string = urlParts[0];
  const users: string = urlParts[1];
  const id: string = urlParts[2];
  const rest: string[] = urlParts.slice(3);

  return { api, users, id, rest };
};