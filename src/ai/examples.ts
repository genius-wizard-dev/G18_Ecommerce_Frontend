// import { aiService } from "./models";

// /**
//  * Ví dụ về cách sử dụng AIService để tạo mô tả sản phẩm
//  */
// export async function generateProductDescriptionExample() {
//   const productInfo = {
//     name: "Tai nghe không dây XYZ",
//     category: "Thiết bị âm thanh",
//     features: [
//       "Chống ồn chủ động",
//       "Pin 24 giờ",
//       "Kết nối Bluetooth 5.2",
//       "Chống nước IPX4",
//     ],
//   };

//   try {
//     const description = await aiService.generateProductDescription(productInfo);
//     console.log("Mô tả sản phẩm:", description);
//     return description;
//   } catch (error) {
//     console.error("Lỗi khi tạo mô tả sản phẩm:", error);
//     throw error;
//   }
// }

// /**
//  * Ví dụ về cách sử dụng AIService để phân tích hình ảnh
//  */
// export async function analyzeImageExample(imageUrl: string) {
//   try {
//     const description = await aiService.analyzeImage(
//       imageUrl,
//       "Hãy mô tả chi tiết những gì bạn thấy trong hình ảnh này và đề xuất một số từ khóa để tìm kiếm sản phẩm tương tự."
//     );
//     console.log("Phân tích hình ảnh:", description);
//     return description;
//   } catch (error) {
//     console.error("Lỗi khi phân tích hình ảnh:", error);
//     throw error;
//   }
// }

// /**
//  * Ví dụ về cách sử dụng AIService để trả lời câu hỏi
//  */
// export async function answerQuestionExample(question: string) {
//   try {
//     const answer = await aiService.answerQuestion(question);
//     console.log("Câu trả lời:", answer);
//     return answer;
//   } catch (error) {
//     console.error("Lỗi khi trả lời câu hỏi:", error);
//     throw error;
//   }
// }

// /**
//  * Ví dụ về cách sử dụng AIService để tính toán
//  */
// export async function calculateExample(expression: string) {
//   try {
//     const result = await aiService.calculate(expression);
//     console.log("Kết quả tính toán:", result);
//     return result;
//   } catch (error) {
//     console.error("Lỗi khi tính toán:", error);
//     throw error;
//   }
// }

// // Ví dụ sử dụng trong component React
// /*
// import { useEffect, useState } from 'react';
// import { aiService } from '../ai/models';

// export function AIProductDescription({ product }) {
//   const [description, setDescription] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function generateDescription() {
//       if (!product) return;

//       setLoading(true);
//       try {
//         const generatedDescription = await aiService.generateProductDescription({
//           name: product.name,
//           category: product.category,
//           features: product.features
//         });
//         setDescription(generatedDescription);
//       } catch (err) {
//         setError('Không thể tạo mô tả sản phẩm');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     generateDescription();
//   }, [product]);

//   if (loading) return <p>Đang tạo mô tả...</p>;
//   if (error) return <p className="error">{error}</p>;

//   return (
//     <div className="product-description">
//       <h3>Mô tả sản phẩm</h3>
//       <div>{description}</div>
//     </div>
//   );
// }
// */
