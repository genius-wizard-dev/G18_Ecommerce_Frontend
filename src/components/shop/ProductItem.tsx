import { Button } from "@/components/ui/button";
import { Inventory } from "@/schema/inventory";
import { ProductInput } from "@/schema/product";
import { getImageUrl } from "@/utils/getImage";
import { EyeOff, ImageIcon, Pencil, Trash } from "lucide-react";

interface ProductItemProps {
  product: ProductInput;
  onEdit: (product: ProductInput) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  isLoading: boolean;
  isDeleting: string | null;
  editId: string | null;
  showActiveButton: boolean;
  inventory: Inventory | null;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  onEdit,
  onDelete,
  onToggleActive,
  isLoading,
  isDeleting,
  editId,
  showActiveButton,
  inventory,
}) => {
  // Hiển thị placeholder loading khi đang tải dữ liệu
  if (isLoading && editId === product._id) {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
          <div>
            <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Hiển thị sản phẩm khi đã tải xong dữ liệu
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
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
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{product.name}</h4>
            {product.isActive === false && (
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full flex items-center">
                <EyeOff className="h-3 w-3 mr-1" />
                Ngưng bán
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            <p>
              {product.price.toLocaleString()}₫
              {product.tags && product.tags.length > 0 && (
                <span className="ml-2">• {product.tags.join(", ")}</span>
              )}
            </p>
            <p className="mt-1">
              Số lượng:{" "}
              {inventory ? (
                <span
                  className={
                    inventory.total_quantity > 0
                      ? "text-green-600 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {inventory.total_quantity}
                </span>
              ) : (
                <span className="text-yellow-600 font-medium">0</span>
              )}
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(product)}
          disabled={isLoading || isDeleting !== null}
          className="transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 active:scale-95"
        >
          {isLoading && editId === product._id ? (
            <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Pencil className="h-4 w-4" />
          )}
        </Button>

        {/* Nút xóa sản phẩm */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onDelete(product._id || "")}
          disabled={isLoading || isDeleting !== null}
          className="transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300 active:scale-95"
          title="Xóa sản phẩm"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductItem;
