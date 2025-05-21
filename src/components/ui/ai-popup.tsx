import { aiService } from "@/ai";
import { cn } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { gsap } from "gsap";
import { ArrowUp, Smile, X } from "lucide-react";
import * as React from "react";
import { useSelector } from "react-redux";
import { Button } from "./button";
import { Card } from "./card";
import { Input } from "./input";
import { MarkdownViewer } from "./markdown-editor";

interface AIPopupProps {
  className?: string;
}

interface Message {
  id: string;
  type: "user" | "bot" | "typing";
  content: string;
}

export function AIPopup({ className }: AIPopupProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content: "Tôi là trợ lý AI của G18. Tôi có thể giúp gì cho bạn hôm nay?",
    },
  ]);

  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const typingAnimationRef = React.useRef<gsap.core.Tween | null>(null);
  const { isAuthenticated } = useSelector((state: RootState) => state.account);

  // Tạo ID duy nhất cho mỗi tin nhắn
  const generateId = () =>
    `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessageId = generateId();
    const typingIndicatorId = generateId();

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: userMessageId, type: "user", content: inputValue },
    ]);

    // Clear input ngay lập tức để tránh gửi lại
    const currentInput = inputValue;
    setInputValue("");

    // Thêm delay nhỏ để đảm bảo UI cập nhật trước khi thêm typing indicator
    setTimeout(() => {
      // Show typing indicator
      setIsLoading(true);
      setMessages((prev) => [
        ...prev,
        { id: typingIndicatorId, type: "typing", content: "" },
      ]);

      // Scroll to bottom
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }

      // Xử lý API call trong một async function riêng biệt
      const fetchAIResponse = async () => {
        try {
          const response = await aiService.generateText(currentInput);

          // Thêm delay nhỏ để tránh hiệu ứng chớp tắt
          setTimeout(() => {
            // Remove typing indicator and add bot response
            setMessages((prev) => {
              const filteredMessages = prev.filter(
                (msg) => msg.id !== typingIndicatorId
              );
              return [
                ...filteredMessages,
                { id: generateId(), type: "bot", content: response },
              ];
            });
          }, 300);
        } catch (error) {
          setTimeout(() => {
            // Handle error
            setMessages((prev) => {
              const filteredMessages = prev.filter(
                (msg) => msg.id !== typingIndicatorId
              );
              return [
                ...filteredMessages,
                {
                  id: generateId(),
                  type: "bot",
                  content:
                    "Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu của bạn. Vui lòng thử lại.",
                },
              ];
            });
          }, 300);
        } finally {
          setTimeout(() => {
            setIsLoading(false);
          }, 300);
        }
      };

      fetchAIResponse();
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Scroll to bottom when messages change
  React.useEffect(() => {
    if (chatContainerRef.current) {
      const scrollToBottom = () => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        }
      };

      // Đảm bảo scroll sau khi DOM đã cập nhật
      setTimeout(scrollToBottom, 50);
    }
  }, [messages]);

  // Setup và cleanup animation
  React.useEffect(() => {
    // Cleanup function to kill any existing animations
    return () => {
      if (typingAnimationRef.current) {
        typingAnimationRef.current.kill();
      }
    };
  }, []);

  // Animation for typing dots - chỉ tạo animation mới khi cần thiết
  const setupTypingAnimation = (element: HTMLElement) => {
    if (!element) return;

    const dots = element.querySelectorAll(".typing-dot");
    if (!dots.length) return;

    // Kill any existing animation
    if (typingAnimationRef.current) {
      typingAnimationRef.current.kill();
    }

    // Create new animation
    typingAnimationRef.current = gsap.to(dots, {
      opacity: 0.3,
      stagger: 0.2,
      repeat: -1,
      yoyo: true,
      duration: 0.5,
    });
  };

  React.useEffect(() => {
    if (isOpen) {
      // Animation for opening the popup - chỉ chạy khi popup mở
      gsap.fromTo(
        ".ai-popup-card",
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
      );

      // Focus input when popup opens
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isOpen]);

  // Stagger animation for new messages - tách riêng khỏi effect trên
  React.useEffect(() => {
    if (isOpen && messages.length > 0) {
      // Chỉ animate tin nhắn mới nhất để tránh hiệu ứng chớp tắt
      const newMessageElements = document.querySelectorAll(
        ".message-item:last-child"
      );
      if (newMessageElements.length > 0) {
        gsap.fromTo(
          newMessageElements,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
      }
    }
  }, [isOpen, messages]);

  // Xử lý click bên ngoài để đóng popup
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isAuthenticated) {
    return null;
  }

  // Typing indicator component
  const TypingIndicator = React.memo(() => (
    <div className="flex items-center space-x-1 h-5 px-2">
      <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></div>
      <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></div>
      <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></div>
    </div>
  ));

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      {isOpen ? (
        <Card
          ref={popupRef}
          className="ai-popup-card w-96 bg-white p-0 shadow-xl rounded-3xl overflow-hidden border border-gray-100"
        >
          {/* Header */}
          <div className="bg-white p-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    <img
                      src="/G18_Logo.png"
                      alt="G18"
                      className="w-9 h-9 transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-base">G18 AI</h3>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </div>

          {/* Chat container */}
          <div
            ref={chatContainerRef}
            className="p-4 h-80 overflow-y-auto bg-white space-y-4 scroll-smooth"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "message-item flex gap-2 max-w-[85%]",
                  message.type === "user" ? "ml-auto flex-row-reverse" : "",
                  message.type === "typing" ? "typing-message" : ""
                )}
              >
                {message.type === "typing" ? (
                  <div
                    className="rounded-xl p-3 text-sm bg-gray-100 text-gray-800"
                    ref={(element) => {
                      if (element) {
                        setupTypingAnimation(element);
                      }
                    }}
                  >
                    <TypingIndicator />
                  </div>
                ) : message.type === "bot" ? (
                  <div className="rounded-xl p-3 text-sm bg-gray-100 text-gray-800">
                    <MarkdownViewer
                      content={message.content}
                      className="text-sm markdown-chat"
                      useRouterLinks={true}
                    />
                  </div>
                ) : (
                  <div className="rounded-xl p-3 text-sm bg-blue-500 text-white">
                    {message.content}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input area - Updated to match the UI in the images */}
          <div className="p-3 border-t border-gray-100">
            <div className="flex items-center relative bg-transparent w-full rounded-full border border-gray-200">
              <Input
                ref={inputRef}
                placeholder="Nhập câu hỏi"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className={cn(
                  "rounded-full py-4 pl-4 pr-20 border-none focus-visible:ring-0 focus-visible:ring-offset-0",
                  isLoading && "opacity-70"
                )}
              />
              <div className="absolute right-2 flex items-center gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  disabled={isLoading}
                  className="rounded-full h-8 w-8 text-gray-400 hover:text-gray-600"
                >
                  <Smile className="h-5 w-5" />
                </Button>
                {inputValue.trim() ? (
                  <Button
                    onClick={handleSendMessage}
                    type="button"
                    size="icon"
                    disabled={isLoading}
                    className={cn(
                      "rounded-full h-8 w-8 bg-black hover:bg-gray-800 flex items-center justify-center",
                      isLoading && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <ArrowUp className="h-4 w-4 text-white" />
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Button
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg hover:shadow-primary/50
            bg-gradient-to-br from-primary to-primary/80
            group relative overflow-hidden
            transition-all duration-300
            hover:scale-110 hover:shadow-xl"
          onClick={() => {
            setIsOpen(true);
            setMessages([
              {
                id: "welcome",
                type: "bot",
                content:
                  "Tôi là trợ lý AI của G18. Tôi có thể giúp gì cho bạn hôm nay?",
              },
            ]);
          }}
        >
          <div
            className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100
            transition-opacity duration-300 rounded-full"
          ></div>
          <div className="relative z-10 flex items-center justify-center">
            <img
              src="/G18_Logo.png"
              alt="G18"
              className="w-9 h-9 transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <span
            className="absolute -bottom-10 text-xs font-medium text-background
            opacity-0 group-hover:opacity-100 group-hover:-bottom-6
            transition-all duration-300"
          >
            Trợ lý AI
          </span>
        </Button>
      )}
    </div>
  );
}
