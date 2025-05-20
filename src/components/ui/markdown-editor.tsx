import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import "@/styles/markdown.css";
import { AlertTriangle, Eye, FileText, Pencil, Upload } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

// Mẫu markdown mặc định
const DEFAULT_MARKDOWN_EXAMPLE = `## Tiêu đề sản phẩm

### Mô tả chi tiết
Đây là **mô tả** chi tiết về sản phẩm với một số *định dạng*.

### Đặc điểm nổi bật:
- Điểm nổi bật 1
- Điểm nổi bật 2
- Điểm nổi bật 3

### Thông số kỹ thuật:
1. Thông số 1
2. Thông số 2
3. Thông số 3`;

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  rows?: number;
  showToolbar?: boolean;
  exampleTemplate?: string;
  label?: React.ReactNode;
  className?: string;
  readOnly?: boolean;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  maxLength = 2000,
  placeholder = "Nhập nội dung Markdown...",
  rows = 8,
  showToolbar = true,
  exampleTemplate = DEFAULT_MARKDOWN_EXAMPLE,
  label,
  className = "",
  readOnly = false,
}) => {
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [charactersCount, setCharactersCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cập nhật số ký tự và kiểm tra chế độ xem trước
  useEffect(() => {
    setCharactersCount(value.length);

    // Tự động chuyển về chế độ chỉnh sửa nếu không có nội dung
    if (isPreview && value.trim() === "") {
      setIsPreview(false);
    }
  }, [value, isPreview]);

  // Xử lý khi người dùng nhập liệu
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= maxLength) {
      onChange(newText);
    } else {
      onChange(newText.substring(0, maxLength));
      toast.warning(`Đã đạt giới hạn ${maxLength} ký tự`);
    }
  };

  // Xử lý khi tải lên file markdown
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content.length > maxLength) {
        toast.error(
          `Nội dung file quá dài (${content.length} / ${maxLength} ký tự). Nội dung sẽ bị cắt.`
        );
        onChange(content.substring(0, maxLength));
      } else {
        onChange(content);
      }

      // Reset input để có thể chọn lại cùng một file
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    reader.onerror = () => {
      toast.error("Không thể đọc file. Vui lòng thử lại.");
    };

    reader.readAsText(file);
  };

  // Kích hoạt input file ẩn
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Sử dụng mẫu
  const useTemplate = () => {
    onChange(exampleTemplate);
  };

  // Xử lý chuỗi Markdown để hiển thị đúng
  const formatMarkdownText = (text: string) => {
    return text.replace(/\\n/g, "\n");
  };

  return (
    <div className={`markdown-editor ${className}`}>
      {label && <div className="mb-2">{label}</div>}

      {/* Thanh công cụ */}
      {showToolbar && (
        <div className="flex mb-2 gap-2">
          <Button
            type="button"
            size="sm"
            variant={!isPreview ? "default" : "outline"}
            onClick={() => setIsPreview(false)}
            disabled={readOnly}
            className="text-black border"
          >
            <Pencil className="h-4 w-4 mr-1" />
            Chỉnh sửa
          </Button>
          <Button
            type="button"
            size="sm"
            variant={isPreview ? "default" : "outline"}
            onClick={() => setIsPreview(true)}
            disabled={!value.trim() || readOnly}
            className="text-black"
          >
            <Eye className="h-4 w-4 mr-1" />
            Xem trước
          </Button>
        </div>
      )}

      {/* Chế độ xem trước */}
      {isPreview ? (
        <div className="p-4 border rounded-md min-h-[120px] bg-white overflow-auto markdown-preview">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ node, ...props }) => <p className="mb-4" {...props} />,
              h1: ({ node, ...props }) => (
                <h1 className="text-2xl font-bold mb-3" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-xl font-bold mb-2" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-lg font-bold mb-2" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc ml-5 mb-4" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal ml-5 mb-4" {...props} />
              ),
              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
              a: ({ node, ...props }) => (
                <a className="text-blue-500 underline" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-gray-200 pl-4 italic my-4"
                  {...props}
                />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-bold" {...props} />
              ),
              em: ({ node, ...props }) => <em className="italic" {...props} />,
            }}
          >
            {formatMarkdownText(value)}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          <Textarea
            value={value}
            onChange={handleTextChange}
            rows={rows}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={readOnly}
            className="resize-y"
          />

          {!readOnly && (
            <>
              {/* Hiển thị số ký tự */}
              <div className="flex justify-between items-center">
                <div className="flex items-center text-xs">
                  <span
                    className={
                      charactersCount > maxLength * 0.9
                        ? charactersCount >= maxLength
                          ? "text-red-500"
                          : "text-orange-500"
                        : "text-gray-500"
                    }
                  >
                    {charactersCount}/{maxLength} ký tự
                  </span>
                  {charactersCount > maxLength * 0.9 && (
                    <AlertTriangle
                      className={`h-3 w-3 ml-1 ${
                        charactersCount >= maxLength
                          ? "text-red-500"
                          : "text-orange-500"
                      }`}
                    />
                  )}
                </div>
              </div>

              {/* Các công cụ hỗ trợ */}
              <div className="flex flex-col space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={useTemplate}
                    className="flex items-center gap-1 text-black"
                  >
                    <FileText className="h-3 w-3" />
                    Sử dụng mẫu Markdown
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={triggerFileInput}
                    className="flex items-center gap-1 text-black"
                  >
                    <Upload className="h-3 w-3" />
                    Tải file Markdown
                  </Button>
                  {/* Input file ẩn */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".md,.txt"
                    className="hidden"
                  />
                </div>
                <div className="text-xs text-gray-500">
                  Hỗ trợ: <strong>**in đậm**</strong>, <em>*in nghiêng*</em>,{" "}
                  <strong>## tiêu đề</strong>, danh sách và các định dạng cơ bản
                  khác
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export const MarkdownViewer: React.FC<{
  content: string;
  className?: string;
}> = ({ content, className = "" }) => {
  // Xử lý chuỗi Markdown để hiển thị đúng
  const formatMarkdownText = (text: string) => {
    return text.replace(/\\n/g, "\n");
  };

  return (
    <div className={`markdown-preview ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ node, ...props }) => <p className="mb-4" {...props} />,
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-bold mb-3" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl font-bold mb-2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg font-bold mb-2" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc ml-5 mb-4" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal ml-5 mb-4" {...props} />
          ),
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          a: ({ node, ...props }) => (
            <a className="text-blue-500 underline" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-gray-200 pl-4 italic my-4"
              {...props}
            />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-bold" {...props} />
          ),
          em: ({ node, ...props }) => <em className="italic" {...props} />,
        }}
      >
        {formatMarkdownText(content)}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownEditor;
