import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  const headers = new Headers();

  if (token) {
    headers.set("Cookie", `${token.name}=${token.value}`);
  }

  const body = request.body;
  const requestType = request.headers.get("Content-Type");

  if (requestType) {
    headers.set("Content-Type", requestType);
  }

  try {
    const res = await fetch(`${process.env.FASTAPI_BACKEND_URL}/upload`, {
      method: "POST",
      headers: headers,
      body: body,
      // @ts-expect-error - duplex is known by Next.js but is not defined by the types
      duplex: "half",
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
