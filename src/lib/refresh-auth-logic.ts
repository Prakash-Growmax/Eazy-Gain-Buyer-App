import axios from "axios";
import { isBefore, subMinutes } from "date-fns";
import { decode } from "jsonwebtoken";
interface Jwt {
  // Define the Jwt interface based on your token structure
  exp: number;
  // Add other properties if needed
}
const refreshAuthLogic = async (accessToken: any, refreshToken: any) => {
  if (accessToken) {
    if (checkAccessTokenWillExpireInDay(accessToken)) {
      const data = await axios({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}auth/auth/refreshToken`,
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
        method: "POST",
        data: JSON.stringify({
          refreshToken,
          accessToken,
        }),
      });

      return { ...data.data.tokens, renewed: true };
    }
    return { accessToken, refreshToken };
  }
};

export function checkAccessTokenWillExpireInDay(accessToken: string): boolean {
  let decoded = getDecodedAccessToken(accessToken);
  const d = new Date(0);
  d.setUTCSeconds(decoded.exp);

  return isBefore(subMinutes(d, 2), new Date());
}

function getDecodedAccessToken(accessToken: string): Jwt {
  const decoded = decode(accessToken) as Jwt; // Cast the decoded result to Jwt type
  return decoded;
}

export default refreshAuthLogic;
