import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);

  try {
    const res = await fetch(`${process.env.FASTAPI_BACKEND_URL}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await res.json();

    const resHeaders = new Headers();
    res.headers.forEach((value, key) => {
      if (key.toLowerCase() == "set-cookie") {
        resHeaders.append("Set-Cookie", value);
      }
    });

    resHeaders.append("Content-Type", "application/json");

    if (!res.ok) {
      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: resHeaders,
      });
    }

    return new NextResponse(
      JSON.stringify({
        message: "Login successful",
        data: res,
      }),
      { status: 200, headers: resHeaders },
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
