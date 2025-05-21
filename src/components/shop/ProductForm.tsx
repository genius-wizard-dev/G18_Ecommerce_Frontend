import { aiService } from "@/ai/models";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MarkdownEditor from "@/components/ui/markdown-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AttributeRecord,
  ProductCategory,
  ProductInput,
} from "@/schema/product";
import { CLOUDINARY_CONFIG } from "@/utils/cloudinary.config";
import { getImageUrl } from "@/utils/getImage";
import FileUpload from "@/utils/upload.images.tsx";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  Tag,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductAttributeFields from "./ProductAttributeFields";

// Danh sách loại sản phẩm
export const PRODUCT_CATEGORIES = [
  { value: "Clothes", label: "Quần áo" },
  { value: "Mobile", label: "Điện thoại" },
  { value: "Electronics", label: "Điện tử" },
  { value: "Computer", label: "Máy tính" },
  { value: "Camera", label: "Máy ảnh" },
  { value: "Watch", label: "Đồng hồ" },
  { value: "Beauty", label: "Mỹ phẩm" },
  { value: "Health", label: "Sức khỏe" },
  { value: "Grocery", label: "Thực phẩm" },
  { value: "Toy", label: "Đồ chơi" },
  { value: "MenShoes", label: "Giày nam" },
  { value: "WomenShoes", label: "Giày nữ" },
  { value: "WomenBags", label: "Túi xách nữ" },
  { value: "FashionAccessories", label: "Phụ kiện thời trang" },
  { value: "BooksStationery", label: "Sách và văn phòng phẩm" },
  { value: "MenBags", label: "Túi xách nam" },
  { value: "Pet", label: "Thú cưng" },
  { value: "ToolsHomeImprovement", label: "Công cụ và cải tạo nhà" },
  { value: "MomsKidsBabies", label: "Mẹ và bé" },
  { value: "HomeLiving", label: "Đồ gia dụng" },
  { value: "SportOutdoor", label: "Thể thao và ngoài trời" },
  { value: "KidFashion", label: "Thời trang trẻ em" },
  { value: "HomeCare", label: "Chăm sóc nhà cửa" },
];

