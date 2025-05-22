import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Inventory } from "@/schema/inventory";
import { ProductInput } from "@/schema/product";
import { ImageIcon } from "lucide-react";
import ProductItem from "./ProductItem";

interface ProductListProps {
  products: ProductInput[];
  onEdit: (product: ProductInput) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  isLoading: boolean;
  isDeleting: string | null;
  editId: string | null;
  inventoryData: Record<string, Inventory>;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onEdit,
  onDelete,
  isLoading,
  isDeleting,
  editId,
  inventoryData,
}) => {


  // Lọc sản phẩm theo trạng thái active
  const activeProducts = products.filter(
    (product) => product.isActive !== false
  );


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">Danh sách sản phẩm</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-fit max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-32">
              <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-sm text-muted-foreground">
                Đang tải danh sách sản phẩm...
              </p>
            </div>
          ) : activeProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <ImageIcon className="h-8 w-8 mb-2" />
              <p>Chưa có sản phẩm đang bán nào.</p>
            </div>
          ) : (
            <div className="space-y-4 pr-4">
              {activeProducts.map((product) => (
                <ProductItem
                  key={product._id}
                  product={product}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isLoading={isLoading}
                  isDeleting={isDeleting}
                  editId={editId}
                  inventory={product._id ? inventoryData[product._id] : null}
                />
              ))}
            </div>
          )}
        </ScrollArea>
        {/* Phần tabs đã bị comment lại - có thể bổ sung sau nếu cần */}
      </CardContent>
    </Card>
  );
};

export default ProductList;
