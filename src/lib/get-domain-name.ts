export const getDomainName = (host: string) => {
  return process.env.NODE_ENV !== "development" ? host : "discoveriq.in";
};
