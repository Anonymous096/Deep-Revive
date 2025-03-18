"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X } from "lucide-react";

interface FileUploadProps {
  onChange: (files: File[]) => void;
}

export function FileUpload({ onChange }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
      onChange(acceptedFiles);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const removeFile = () => {
    setFiles([]);
    onChange([]);
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/20"
          }
          ${files.length > 0 ? "bg-muted/50" : "hover:bg-muted/50"}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <Upload className="h-8 w-8 text-muted-foreground" />
          {isDragActive ? (
            <p className="text-sm text-muted-foreground">Drop the file here</p>
          ) : files.length > 0 ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm font-medium">{files[0].name}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Drag & drop your image here, or click to select
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: JPG, JPEG, PNG, GIF
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
