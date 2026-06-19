import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const body = await req.json();

  const username = process.env.SS_USERNAME;
  const apiKey = process.env.SS_API_KEY;

  console.log("ORDER RECEIVED", body);
  console.log("ORDER PAYLOAD", body);

  const response = await fetch(
  "https://api.ssactivewear.com/V2/PaymentProfiles.aspx",
  {
    method: "GET",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          `${username}:${apiKey}`
        ).toString("base64"),

    },

  }
  );

  const text = await response.text();

  console.log("SS RESPONSE", response.status, text);

  return NextResponse.json({
  success: true,
  status: response.status,
  payload: body,
  ssResponse: text,
});
}