import { authAdmin } from "@/lib/firebaseAdmin";
import { app } from "@/lib/firebaseConfig";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized: Missing token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  const accessToken = authHeader.split("Bearer ")[1];

  try {
    const decoded = await authAdmin.verifyIdToken(accessToken);
    return new Response(JSON.stringify({ uid: decoded.uid, decoded }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    return new Response(JSON.stringify({ error: "Login failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
