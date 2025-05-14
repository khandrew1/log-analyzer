import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token");

    const headers = new Headers({
      Accept: "application/json",
    });

    if (token) {
      headers.set("Cookie", `${token.name}=${token.value}`);
    }

    const res = await fetch(`${process.env.FASTAPI_BACKEND_URL}/analyze`, {
      method: "GET",
      headers: headers,
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          message:
            data.detail ||
            data.message ||
            `Analysis at backend failed. Status: ${res.status}`,
        },
        { status: res.status },
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error: unknown) {
    console.error("Error in /api/analyze proxying to FastAPI:", error);
    let message = "Internal server error during analysis proxy.";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}
