"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { uploadImage, enhanceImage, getPreviewUrl } from "@/services/api";
import Image from "next/image";

export default function Revive() {
  const pathname = usePathname();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setIsLoading(true);
    setError(null);
    setEnhancedImage(null);

    try {
      // Upload the first file
      const file = files[0];
      const result = await uploadImage(file);
      console.log("Upload result:", result);
      setUploadedFile(result.filename);

      // Automatically start enhancement
      const enhanced = await enhanceImage(result.filename);
      console.log("Enhancement result:", enhanced);
      setEnhancedImage(enhanced.filename);
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Failed to process image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!enhancedImage) return;

    // Create download link
    const link = document.createElement("a");
    link.href = `http://localhost:10000/api/download/${enhancedImage}`;
    link.download = enhancedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="flex items-center text-base">
        <BreadcrumbItem>
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-muted-foreground/80 transition-colors"
          >
            Dashboard
          </Link>
        </BreadcrumbItem>
        <div className="flex items-center gap-2 text-muted-foreground/30">
          <span className="h-1 w-1 rounded-full bg-current" />
          <ChevronRight className="h-4 w-4" />
        </div>
        <BreadcrumbItem>
          <span className="text-foreground font-normal">Revive</span>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-4">Upload Image</h2>
          <p className="text-muted-foreground mb-4">
            Upload your old or damaged photos to restore them to their former
            glory.
          </p>
          <FileUpload onChange={handleFileUpload} />
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-4">Original Image</h2>
          <p className="text-muted-foreground mb-4">
            Your uploaded photo will appear here.
          </p>
          {uploadedFile && !isLoading && (
            <div className="aspect-video relative rounded-lg overflow-hidden bg-muted h-48">
              <img
                src={getPreviewUrl(uploadedFile)}
                alt="Original"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          )}
          {isLoading && (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-4">Enhanced Preview</h2>
          <p className="text-muted-foreground mb-4">
            See your enhanced photo and download it.
          </p>
          {enhancedImage && !isLoading && (
            <>
              <div className="aspect-video relative rounded-lg overflow-hidden bg-muted h-48">
                <img
                  src={getPreviewUrl(enhancedImage)}
                  alt="Enhanced"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
              <Button
                className="w-full mt-4"
                onClick={handleDownload}
                disabled={isLoading}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Enhanced Image
              </Button>
            </>
          )}
          {isLoading && (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
