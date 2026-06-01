import { authAdmin } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Unauthorized: Missing token" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const accessToken = authHeader.split("Bearer ")[1];

  try {
    await authAdmin.verifyIdToken(accessToken);

    const exp = 60 * 5 * 1000;

    const sessionCookie = await authAdmin.createSessionCookie(accessToken, {
      expiresIn: exp,
    });

    const response = NextResponse.json({ status: 200 });

    response.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: exp,
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
