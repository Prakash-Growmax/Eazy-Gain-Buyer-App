import { getDomainName } from "@/lib/get-domain-name";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const { UserName } = await request.json();
    const { host } = new URL(request.url);
    const DomainName = getDomainName(host);
    const data = await axios({
      url: process.env.NEXT_BASE_URL + "auth/auth/CheckUserName",
      method: "POST",
      headers: {
        origin: DomainName,
      },
      data: {
        UserName: UserName,
        reqOtp: true,
      },
    });
    return Response.json({ ...data.data });
  } catch (error: any) {
    console.log(error);
    return Response.json(
      { message: error?.response?.data?.message },
      { status: 500 }
    );
  }
}
