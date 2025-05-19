import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useEffect, useRef } from "react";

interface CloudinaryUploadWidgetProps {
  uwConfig: {
    cloudName: string;
    uploadPreset: string;
    [key: string]: any;
  };
  setPublicIds: (publicIds: string[]) => void;
  buttonText?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  className?: string;
  multiple?: boolean;
}

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        config: any,
        callback: (error: any, result: any) => void
      ) => {
        open: () => void;
      };
    };
  }
}

const CloudinaryUploadWidget = ({
  uwConfig,
  setPublicIds,
  buttonText = "Tải lên",
  variant = "outline",
  className = "",
  multiple = true,
}: CloudinaryUploadWidgetProps) => {
  const uploadWidgetRef = useRef<any>(null);
  const uploadButtonRef = useRef<HTMLButtonElement>(null);
  const uploadedFiles = useRef<string[]>([]);

  useEffect(() => {
    const initializeUploadWidget = () => {
      if (window.cloudinary && uploadButtonRef.current) {
        // Create upload widget with updated config
        const config = {
          ...uwConfig,
          multiple: multiple,
        };

        uploadWidgetRef.current = window.cloudinary.createUploadWidget(
          config,
          (error: any, result: any) => {
            if (!error && result) {
              if (result.event === "success") {
                console.log("Upload successful:", result.info);
                const publicId = result.info.public_id;

                if (multiple) {
                  // Add to array for multiple uploads
                  uploadedFiles.current = [...uploadedFiles.current, publicId];
                  setPublicIds(uploadedFiles.current);
                } else {
                  // Single upload mode
                  uploadedFiles.current = [publicId];
                  setPublicIds([publicId]);
                }
              }

              if (result.event === "close") {
                // Widget closed, ensure we've captured all uploads
                if (uploadedFiles.current.length > 0) {
                  setPublicIds([...uploadedFiles.current]);
                }
              }
            }
          }
        );

        // Add click event to open widget
        const handleUploadClick = () => {
          if (!multiple) {
            // Reset for single upload mode
            uploadedFiles.current = [];
          }

          if (uploadWidgetRef.current) {
            uploadWidgetRef.current.open();
          }
        };

        const buttonElement = uploadButtonRef.current;
        buttonElement.addEventListener("click", handleUploadClick);

        // Cleanup
        return () => {
          buttonElement.removeEventListener("click", handleUploadClick);
        };
      }
    };

    initializeUploadWidget();
  }, [uwConfig, setPublicIds, multiple]);

  return (
    <Button
      ref={uploadButtonRef}
      variant={variant}
      className={className}
      type="button"
    >
      <Upload className="w-4 h-4 mr-2" />
      {buttonText}
    </Button>
  );
};

export default CloudinaryUploadWidget;
