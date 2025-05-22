import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { ChangeEvent, useRef } from "react";

interface FileUploadProps {
  onSelectFiles: (files: File[]) => void;
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
  isUploading?: boolean;
}

const FileUpload = ({
  onSelectFiles,
  buttonText = "Chọn ảnh",
  variant = "outline",
  className = "",
  multiple = true,
  isUploading = false,
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const fileArray = Array.from(files);
      onSelectFiles(fileArray);
    } catch (error) {
      console.error("Error selecting files:", error);
      alert("Chọn ảnh thất bại. Vui lòng thử lại.");
    } finally {
      // Reset input để có thể chọn lại cùng file nếu cần
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple={multiple}
        className="hidden"
      />
      <Button
        variant={variant}
        className={className}
        type="button"
        onClick={handleButtonClick}
        disabled={isUploading}
      >
        <Upload className="w-4 h-4 mr-2" />
        {isUploading ? "Đang tải lên..." : buttonText}
      </Button>
    </>
  );
};

export default FileUpload;
