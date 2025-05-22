import { PRODUCT_CATEGORIES } from "@/components/shop/ProductForm";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import {
  addProductToCart,
  deleteCartItem,
  fetchProductByCategory,
  getCart,
  getTopOrder,
  updateCartItem,
} from "./tools";

// Định nghĩa kiểu dữ liệu cho lịch sử tin nhắn
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  toolsData?: any; // Lưu dữ liệu từ công cụ như danh sách sản phẩm, đơn hàng...
}

export class AIService {
  private model;
  private readonly CHAT_HISTORY_KEY = "g18_chat_history";
  private readonly MAX_HISTORY_MESSAGES = 3;

  constructor(apiKey = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY) {
    const googleAI = createGoogleGenerativeAI({
      apiKey,
    });

    this.model = googleAI("gemini-2.0-flash");
  }

  /**
   * Lấy lịch sử chat từ localStorage
   */
  private getChatHistory(): ChatMessage[] {
    try {
      const history = localStorage.getItem(this.CHAT_HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error("Lỗi khi đọc lịch sử chat:", error);
      return [];
    }
  }

  /**
   * Lưu tin nhắn vào lịch sử chat
   */
  private saveChatMessage(message: ChatMessage) {
    try {
      let history = this.getChatHistory();
      history.push(message);

      // Giới hạn số lượng tin nhắn lưu trữ
      if (history.length > this.MAX_HISTORY_MESSAGES * 2) {
        // Nhân 2 vì mỗi tương tác có 2 tin nhắn (user + assistant)
        history = history.slice(-this.MAX_HISTORY_MESSAGES * 2);
      }

      localStorage.setItem(this.CHAT_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("Lỗi khi lưu tin nhắn:", error);
    }
  }

  clearChatHistory() {
    localStorage.removeItem(this.CHAT_HISTORY_KEY);
  }

  /**
   * Tạo văn bản dựa trên prompt
   * @param prompt Câu lệnh đầu vào
   * @returns Văn bản được tạo ra và dữ liệu từ công cụ
   */
  async generateText(prompt: string, userId: string) {
    try {
      let toolsData = null;

      // Lấy lịch sử chat để thêm vào context
      const chatHistory = this.getChatHistory();

      // Tạo các tin nhắn lịch sử để thêm vào context
      const historyMessages = chatHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
        // Thêm dữ liệu công cụ vào nội dung nếu có
        ...(msg.toolsData
          ? {
              toolsData: JSON.stringify(msg.toolsData),
            }
          : {}),
      }));

      const { text, steps } = await generateText({
        model: this.model,
        tools: {
          fetchProductByCategory,
          getTopOrder,
          addProductToCart,
          getCart,
          updateCartItem,
          deleteCartItem,
        },
        messages: [
          {
            role: "system",
            content: `
            Bạn là AI G18, trợ lý thông minh trong hệ thống thương mại điện tử G18. Bạn có thể thực hiện nhiều tác vụ khác nhau liên quan đến sản phẩm, giỏ hàng, hóa đơn và thông tin mua sắm. Hãy phản hồi linh hoạt tùy theo ngữ cảnh yêu cầu của người dùng.

          Nguyên tắc phản hồi:
          - Nếu được hỏi bạn là AI gì, hãy trả lời: "Tôi là AI G18, trợ lý AI của G18. Tôi có thể giúp gì cho bạn hôm nay?"
          - Nếu người dùng yêu cầu **hiển thị danh sách sản phẩm**, hãy trả về dạng markdown:
            • Mỗi sản phẩm có tiêu đề với emoji 🛍️ và số thứ tự.
            • Tên sản phẩm là link markdown dạng: [Tên sản phẩm](/product/id)
            • Mỗi sản phẩm cách nhau bằng đường kẻ ngang '---'
            • Hiển thị đúng markdown, có xuống dòng rõ ràng.

          - Nếu người dùng gửi yêu cầu kiểm tra **giỏ hàng** hoặc **hóa đơn**:
            • Hãy phân tích và xác định các mục hàng, số lượng, tổng tiền, thuế (nếu có), định dạng đầu ra rõ ràng, dễ hiểu.
            • Nếu có lỗi (thiếu sản phẩm, số lượng không hợp lệ...), hãy thông báo cụ thể lỗi và đề xuất chỉnh sửa.

          - Nếu người dùng dùng tiếng Việt để nói danh mục sản phẩm, hãy tự động ánh xạ sang tiếng Anh dựa trên danh sách sau:
            ${PRODUCT_CATEGORIES.map(
              (category) => `${category.label} => ${category.value}`
            ).join(", ")}

          - Nếu người dùng muốn thêm sản phẩm vào giỏ hàng sau khi bạn đã liệt kê danh sách sản phẩm:
            • Phân tích tin nhắn trước đó để tìm ID sản phẩm mà người dùng muốn thêm.
            • Sử dụng tool addProductToCart với ID sản phẩm đã xác định và số lượng người dùng yêu cầu (mặc định là 1).
            • Thông báo kết quả thêm sản phẩm vào giỏ hàng một cách rõ ràng.

          - QUAN TRỌNG: Khi người dùng yêu cầu thêm sản phẩm vào giỏ hàng, hãy kiểm tra dữ liệu toolsData trong lịch sử chat để tìm ID sản phẩm.
            • Nếu có nhiều sản phẩm, hãy hỏi người dùng muốn thêm sản phẩm nào.
            • Nếu người dùng đề cập đến tên sản phẩm, hãy tìm ID tương ứng trong dữ liệu lịch sử.
            • Luôn sử dụng ID chính xác khi gọi tool addProductToCart.

          Thông tin người dùng hiện tại: userId=${userId}

          Luôn trả lời bằng tiếng Việt, trình bày rõ ràng, hấp dẫn, dùng markdown nếu phù hợp, và sử dụng emoji để tăng tính thân thiện nếu cần.
          Lưu ý không trả về bất kỳ ID, cartItemId nào ra giao diện hoặc trong câu trả lời, chỉ trả về thông tin sản phẩm, giỏ hàng, hóa đơn.
          Với các thao tác update hoặc xóa giỏ hàng hãy yêu cầu lấy danh sách sản phẩm trong giỏ hàng trước.
          `,
          },

          ...historyMessages,
          {
            role: "user",
            content: prompt,
          },
        ],
        maxSteps: 5,
      });

      // Lưu tin nhắn người dùng
      this.saveChatMessage({
        role: "user",
        content: prompt,
      });

      // Chỉ lưu kết quả và tên công cụ từ các bước
      const allToolsData = steps
        .filter(
          (step) =>
            step.toolCalls && step.toolCalls.length > 0 && step.toolResults
        )
        .map((step) => {
          if (step.toolCalls && step.toolCalls.length > 0 && step.toolResults) {
            return {
              toolName: step.toolCalls[0].toolName,
              result: step.toolResults[0].result,
            };
          }
          return null;
        })
        .filter((data) => data !== null);

      if (allToolsData.length > 0) {
        toolsData = allToolsData.length === 1 ? allToolsData[0] : allToolsData;
      }

      // Lưu phản hồi của AI
      this.saveChatMessage({
        role: "assistant",
        content: text,
        toolsData: toolsData,
      });

      return text;
    } catch (error) {
      console.error("Lỗi khi tạo văn bản:", error);
      throw error;
    }
  }

  async checkProduct(file: File) {
    try {
      const imageBuffer = await file.arrayBuffer();
      const base64Image = btoa(
        new Uint8Array(imageBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      const { object } = await generateObject({
        model: this.model,
        messages: [
          {
            role: "system",
            content: `Bạn là một AI đánh giá hình ảnh, nhiệm vụ của bạn là kiểm tra xem hình ảnh có chứa nội dung vi phạm như: thuốc lá, rượu bia, chất cấm, vũ khí hoặc hình ảnh trái phép hay không; nếu ảnh vi phạm, hãy trả về lý do mô tả rõ nội dung vi phạm (ví dụ: ảnh có chứa điếu thuốc, chai rượu, vũ khí...); luôn trả lời bằng tiếng Việt, trình bày rõ ràng, dễ hiểu, có sử dụng emoji phù hợp nếu cần.`,
          },
          {
            role: "user",
            content: [
              {
                type: "image",
                image: base64Image,
              },
            ],
          },
        ],

        schema: z.object({
          isValid: z.boolean(),
          reason: z.string().optional().describe("Lý do nếu isValid là false"),
        }),
      });

      return object;
    } catch (error) {
      console.error("Lỗi khi phân tích hình ảnh:", error);
      throw error;
    }
  }

  async generateProductDescription(file: File): Promise<string> {
    try {
      // Chuyển đổi File thành dữ liệu base64
      const imageBuffer = await file.arrayBuffer();
      const base64Image = btoa(
        new Uint8Array(imageBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      const { text } = await generateText({
        model: this.model,
        messages: [
          {
            role: "system",
            content:
              "Bạn là chuyên gia tạo mô tả sản phẩm từ hình ảnh. Dựa trên hình ảnh, viết mô tả ngắn gọn (tối đa 150 từ), tập trung vào tính năng, công dụng và lợi ích. Sử dụng ngôn ngữ tự nhiên, hấp dẫn, dễ hiểu. Chỉ viết mô tả, không thêm tiêu đề hay thông tin khác'. Luôn trả lời bằng tiếng Việt, Luôn có định markdown xuống hàng phân chia thật đẹp, dùng emoji khi phù hợp.",
          },
          {
            role: "user",
            content: [
              {
                type: "image",
                image: base64Image,
              },
            ],
          },
        ],
      });
      return text;
    } catch (error) {
      console.error("Lỗi khi phân tích hình ảnh:", error);
      throw error;
    }
  }
}

export const aiService = new AIService();
