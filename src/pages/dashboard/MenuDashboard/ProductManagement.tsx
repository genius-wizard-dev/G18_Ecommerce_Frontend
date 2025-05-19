import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CLOUDINARY_CONFIG,
  getCloudinaryImageUrl,
} from "@/utils/cloudinary.config";
import CloudinaryUploadWidget from "@/utils/upload.images.tsx";
import {
  CheckCircle,
  Image as ImageIcon,
  Package,
  Pencil,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";

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

// Define Product interface with array of images
interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  thumbnailImage?: string; // Single thumbnail image
  images?: string[]; // Array to support multiple images
  discount?: number;
  category: string; // Thêm trường category
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState<string>("");
  const [images, setImages] = useState<string[]>([]); // Array for multiple images
  const [discount, setDiscount] = useState("");
  const [category, setCategory] = useState<string>(""); // State cho loại sản phẩm
  const [editId, setEditId] = useState<string | null>(null);

  // Load products from localStorage
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem("products");
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
    } catch (error) {
      console.error("Error loading products from localStorage:", error);
    }
  }, []);

  // Save products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("products", JSON.stringify(products));
    } catch (error) {
      console.error("Error saving products to localStorage:", error);
      alert("Lưu trữ sản phẩm thất bại do giới hạn bộ nhớ.");
    }
  }, [products]);

  // Xử lý thumbnail image từ Cloudinary
  const handleThumbnailUpload = (publicIds: string[]) => {
    if (publicIds.length > 0) {
      setThumbnailImage(publicIds[0]);
    }
  };

  // Xử lý multiple images từ Cloudinary
  const handleImagesUpload = (publicIds: string[]) => {
    setImages(publicIds);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = Number(price);
    const parsedQuantity = Number(quantity);
    const parsedDiscount = discount ? Number(discount) : undefined;

    // Validation
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      alert("Giá phải là một số không âm.");
      return;
    }
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      alert("Số lượng phải là một số không âm.");
      return;
    }
    if (!name.trim()) {
      alert("Tên sản phẩm không được để trống.");
      return;
    }
    if (!category) {
      alert("Vui lòng chọn loại sản phẩm.");
      return;
    }
    if (
      parsedDiscount !== undefined &&
      (parsedDiscount < 0 || parsedDiscount > 100)
    ) {
      alert("Giảm giá phải từ 0 đến 100%.");
      return;
    }

    if (editId !== null) {
      setProducts(
        products.map((product) =>
          product.id === editId
            ? {
                ...product,
                name,
                price: parsedPrice,
                quantity: parsedQuantity,
                thumbnailImage: thumbnailImage || product.thumbnailImage,
                images: images.length > 0 ? images : product.images,
                discount: parsedDiscount,
                category,
              }
            : product
        )
      );
      setEditId(null);
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name,
        price: parsedPrice,
        quantity: parsedQuantity,
        thumbnailImage: thumbnailImage || undefined,
        images: images.length > 0 ? images : undefined,
        discount: parsedDiscount,
        category,
      };
      setProducts([...products, newProduct]);
    }
    // Reset form
    setName("");
    setPrice("");
    setQuantity("");
    setThumbnailImage("");
    setImages([]);
    setDiscount("");
    setCategory("");
  };

  const handleEdit = (product: Product) => {
    setName(product.name);
    setPrice(product.price.toString());
    setQuantity(product.quantity.toString());
    setThumbnailImage(product.thumbnailImage || "");
    setImages(product.images || []);
    setDiscount(product.discount?.toString() || "");
    setCategory(product.category || "");
    setEditId(product.id);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  // Hàm lấy URL hình ảnh Cloudinary
  const getImageUrl = (publicId: string) => {
    return getCloudinaryImageUrl(CLOUDINARY_CONFIG.cloudName, publicId);
  };

  // Statistics
  const totalProducts = products.length;
  const inStock = products.filter((p) => p.quantity > 0).length;
  const outOfStock = products.filter((p) => p.quantity === 0).length;

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
              {totalProducts.toLocaleString()}
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
            <div className="text-2xl font-bold">{inStock.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
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
        </Card>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại sản phẩm" />
                  </SelectTrigger>
                  <SelectContent>
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
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Giảm giá (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Thumbnail Image Upload */}
            <div className="space-y-2">
              <Label>Hình ảnh đại diện</Label>
              <div className="flex flex-col gap-2">
                <CloudinaryUploadWidget
                  uwConfig={CLOUDINARY_CONFIG}
                  setPublicIds={handleThumbnailUpload}
                  buttonText="Tải lên hình đại diện"
                  multiple={false}
                />

                {thumbnailImage && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-2">
                      Xem trước:
                    </p>
                    <img
                      src={getImageUrl(thumbnailImage)}
                      alt="Thumbnail"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Multiple Images Upload */}
            <div className="space-y-2">
              <Label>Hình ảnh sản phẩm (nhiều)</Label>
              <div className="flex flex-col gap-2">
                <CloudinaryUploadWidget
                  uwConfig={CLOUDINARY_CONFIG}
                  setPublicIds={handleImagesUpload}
                  buttonText="Tải lên nhiều hình ảnh"
                  multiple={true}
                />

                {images.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-2">
                      Xem trước:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {images.map((img, index) => (
                        <img
                          key={index}
                          src={getImageUrl(img)}
                          alt={`Preview ${index + 1}`}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="border cursor-pointer">
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
                    setThumbnailImage("");
                    setImages([]);
                    setDiscount("");
                    setCategory("");
                  }}
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
          <ScrollArea className="h-fit">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <ImageIcon className="h-8 w-8 mb-2" />
                <p>Chưa có sản phẩm nào.</p>
              </div>
            ) : (
              <div className="space-y-4 pr-4">
                {products.map((product) => (
                  <div
                    key={product.id}
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
                            {product.price.toLocaleString()}₫ •{" "}
                            {product.quantity} sản phẩm
                          </p>
                          <p>
                            {product.discount
                              ? `Giảm ${product.discount}% • `
                              : ""}
                            {PRODUCT_CATEGORIES.find(
                              (cat) => cat.value === product.category
                            )?.label || product.category}
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
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </section>
  );
};

export default ProductManagement;
