import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});
export const axiosAuth = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export function pluralize(word: string, count: number) {

  return count === 1 ? word : count + word + "s";
}
