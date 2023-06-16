import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs";
export async function POST() {
  const { userId } = auth();
  if (!userId) return NextResponse.redirect("/sign-in");

  const params = { firstName: "John", lastName: "Wick" };
  const user = await clerkClient.users.updateUser(userId, params);
  return NextResponse.json({ user });
}
