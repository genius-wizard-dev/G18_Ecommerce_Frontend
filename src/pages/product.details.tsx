import { MarkdownViewer } from "@/components/ui/markdown-editor";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { CartItemBody } from "@/redux/slices/cartSlice";
import { addProductToCart } from "@/redux/thunks/cart";
import { getCurrentProduct } from "@/redux/thunks/product";
import {
  ProductAttribute,
  ProductCategory,
  ProductInput,
} from "@/schema/product";
import { Profile } from "@/schema/profile";
import { getAttributeTranslation } from "@/utils/attributeTranslation";
import { getImageUrl } from "@/utils/getImage";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const [product, setProduct] = useState<ProductInput | null>(null);
  const { products } = useAppSelector((state) => state.product);
  const { profile } = useAppSelector((state) => state.profile);

  const handleAddToCart = (product: ProductInput, profile: Profile) => {
    const cartItemInput: CartItemBody = {
      userId: profile.id,
      productId: product._id || "",
      quantity,
      price: product.price,
      shopId: product.shopId,
    };

    dispatch(addProductToCart(cartItemInput));
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const foundProduct = products.find((p: ProductInput) => p?._id === id);
    if (!foundProduct && id) {
      dispatch(getCurrentProduct(id)).then((data: any) => {
        const productData = data.payload.data;
        setProduct(productData);
        setSelectedImage(getImageUrl(productData.thumbnailImage));
      });
    } else {
      setProduct(foundProduct);
      if (foundProduct) {
        setSelectedImage(getImageUrl(foundProduct.thumbnailImage));
      }
    }
  }, [id, products, dispatch]);

  // Hàm render bảng thuộc tính sản phẩm dựa trên loại sản phẩm
  const renderAttributeTable = (product: ProductInput) => {
    if (!product.attribute) return null;

    const attribute = product.attribute as ProductAttribute;
    const categoryName = product.category as string;

    switch (product.category) {
      case ProductCategory.Clothes:
        return (
          <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Đặc điểm
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Thông tin
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 text-sm font-medium">
                  {getAttributeTranslation("brand", categoryName)}
                </td>
                <td className="px-4 py-2 text-sm">
                  {(attribute as any).brand}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm font-medium">
                  {getAttributeTranslation("material", categoryName)}
                </td>
                <td className="px-4 py-2 text-sm">
                  {(attribute as any).material}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm font-medium">
                  {getAttributeTranslation("size", categoryName)}
                </td>
                <td className="px-4 py-2 text-sm">
                  {Array.isArray((attribute as any).size)
                    ? (attribute as any).size.join(", ")
                    : (attribute as any).size}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm font-medium">
                  {getAttributeTranslation("color", categoryName)}
                </td>
                <td className="px-4 py-2 text-sm">
                  {Array.isArray((attribute as any).color)
                    ? (attribute as any).color.join(", ")
                    : (attribute as any).color}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm font-medium">
                  {getAttributeTranslation("pattern", categoryName)}
                </td>
                <td className="px-4 py-2 text-sm">
                  {Array.isArray((attribute as any).pattern)
                    ? (attribute as any).pattern.join(", ")
                    : (attribute as any).pattern}
                </td>
              </tr>
            </tbody>
          </table>
        );

      case ProductCategory.Mobile:
        return (
          <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Đặc điểm
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Thông tin
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 text-sm font-medium">
                  {getAttributeTranslation("brand", categoryName)}
                </td>
                <td className="px-4 py-2 text-sm">
                  {(attribute as any).brand}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm font-medium">
                  {getAttributeTranslation("screenSize", categoryName)}
                </td>
                <td className="px-4 py-2 text-sm">
                  {(attribute as any).screenSize}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm font-medium">
                  {getAttributeTranslation("ram", categoryName)}
                </td>
                <td className="px-4 py-2 text-sm">
                  {Array.isArray((attribute as any).ram)
                    ? (attribute as any).ram.join(", ")
                    : (attribute as any).ram}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm font-medium">
                  {getAttributeTranslation("storage", categoryName)}
                </td>
                <td className="px-4 py-2 text-sm">
                  {Array.isArray((attribute as any).storage)
                    ? (attribute as any).storage.join(", ")
                    : (attribute as any).storage}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm font-medium">
                  {getAttributeTranslation("operatingSystem", categoryName)}
                </td>
                <td className="px-4 py-2 text-sm">
                  {(attribute as any).operatingSystem}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm font-medium">
                  {getAttributeTranslation("battery", categoryName)}
                </td>
                <td className="px-4 py-2 text-sm">
                  {(attribute as any).battery}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm font-medium">
                  {getAttributeTranslation("rear", categoryName)}
                </td>
                <td className="px-4 py-2 text-sm">
                  {Array.isArray((attribute as any).camera?.rear)
                    ? (attribute as any).camera.rear.join(", ")
                    : (attribute as any).camera?.rear}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm font-medium">
                  {getAttributeTranslation("front", categoryName)}
                </td>
                <td className="px-4 py-2 text-sm">
                  {Array.isArray((attribute as any).camera?.front)
                    ? (attribute as any).camera.front.join(", ")
                    : (attribute as any).camera?.front}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm font-medium">
                  {getAttributeTranslation("color", categoryName)}
                </td>
                <td className="px-4 py-2 text-sm">
                  {Array.isArray((attribute as any).color)
                    ? (attribute as any).color.join(", ")
                    : (attribute as any).color}
                </td>
              </tr>
            </tbody>
          </table>
        );

      case ProductCategory.Electronics:
        return (
          <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Đặc điểm
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Thông tin
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 text-sm font-medium">
                  {getAttributeTranslation("brand", categoryName)}
                </td>
                <td className="px-4 py-2 text-sm">
                  {(attribute as any).brand}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm font-medium">
                  {getAttributeTranslation("powerConsumption", categoryName)}
                </td>
                <td className="px-4 py-2 text-sm">
                  {(attribute as any).powerConsumption}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm font-medium">
                  {getAttributeTranslation("dimensions", categoryName)}
                </td>
                <td className="px-4 py-2 text-sm">
                  {(attribute as any).dimensions}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm font-medium">
                  {getAttributeTranslation("connectivity", categoryName)}
                </td>
                <td className="px-4 py-2 text-sm">
                  {Array.isArray((attribute as any).connectivity)
                    ? (attribute as any).connectivity.join(", ")
                    : (attribute as any).connectivity}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm font-medium">
                  {getAttributeTranslation("warranty", categoryName)}
                </td>
                <td className="px-4 py-2 text-sm">
                  {(attribute as any).warranty}
                </td>
              </tr>
            </tbody>
          </table>
        );

      // Có thể thêm các loại sản phẩm khác tại đây...

      default:
        // Cách tiếp cận động cho các loại sản phẩm khác
        const entries = Object.entries(attribute);
        return (
          <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Đặc điểm
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Thông tin
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map(([key, value]) => (
                <tr key={key}>
                  <td className="px-4 py-2 text-sm font-medium">
                    {getAttributeTranslation(key, categoryName)}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {Array.isArray(value)
                      ? value.join(", ")
                      : typeof value === "object" && value !== null
                      ? Object.entries(value)
                          .map(
                            ([k, v]) =>
                              `${getAttributeTranslation(k, categoryName)}: ${
                                Array.isArray(v) ? v.join(", ") : v
                              }`
                          )
                          .join("; ")
                      : String(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
    }
  };

  if (!product || !profile)
    return (
      <div className="p-8 text-center">Đang tải thông tin sản phẩm...</div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Phần hình ảnh sản phẩm */}
        <div className="space-y-4">
          <div className="aspect-square rounded-xl border overflow-hidden bg-gray-50 max-w-sm mx-auto shadow-md">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-contain p-4"
            />
          </div>

          {/* Gallery ảnh */}
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-w-sm mx-auto">
            <div
              className={`aspect-square h-12 w-12 rounded border overflow-hidden cursor-pointer hover:opacity-80 transition-opacity ${
                selectedImage === getImageUrl(product.thumbnailImage)
                  ? "ring-2 ring-blue-500"
                  : ""
              }`}
              onClick={() =>
                setSelectedImage(getImageUrl(product.thumbnailImage))
              }
            >
              <img
                src={getImageUrl(product.thumbnailImage)}
                alt={`${product.name} - thumbnail`}
                className="w-full h-full object-cover"
              />
            </div>

            {product.images &&
              product.images.map((image, index) => (
                <div
                  key={index}
                  className={`aspect-square h-12 w-12 rounded border overflow-hidden cursor-pointer hover:opacity-80 transition-opacity ${
                    selectedImage === getImageUrl(image)
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                  onClick={() => setSelectedImage(getImageUrl(image))}
                >
                  <img
                    src={getImageUrl(image)}
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="text-2xl font-semibold text-red-600">
            {product.price.toLocaleString()}₫
          </div>

          {product.ratings && (
            <div className="flex items-center text-yellow-500">
              {"★".repeat(Math.floor(product.ratings.average))}
              {"☆".repeat(5 - Math.floor(product.ratings.average))}
              <span className="text-sm text-gray-500 ml-2">
                ({product.ratings.average.toFixed(1)}) - {product.ratings.count}{" "}
                đánh giá
              </span>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-md overflow-hidden">
              <button
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
                className="w-14 text-center border-x py-1"
              />
              <button
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>

            <button
              onClick={() => handleAddToCart(product, profile)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
            >
              Thêm vào giỏ hàng
            </button>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Phần mô tả chi tiết */}
          <div className="pt-6 border-t">
            <h2 className="text-xl font-semibold mb-4">Mô tả sản phẩm</h2>
            <div className="prose max-w-none">
              <MarkdownViewer content={product.description} />
            </div>
          </div>
        </div>
      </div>

      {/* Bảng thông số kỹ thuật */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Thông số kỹ thuật</h2>
        {renderAttributeTable(product)}
      </div>
    </div>
  );
};

export default ProductDetails;
