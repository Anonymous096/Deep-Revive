const API_BASE_URL = "http://localhost:5001";

// Helper function to check if the API is available
async function checkApiAvailability() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: "GET",
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
async function retryRequest(
  fn: () => Promise<any>,
  maxRetries = 3,
  delay = 1000
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

export async function uploadImage(file: File) {
  try {
    const isAvailable = await checkApiAvailability();
    if (!isAvailable) {
      throw new Error(
        "API server is not available. Please ensure the server is running."
      );
    }

    return await retryRequest(async () => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to upload image");
      }

      return response.json();
    });
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

export async function enhanceImage(filename: string, options = {}) {
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

      return response.json();
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