interface ProductFormProps {
  selectedProduct: ProductInput | null;
  isLoading: boolean;
  isUploading: boolean;
  onSubmit: (productData: {
    name: string;
    price: number;
    quantity: number;
    category: string;
    description: string;
    attributes: AttributeRecord;
    tags: string[];
    thumbnailFile: File | null;
    imageFiles: File[];
  }) => void;
  onCancel: () => void;
  setIsUploading: (isUploading: boolean) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  selectedProduct,
  isLoading,
  isUploading,
  onSubmit,
  onCancel,
  setIsUploading,
}) => {
  const [isFormCollapsed, setIsFormCollapsed] = useState(false);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [attributes, setAttributes] = useState<AttributeRecord>({});
  const [tags, setTags] = useState<string>("");
  // Lưu trữ thuộc tính của sản phẩm đang chỉnh sửa
  const [selectedProductAttributes, setSelectedProductAttributes] =
    useState<AttributeRecord | null>(null);

  // States cho hình ảnh
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  // Reset thuộc tính khi thay đổi danh mục
  useEffect(() => {
    // Chỉ reset attributes khi không có sản phẩm được chọn
    // hoặc khi lần đầu khởi tạo form
    if (!selectedProduct) {
      setAttributes({});
    }
  }, [category, selectedProduct]);

  // Xử lý khi có selectedProduct được truyền vào
  useEffect(() => {
    if (selectedProduct) {
      setName(selectedProduct.name);
      setPrice(selectedProduct.price.toString());
      // Quantity được truyền riêng từ inventory hoặc từ giá trị mặc định
      setQuantity((selectedProduct as any).quantity?.toString() || "0");

      // Tìm category từ enum
      const categoryString =
        Object.keys(ProductCategory).find(
          (key) =>
            ProductCategory[key as keyof typeof ProductCategory] ===
            selectedProduct.category
        ) || "";
      setCategory(categoryString);

      // Đặt lại description và tags
      setDescription(selectedProduct.description || "");
      setTags(selectedProduct.tags ? selectedProduct.tags.join(", ") : "");

      // Lưu trữ thuộc tính của sản phẩm đang chỉnh sửa
      if (selectedProduct.attribute) {
        console.log("Loading attributes:", selectedProduct.attribute);
        setSelectedProductAttributes(
          selectedProduct.attribute as AttributeRecord
        );
        // Thiết lập thuộc tính ngay lập tức
        setAttributes(selectedProduct.attribute as AttributeRecord);
      } else {
        setSelectedProductAttributes(null);
        setAttributes({});
      }

      // Cập nhật các preview nếu có
      if (selectedProduct.thumbnailImage) {
        setThumbnailPreview(getImageUrl(selectedProduct.thumbnailImage));
      }

      if (selectedProduct.images && selectedProduct.images.length > 0) {
        setImagePreview(selectedProduct.images.map((img) => getImageUrl(img)));
      }
    } else {
      // Reset form khi không có selectedProduct
      setName("");
      setPrice("");
      setQuantity("");
      setCategory("");
      setDescription("");
      setAttributes({});
      setSelectedProductAttributes(null);
      setTags("");
      setThumbnailFile(null);
      setThumbnailPreview("");
      setImageFiles([]);
      setImagePreview([]);
    }
  }, [selectedProduct]);

  // Xử lý thumbnail image để preview
  const handleThumbnailUpload = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];

      try {
        // Kiểm tra ảnh trước khi tải lên
        setIsUploading(true);
        const response = await aiService.checkProduct(file);
        setIsUploading(false);

        if (response.isValid) {
          setThumbnailFile(file);
          setThumbnailPreview(URL.createObjectURL(file));
          toast.success("Ảnh hợp lệ, đã thêm vào danh sách.");
        } else {
          toast.error(
            `Ảnh không hợp lệ: ${response.reason || "Chứa nội dung vi phạm"}`
          );
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra ảnh:", error);
        toast.error("Không thể kiểm tra ảnh. Vui lòng thử lại sau.");
        setIsUploading(false);
      }
    }
  };

  // Xử lý multiple images để preview
  const handleImagesUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    const validFiles: File[] = [];
    const validPreviewUrls: string[] = [];

    try {
      // Kiểm tra từng ảnh một
      for (const file of files) {
        try {
          const response = await aiService.checkProduct(file);

          if (response.isValid) {
            validFiles.push(file);
            validPreviewUrls.push(URL.createObjectURL(file));
          } else {
            toast.error(
              `Ảnh không hợp lệ: ${response.reason || "Chứa nội dung vi phạm"}`
            );
          }
        } catch (error) {
          console.error("Lỗi khi kiểm tra ảnh:", error);
        }
      }

      if (validFiles.length > 0) {
        setImageFiles((prevFiles) => [...prevFiles, ...validFiles]);
        setImagePreview((prevUrls) => [...prevUrls, ...validPreviewUrls]);
        toast.success(`Đã thêm ${validFiles.length} ảnh hợp lệ.`);
      }

      if (validFiles.length < files.length) {
        toast.warning(
          `${
            files.length - validFiles.length
          } ảnh đã bị loại bỏ do không hợp lệ.`
        );
      }
    } catch (error) {
      console.error("Lỗi khi xử lý ảnh:", error);
      toast.error("Đã xảy ra lỗi khi xử lý ảnh.");
    } finally {
      setIsUploading(false);
    }
  };

  // Xóa thumbnail image
  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview("");
  };

  // Xóa một hình ảnh từ mảng images
  const handleRemoveImage = (index: number) => {
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);

    const newImagePreview = [...imagePreview];
    URL.revokeObjectURL(newImagePreview[index]);
    newImagePreview.splice(index, 1);
    setImagePreview(newImagePreview);
  };

  // Cập nhật giá trị thuộc tính
  const handleAttributeChange = (key: string, value: any) => {
    setAttributes((prev) => ({ ...prev, [key]: value }));
  };

  // Cập nhật giá trị thuộc tính dạng mảng
  const handleArrayAttributeChange = (key: string, value: string) => {
    const values = value.split(",").map((item) => item.trim());
    setAttributes((prev) => ({ ...prev, [key]: values }));
  };

  // Cập nhật giá trị thuộc tính dạng đối tượng lồng nhau
  const handleNestedObjectChange = (
    parent: string,
    key: string,
    value: string
  ) => {
    const values = value.split(",").map((item) => item.trim());
    setAttributes((prev) => {
      const parentObj = (prev[parent] as Record<string, string[]>) || {};
      return {
        ...prev,
        [parent]: {
          ...parentObj,
          [key]: values,
        },
      };
    });
  };

  // Xử lý khi submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedPrice = Number(price);
    const parsedQuantity = Number(quantity);
    const productTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    onSubmit({
      name,
      price: parsedPrice,
      quantity: parsedQuantity,
      category,
      description,
      attributes,
      tags: productTags,
      thumbnailFile,
      imageFiles,
    });

    // Không tự động reset form ở đây, sẽ reset khi thao tác thành công thông qua Redux
  };

  // Reset form
  const resetForm = () => {
    setName("");
    setPrice("");
    setQuantity("");
    setThumbnailFile(null);
    setThumbnailPreview("");
    setImageFiles([]);
    setImagePreview([]);
    setCategory("");
    setDescription("");
    setAttributes({});
    setTags("");
  };

  // Hủy chỉnh sửa và reset form
  const cancelEdit = () => {
    resetForm();
    onCancel();
  };

  // Hàm handleGenerateDescription
  const handleGenerateDescription = async (file: File): Promise<void> => {
    try {
      // Tạo FormData để gửi file
      const data = await aiService.generateProductDescription(file);
      console.log(data);

      if (data) {
        setDescription(data);
        toast.success("Đã tạo mô tả tự động thành công!");
      } else {
        toast.error("Không nhận được mô tả từ API");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API tạo mô tả:", error);
      toast.error("Không thể tạo mô tả tự động. Vui lòng thử lại sau.");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pr-6">
        <CardTitle className="flex items-center">
          {selectedProduct !== null ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFormCollapsed(!isFormCollapsed)}
          className="h-8 w-8 p-0 rounded-full"
          title={isFormCollapsed ? "Mở rộng" : "Thu gọn"}
        >
          {isFormCollapsed ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent className={isFormCollapsed ? "hidden" : ""}>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">
                Đang tải thông tin sản phẩm...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Tên sản phẩm</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Loại sản phẩm</Label>
                <Select
                  value={category}
                  onValueChange={(value) => {
                    // Nếu người dùng thay đổi danh mục, cần reset thuộc tính
                    setCategory(value);
                    // Reset attributes khi người dùng chủ động thay đổi danh mục
                    if (selectedProduct) {
                      // Tìm category từ enum
                      const categoryString =
                        Object.keys(ProductCategory).find(
                          (key) =>
                            ProductCategory[
                              key as keyof typeof ProductCategory
                            ] === selectedProduct.category
                        ) || "";

                      // Nếu người dùng thay đổi sang danh mục khác với danh mục ban đầu của sản phẩm
                      // thì reset thuộc tính
                      if (value !== categoryString) {
                        setAttributes({});
                        toast.info(
                          "Đã reset thuộc tính do thay đổi danh mục sản phẩm"
                        );
                      }
                    }
                  }}
                  disabled={selectedProduct !== null}
                >
                  <SelectTrigger
                    className={`bg-white ${
                      selectedProduct !== null
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Chọn loại sản phẩm" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedProduct !== null && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Không thể thay đổi loại sản phẩm khi chỉnh sửa
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Giá</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Số lượng</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  min="1"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="tags">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Thẻ gắn (ngăn cách bằng dấu phẩy)
                  </div>
                </Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Ví dụ: mới, bán chạy, giảm giá"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Mô tả sản phẩm</Label>
                <MarkdownEditor
                  value={description}
                  onChange={setDescription}
                  maxLength={2000}
                  placeholder="Nhập mô tả chi tiết về sản phẩm (hỗ trợ Markdown)"
                  thumbnailFile={thumbnailFile}
                  onGenerateDescription={handleGenerateDescription}
                />
              </div>
            </div>

            {/* Dynamic Attribute Fields */}
            <ProductAttributeFields
              category={category}
              attributes={attributes}
              onAttributeChange={handleAttributeChange}
              onArrayAttributeChange={handleArrayAttributeChange}
              onNestedObjectChange={handleNestedObjectChange}
              productCategories={PRODUCT_CATEGORIES}
            />

            {/* Thumbnail Image Upload */}
            <div className="space-y-2">
              <Label>Hình ảnh đại diện</Label>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <FileUpload
                    config={CLOUDINARY_CONFIG}
                    onSelectFiles={handleThumbnailUpload}
                    buttonText="Tải lên hình đại diện"
                    multiple={false}
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                  />
                  {thumbnailPreview && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={handleRemoveThumbnail}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {thumbnailPreview && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-2">
                      Xem trước:
                    </p>
                    <div className="relative inline-block">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Multiple Images Upload */}
            <div className="space-y-2">
              <Label>Hình ảnh sản phẩm (nhiều)</Label>
              <div className="flex flex-col gap-2">
                <FileUpload
                  config={CLOUDINARY_CONFIG}
                  onSelectFiles={handleImagesUpload}
                  buttonText="Tải lên nhiều hình ảnh"
                  multiple={true}
                  isUploading={isUploading}
                  setIsUploading={setIsUploading}
                />

                {imagePreview.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-2">
                      Xem trước:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {imagePreview.map((previewUrl, index) => (
                        <div key={index} className="relative">
                          <img
                            src={previewUrl}
                            alt={`Preview ${index + 1}`}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => handleRemoveImage(index)}
                            type="button"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                className="border cursor-pointer transition-all duration-200 hover:bg-blue-600 active:scale-95"
                disabled={
                  isUploading ||
                  isLoading ||
                  !name ||
                  !price ||
                  !quantity ||
                  !category
                }
              >
                {isUploading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {selectedProduct !== null
                      ? "Đang cập nhật..."
                      : "Đang thêm..."}
                  </>
                ) : (
                  <>
                    {selectedProduct !== null ? (
                      <>
                        <Pencil className="h-4 w-4 mr-2" />
                        Cập nhật
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm
                      </>
                    )}
                  </>
                )}
              </Button>
              {selectedProduct !== null && (
                <Button
                  type="button"
                  variant="outline"
                  className="transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300 active:scale-95"
                  onClick={cancelEdit}
                  disabled={isUploading || isLoading}
                >
                  Hủy
                </Button>
              )}
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductForm;
