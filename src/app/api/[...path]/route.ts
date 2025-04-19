import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://0.0.0.0:8080";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.pathname.replace("/api/", "");
  const url = `${BACKEND_URL}/api/${path}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const path = request.nextUrl.pathname.replace("/api/", "");
  const url = `${BACKEND_URL}/api/${path}`;

  try {
    const formData = await request.formData();
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload data" },
      { status: 500 }
    );
  }
}
