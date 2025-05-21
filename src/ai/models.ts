import { PRODUCT_CATEGORIES } from "@/components/shop/ProductForm";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import { fetchProductByCategory, getTopOrder } from "./tools";

export class AIService {
  private model;

  constructor(apiKey = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY) {
    const googleAI = createGoogleGenerativeAI({
      apiKey,
    });

    this.model = googleAI("gemini-2.0-flash");
  }

  /**
   * Tạo văn bản dựa trên prompt
   * @param prompt Câu lệnh đầu vào
   * @returns Văn bản được tạo ra
   */
  async generateText(prompt: string): Promise<string> {
    try {
      const { text } = await generateText({
        model: this.model,
        tools: {
          fetchProductByCategory,
          getTopOrder,
        },
        messages: [
          {
            role: "system",
            content: `Bạn là AI G18, trợ lý thông minh trong hệ thống thương mại điện tử G18. Bạn có thể thực hiện nhiều tác vụ khác nhau liên quan đến sản phẩm, giỏ hàng, hóa đơn và thông tin mua sắm. Hãy phản hồi linh hoạt tùy theo ngữ cảnh yêu cầu của người dùng.

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

          Luôn trả lời bằng tiếng Việt, trình bày rõ ràng, hấp dẫn, dùng markdown nếu phù hợp, và sử dụng emoji để tăng tính thân thiện nếu cần.
          `,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        maxSteps: 5,
      });

      return text;
    } catch (error) {
      console.error("Lỗi khi tạo văn bản:", error);
      throw error;
    }
  }

  async checkProduct(file: File) {
    try {
      // Chuyển đổi File thành dữ liệu base64
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
