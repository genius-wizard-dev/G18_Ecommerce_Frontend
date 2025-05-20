import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MarkdownEditor from "@/components/ui/markdown-editor";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios/api.service";
import { ENDPOINTS } from "@/lib/axios/endpoint";
import { useAppSelector } from "@/redux/hooks";
import { Inventory } from "@/schema/inventory";
import {
  AttributeRecord,
  ProductCategory,
  ProductInput,
  ProductResponse,
  getAttributeSchemaForCategory,
} from "@/schema/product";
import "@/styles/markdown.css";
import {
  CLOUDINARY_CONFIG,
  uploadMultipleToCloudinary,
  uploadToCloudinary,
} from "@/utils/cloudinary.config";
import { getImageUrl } from "@/utils/getImage";
import FileUpload from "@/utils/upload.images.tsx";
import {
  CheckCircle,
  Image as ImageIcon,
  Package,
  Pencil,
  Plus,
  Tag,
  Trash2,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// Danh sách loại sản phẩm
const PRODUCT_CATEGORIES = [
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

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<ProductInput[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [tags, setTags] = useState<string>("");

  // States cho form
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [attributes, setAttributes] = useState<AttributeRecord>({});

  // States cho hình ảnh
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  const { profile } = useAppSelector((state) => state.profile);

  // Lấy danh sách sản phẩm khi profile thay đổi
  useEffect(() => {
    if (profile?.shopId) {
      fetchProducts(profile.shopId);
    }
  }, [profile]);

  // Reset thuộc tính khi thay đổi danh mục
  useEffect(() => {
    setAttributes({});
  }, [category]);

  // Fetch sản phẩm
  const fetchProducts = async (shopId: string) => {
    try {
      const response = await api.get(ENDPOINTS.PRODUCT.GET_BY_SHOP(shopId));
      const { success, data } = response as {
        success: boolean;
        data: { products: ProductInput[] };
      };

      if (success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      toast.error("Không thể lấy danh sách sản phẩm");
    }
  };

  // Xử lý thumbnail image để preview
  const handleThumbnailUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Xử lý multiple images để preview
  const handleImagesUpload = (files: File[]) => {
    setImageFiles((prevFiles) => [...prevFiles, ...files]);
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreview((prevUrls) => [...prevUrls, ...newPreviewUrls]);
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

  // Sử dụng useMemo để tính toán các giá trị thống kê
  const statistics = useMemo(() => {
    return {
      totalProducts: products.length,
    };
  }, [products]);

  // Memoize hàm renderAttributeFields để tránh tính toán lại khi re-render
  const attributeFields = useMemo(() => {
    if (!category) return null;

    try {
      const categoryEnum = category as keyof typeof ProductCategory;
      const schema = getAttributeSchemaForCategory(
        ProductCategory[categoryEnum]
      );
      if (!schema) return null;

      // Lấy định nghĩa của schema
      const shape = schema._def.shape();
      const attributesRecord = attributes as AttributeRecord;
      const categoryLabel = PRODUCT_CATEGORIES.find(
        (cat) => cat.value === category
      )?.label;

      return (
        <div className="mt-4 border-t pt-4">
          <h3 className="font-medium mb-3">
            Thuộc tính sản phẩm {categoryLabel}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(shape).map(([key, fieldSchema]) => {
              const fieldType = (fieldSchema as any)._def.typeName;

              // Xử lý trường hợp đối tượng lồng nhau
              if (fieldType === "ZodObject") {
                const nestedShape = (fieldSchema as any)._def.shape();
                return (
                  <div key={key} className="space-y-2 md:col-span-2">
                    <Label htmlFor={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Label>
                    {Object.entries(nestedShape).map(
                      ([nestedKey, nestedFieldSchema]) => {
                        const nestedFieldType = (nestedFieldSchema as any)._def
                          .typeName;
                        if (nestedFieldType === "ZodArray") {
                          const nestedValue = attributesRecord[key] as
                            | Record<string, string[]>
                            | undefined;
                          const nestedArrayValue =
                            nestedValue?.[nestedKey] || [];
                          const displayValue = Array.isArray(nestedArrayValue)
                            ? nestedArrayValue.join(", ")
                            : "";

                          return (
                            <div
                              key={`${key}-${nestedKey}`}
                              className="ml-4 space-y-2"
                            >
                              <Label htmlFor={`${key}-${nestedKey}`}>
                                {nestedKey.charAt(0).toUpperCase() +
                                  nestedKey.slice(1)}{" "}
                                (ngăn cách bằng dấu phẩy)
                              </Label>
                              <Input
                                id={`${key}-${nestedKey}`}
                                value={displayValue}
                                onChange={(e) =>
                                  handleNestedObjectChange(
                                    key,
                                    nestedKey,
                                    e.target.value
                                  )
                                }
                                placeholder={`Nhập ${nestedKey} (vd: giá trị 1, giá trị 2)`}
                              />
                            </div>
                          );
                        }
                        return null;
                      }
                    )}
                  </div>
                );
              }

              // Xử lý trường dạng mảng
              if (fieldType === "ZodArray") {
                const arrayValue = attributesRecord[key];
                const displayValue = Array.isArray(arrayValue)
                  ? arrayValue.join(", ")
                  : "";

                return (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)} (ngăn cách
                      bằng dấu phẩy)
                    </Label>
                    <Input
                      id={key}
                      value={displayValue}
                      onChange={(e) =>
                        handleArrayAttributeChange(key, e.target.value)
                      }
                      placeholder={`Nhập ${key} (vd: giá trị 1, giá trị 2)`}
                    />
                  </div>
                );
              }

              // Xử lý trường thông thường
              return (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Label>
                  <Input
                    id={key}
                    value={(attributesRecord[key] as string) || ""}
                    onChange={(e) => handleAttributeChange(key, e.target.value)}
                    placeholder={`Nhập ${key}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error rendering attribute fields:", error);
      return <div className="text-red-500">Lỗi hiển thị thuộc tính</div>;
    }
  }, [category, attributes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsUploading(true);

      const parsedPrice = Number(price);
      const parsedQuantity = Number(quantity);
      const productTags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      // Validation
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        toast.error("Giá phải là một số không âm.");
        return;
      }
      if (isNaN(parsedQuantity) || parsedQuantity < 0) {
        toast.error("Số lượng phải là một số không âm.");
        return;
      }
      if (!name.trim()) {
        toast.error("Tên sản phẩm không được để trống.");
        return;
      }
      if (!category) {
        toast.error("Vui lòng chọn loại sản phẩm.");
        return;
      }

      // Khi thêm mới sản phẩm phải có hình đại diện
      if (editId === null && !thumbnailFile) {
        toast.error("Vui lòng chọn hình ảnh đại diện.");
        return;
      }

      // Upload thumbnail image to Cloudinary
      let thumbnailPublicId = "";
      if (thumbnailFile) {
        thumbnailPublicId = await uploadToCloudinary(
          thumbnailFile,
          CLOUDINARY_CONFIG
        );
      }

      // Upload multiple images to Cloudinary
      let imagePublicIds: string[] = [];
      if (imageFiles.length > 0) {
        imagePublicIds = await uploadMultipleToCloudinary(
          imageFiles,
          CLOUDINARY_CONFIG
        );
      }

      if (editId !== null) {
        // // Handle edit logic
        // // ... existing edit logic ...
        setEditId(null);
      } else {
        // Lấy schema dành cho category này để đảm bảo đúng định dạng
        const categoryEnum = category as keyof typeof ProductCategory;
        const attributeSchema = getAttributeSchemaForCategory(
          ProductCategory[categoryEnum]
        );

        // Tạo attribute cơ bản với các trường bắt buộc
        let productAttribute: any;

        // Validate attribute nếu cần
        if (attributeSchema) {
          try {
            // Kiểm tra xem attribute có đúng định dạng không
            productAttribute = attributeSchema.parse(attributes);
          } catch (error) {
            console.error("Lỗi khi xác thực thuộc tính:", error);
            // Nếu có lỗi, tạo một object trống
            productAttribute = attributeSchema.parse({});
          }
        } else {
          // Fallback nếu không tìm thấy schema
          productAttribute = {};
        }

        const newProduct: ProductInput = {
          name,
          price: parsedPrice,
          thumbnailImage: thumbnailPublicId,
          images: imagePublicIds,
          category: ProductCategory[categoryEnum],
          description: description || "",
          // @ts-ignore - Giả sử đã được validate bởi schema
          attribute: productAttribute,
          shopId: profile?.shopId || "",
          isActive: true,
          tags: productTags,
        };

        // Gửi request API để tạo sản phẩm
        if (profile?.shopId) {
          try {
            const response = await api.post<ProductResponse>(
              ENDPOINTS.PRODUCT.CREATE,
              newProduct
            );

            if (response.success === true && response.data._id) {
              const inventoryData: Inventory = {
                product_id: response.data._id,
                product_name: newProduct.name || "",
                shop_id: profile.shopId,
                total_quantity: parsedQuantity || 0,
              };

              await api.post(ENDPOINTS.INVENTORY.CREATE, inventoryData);
              setProducts((prevProducts) => [...prevProducts, response.data]);

              toast.success("Sản phẩm đã được tạo thành công");
            }
          } catch (error) {
            console.error("Lỗi khi tạo sản phẩm:", error);
            toast.error("Không thể tạo sản phẩm. Vui lòng thử lại sau.");
          }
        }
      }

      // Reset form
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
    } catch (error) {
      console.error("Lỗi khi xử lý form:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = async (product: ProductInput) => {
    try {
      setName(product.name);
      setPrice(product.price.toString());
      setQuantity("0"); // Sử dụng giá trị mặc định 0 nếu lấy inventory thất bại

      // Lấy giá trị category từ enum và chuyển về string
      const categoryString =
        Object.keys(ProductCategory).find(
          (key) =>
            ProductCategory[key as keyof typeof ProductCategory] ===
            product.category
        ) || "";
      setCategory(categoryString);

      // Đặt lại description và tags
      setDescription(product.description || "");
      setTags(product.tags ? product.tags.join(", ") : "");

      // Thiết lập đầy đủ thuộc tính attribute
      if (product.attribute) {
        console.log("Thuộc tính sản phẩm:", product.attribute);
        setAttributes(product.attribute as AttributeRecord);

        // Xử lý hiển thị cho giao diện người dùng
        setTimeout(() => {
          for (const key in product.attribute) {
            const attributeValue =
              product.attribute[key as keyof typeof product.attribute];

            // Xử lý trường hợp đối tượng lồng nhau (nested object)
            if (
              typeof attributeValue === "object" &&
              !Array.isArray(attributeValue) &&
              attributeValue !== null
            ) {
              // Xử lý các thuộc tính con trong đối tượng lồng nhau
              for (const nestedKey in attributeValue as Record<
                string,
                unknown
              >) {
                const nestedValue = (attributeValue as Record<string, unknown>)[
                  nestedKey
                ];
                if (Array.isArray(nestedValue)) {
                  // Cập nhật UI cho nested object
                  const inputElement = document.getElementById(
                    `${key}-${nestedKey}`
                  ) as HTMLInputElement;
                  if (inputElement) {
                    inputElement.value = nestedValue.join(", ");
                  }
                  // Vẫn gọi hàm để đảm bảo state được cập nhật
                  handleNestedObjectChange(
                    key,
                    nestedKey,
                    nestedValue.join(", ")
                  );
                }
              }
            }
            // Xử lý trường hợp mảng
            else if (Array.isArray(attributeValue)) {
              // Cập nhật UI cho mảng
              const inputElement = document.getElementById(
                key
              ) as HTMLInputElement;
              if (inputElement) {
                inputElement.value = attributeValue.join(", ");
              }
              handleArrayAttributeChange(key, attributeValue.join(", "));
            }
            // Xử lý trường hợp giá trị đơn giản
            else {
              // Cập nhật UI cho giá trị đơn giản
              const inputElement = document.getElementById(
                key
              ) as HTMLInputElement;
              if (inputElement) {
                inputElement.value = attributeValue as string;
              }
              handleAttributeChange(key, attributeValue);
            }
          }
        }, 100);
      }

      // Cập nhật các preview nếu có
      if (product.thumbnailImage) {
        setThumbnailPreview(getImageUrl(product.thumbnailImage));
      }

      if (product.images && product.images.length > 0) {
        setImagePreview(product.images.map((img) => getImageUrl(img)));
      }

      setEditId(product._id || "");
    } catch (error) {
      console.error("Lỗi khi xử lý edit sản phẩm:", error);
      toast.error("Không thể chỉnh sửa sản phẩm. Vui lòng thử lại sau.");
    }
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter((product) => product._id !== id));
  };

  // Hàm lấy URL hình ảnh Cloudinary

  // Hiển thị từng sản phẩm trong danh sách
  const renderProductItem = (product: ProductInput) => (
    <div
      key={product._id}
      className="flex items-center justify-between p-4 border rounded-lg"
    >
      <div className="flex items-center gap-4">
        {product.thumbnailImage ? (
          <img
            src={getImageUrl(product.thumbnailImage)}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
        ) : (
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <div>
          <h4 className="font-medium">{product.name}</h4>
          <div className="text-sm text-muted-foreground">
            <p>
              {product.price.toLocaleString()}₫
              {product.tags && product.tags.length > 0 && (
                <span className="ml-2">• {product.tags.join(", ")}</span>
              )}
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleEdit(product)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleDelete(product._id || "")}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <section id="products" className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h2>

      {/* Product Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng số sản phẩm
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics.totalProducts.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sản phẩm còn hàng
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sản phẩm hết hàng
            </CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {outOfStock.toLocaleString()}
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Add/Edit Product Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editId !== null ? "Sửa sản phẩm" : "Thêm sản phẩm"}
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-white">
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
                />
              </div>
            </div>

            {/* Dynamic Attribute Fields */}
            {attributeFields}

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
                className="border cursor-pointer"
                disabled={
                  isUploading ||
                  !name ||
                  !price ||
                  !quantity ||
                  !category ||
                  !thumbnailFile
                }
              >
                {editId !== null ? (
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
              </Button>
              {editId !== null && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditId(null);
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
                  }}
                  disabled={isUploading}
                >
                  Hủy
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Product List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-fit max-h-[400px] overflow-y-auto">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <ImageIcon className="h-8 w-8 mb-2" />
                <p>Chưa có sản phẩm nào.</p>
              </div>
            ) : (
              <div className="space-y-4 pr-4">
                {products.map((product) => renderProductItem(product))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </section>
  );
};

export default ProductManagement;
