import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const username = process.env.SS_USERNAME;
const apiKey = process.env.SS_API_KEY;

  console.log("ORDER RECEIVED", body);

  console.log("SENDING TO SS", body);
  console.log("USERNAME", username);
console.log("API KEY", apiKey);

const response = await fetch(
  "https://api.ssactivewear.com/V2/Products/GetProduct",
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

return NextResponse.json({
  success: true,
  status: response.status,
});
}