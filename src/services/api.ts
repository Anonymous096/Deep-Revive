export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://0.0.0.0:8080";

// Helper function to check if the API is available
async function checkApiAvailability() {
  try {
    console.log("Checking API availability at:", `${API_BASE_URL}/api/health`);
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    });
    console.log(
      "API health check response:",
      response.status,
      response.statusText
    );
    return response.ok;
  } catch (error) {
    console.error("API availability check failed:", error);
    return false;
  }
}

// Helper function to retry failed requests
async function retryRequest<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === maxRetries - 1) throw error;
      console.log(`Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries reached");
}

interface ApiResponse {
  filename: string;
}

export async function uploadImage(file: File): Promise<ApiResponse> {
  try {
    console.log("Starting image upload...");
    const isAvailable = await checkApiAvailability();
    if (!isAvailable) {
      throw new Error(
        "API server is not available. Please ensure the server is running."
      );
    }

    return await retryRequest(async () => {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Sending upload request to:", `${API_BASE_URL}/api/upload`);
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        body: formData,
        mode: "cors",
      });

      console.log("Upload response:", response.status, response.statusText);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Upload error details:", errorData);
        throw new Error(errorData.error || "Failed to upload image");
      }

      const result = await response.json();
      console.log("Upload successful:", result);
      return result as ApiResponse;
    });
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

export async function enhanceImage(
  filename: string,
  options = {}
): Promise<ApiResponse> {
  try {
    console.log("Starting image enhancement...");
    const isAvailable = await checkApiAvailability();
    if (!isAvailable) {
      throw new Error(
        "API server is not available. Please ensure the server is running."
      );
    }

    return await retryRequest(async () => {
      console.log("Sending enhance request to:", `${API_BASE_URL}/api/enhance`);
      const response = await fetch(`${API_BASE_URL}/api/enhance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename, options }),
        mode: "cors",
      });

      console.log("Enhance response:", response.status, response.statusText);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Enhance error details:", errorData);
        throw new Error(errorData.error || "Failed to enhance image");
      }

      const result = await response.json();
      console.log("Enhancement successful:", result);
      return result as ApiResponse;
    });
  } catch (error) {
    console.error("Enhancement error:", error);
    throw error;
  }
}

export function getPreviewUrl(filename: string) {
  // Add timestamp to prevent browser caching
  const url = `${API_BASE_URL}/api/preview/${filename}?t=${Date.now()}`;
  console.log("Generated preview URL:", url);
  return url;
}
