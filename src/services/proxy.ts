const BACKEND_URL = "http://0.0.0.0:8080";

export async function proxyRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const url = `${BACKEND_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Request failed");
    }

    return response.json();
  } catch (error) {
    console.error(`Proxy request failed for ${endpoint}:`, error);
    throw error;
  }
}

export async function proxyUpload(endpoint: string, formData: FormData) {
  const url = `${BACKEND_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Upload failed");
    }

    return response.json();
  } catch (error) {
    console.error(`Proxy upload failed for ${endpoint}:`, error);
    throw error;
  }
}
