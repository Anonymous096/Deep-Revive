const API_BASE_URL = "http://localhost:5001";

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  return response.json();
}

export async function enhanceImage(filename: string, options = {}) {
  const response = await fetch(`${API_BASE_URL}/api/enhance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename, options }),
  });

  if (!response.ok) {
    throw new Error("Failed to enhance image");
  }

  return response.json();
}

export function getPreviewUrl(filename: string) {
  return `${API_BASE_URL}/api/preview/${filename}`;
}
