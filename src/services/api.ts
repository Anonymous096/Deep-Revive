// API base URL - use environment variable if available, otherwise fallback to localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Helper function to check if API is available
export const checkApiAvailability = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });
    return response.ok;
  } catch (error) {
    console.error("API health check failed:", error);
    return false;
  }
};

// Helper function to handle API errors
const handleApiError = (error: any): never => {
  console.error("API Error:", error);
  throw new Error(
    error.message || "An error occurred while processing your request"
  );
};

// Upload image function
export const uploadImage = async (
  file: File
): Promise<{ filename: string; message: string }> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to upload image");
    }

    return response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

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
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
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
