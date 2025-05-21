// import { useCallback, useState } from "react";
// import { aiService } from "./models";

// /**
//  * Hook để tạo mô tả sản phẩm
//  */
// export function useProductDescription() {
//   const [description, setDescription] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const generateDescription = useCallback(
//     async (productInfo: {
//       name: string;
//       category: string;
//       features: string[];
//     }) => {
//       setLoading(true);
//       setError(null);

//       try {
//         const result = await aiService.generateProductDescription(productInfo);
//         setDescription(result);
//         return result;
//       } catch (err) {
//         const errorMessage =
//           err instanceof Error ? err.message : "Lỗi không xác định";
//         setError(errorMessage);
//         return null;
//       } finally {
//         setLoading(false);
//       }
//     },
//     []
//   );

//   return { description, loading, error, generateDescription };
// }

// /**
//  * Hook để trả lời câu hỏi
//  */
// export function useAIAnswer() {
//   const [answer, setAnswer] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const getAnswer = useCallback(async (question: string, context?: string) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const result = await aiService.answerQuestion(question, context);
//       setAnswer(result);
//       return result;
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : "Lỗi không xác định";
//       setError(errorMessage);
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   return { answer, loading, error, getAnswer };
// }

// /**
//  * Hook để tạo hình ảnh
//  */
// export function useImageGeneration() {
//   const [imageUrl, setImageUrl] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const generateImage = useCallback(async (prompt: string) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const result = await aiService.generateImage(prompt);
//       setImageUrl(result);
//       return result;
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : "Lỗi không xác định";
//       setError(errorMessage);
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   return { imageUrl, loading, error, generateImage };
// }

// /**
//  * Hook để tính toán
//  */
// export function useCalculation() {
//   const [result, setResult] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const calculate = useCallback(async (expression: string) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const calculationResult = await aiService.calculate(expression);
//       setResult(calculationResult);
//       return calculationResult;
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : "Lỗi không xác định";
//       setError(errorMessage);
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   return { result, loading, error, calculate };
// }
