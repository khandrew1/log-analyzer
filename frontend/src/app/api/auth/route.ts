import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  const headers = new Headers({
    Accept: "application/json",
  });

  if (token) {
    headers.set("Cookie", `${token.name}=${token.value}`);
  }

  try {
    const res = await fetch(`${process.env.FASTAPI_BACKEND_URL}/users/me`, {
      method: "GET",
      headers: headers,
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          message:
            data.detail || `Failed to fetch user data. Status: ${res.status}`,
        },
        { status: res.status },
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
