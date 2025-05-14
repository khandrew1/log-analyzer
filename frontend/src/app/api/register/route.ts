export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  try {
    const res = await fetch(`${process.env.FASTAPI_BACKEND_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, hashed_password: password }),
    });

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
