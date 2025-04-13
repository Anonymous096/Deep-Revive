const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Helper function to check if the API is available
async function checkApiAvailability() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
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
      if (i === maxRetries - 1) throw error;
      console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
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
    const isAvailable = await checkApiAvailability();
    if (!isAvailable) {
      throw new Error(
        "API server is not available. Please ensure the server is running."
      );
    }

    return await retryRequest(
      async () => {
        const formData = new FormData();
        formData.append("file", file);

        console.log("Uploading to:", `${API_BASE_URL}/api/upload`);

        const response = await fetch(`${API_BASE_URL}/api/upload`, {
          method: "POST",
          body: formData,
          headers: {
            // Don't set Content-Type header when sending FormData
            // Let the browser set it with the correct boundary
            Accept: "application/json",
          },
          credentials: "include",
        });

        console.log("Upload response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Upload error response:", errorText);
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(errorData.error || "Failed to upload image");
          } catch (e) {
            throw new Error(`Failed to upload image: ${errorText}`);
          }
        }

        const data = await response.json();
        console.log("Upload response data:", data);
        return data;
      },
      3,
      2000
    ); // Increase retry delay to 2 seconds
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
    const isAvailable = await checkApiAvailability();
    if (!isAvailable) {
      throw new Error(
        "API server is not available. Please ensure the server is running."
      );
    }

    return await retryRequest(async () => {
      const response = await fetch(`${API_BASE_URL}/api/enhance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename, options }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to enhance image");
      }

      return response.json() as Promise<ApiResponse>;
    });
  } catch (error) {
    console.error("Enhancement error:", error);
    throw error;
  }
}

export function getPreviewUrl(filename: string) {
  // Add timestamp to prevent browser caching
  return `${API_BASE_URL}/api/preview/${filename}?t=${Date.now()}`;
}
