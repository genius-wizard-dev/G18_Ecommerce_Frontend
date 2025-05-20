import {
  prepareProductData,
  ProductForm,
  ProductList,
  ProductStatistics,
  validateProductData,
} from "@/components/shop";
import api from "@/lib/axios/api.service";
import { ENDPOINTS } from "@/lib/axios/endpoint";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  resetProductForm,
  setIsUploading,
  setSelectedProduct,
} from "@/redux/slices/shopManagerSlice";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  toggleProductActive,
  updateProduct,
} from "@/redux/thunks/shopManagerThunk";
import "@/styles/markdown.css";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";

const ProductManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    products,
    selectedProduct,
    isLoading,
    isUploading,
    isDeleting,
    inventory,
    dataFetched,
  } = useAppSelector((state) => state.shopManager);
  const { profile } = useAppSelector((state) => state.profile);

  // Lấy danh sách sản phẩm khi profile thay đổi hoặc chưa fetch
  useEffect(() => {
    // Chỉ fetch khi có shopId và chưa fetch data
    if (profile?.shopId && !dataFetched) {
      dispatch(fetchProducts(profile.shopId));
    }
  }, [profile, dispatch, dataFetched]);

  // Fetch inventory cho tất cả sản phẩm khi danh sách sản phẩm thay đổi
  useEffect(() => {
    const fetchAllInventories = async () => {
      try {
        // Chỉ fetch inventory cho những sản phẩm chưa có trong store
        const productsNeedInventory = products.filter(
          (product) => product._id && !inventory[product._id]
        );

        if (productsNeedInventory.length > 0) {
          // Fetch tất cả inventory một lúc
          const inventoryPromises = productsNeedInventory.map((product) => {
            if (product._id) {
              return api
                .get(ENDPOINTS.INVENTORY.GET_BY_PRODUCT_ID(product._id))
                .then((res) => {
                  if (res) {
                    return { productId: product._id, inventory: res };
                  }
                  return null;
                })
                .catch(() => null);
            }
            return null;
          });

          const results = await Promise.all(inventoryPromises);

          // Lưu tất cả inventory vào redux
          results.forEach((result) => {
            if (result && result.productId && result.inventory) {
              dispatch({
                type: "shopManager/fetchInventory/fulfilled",
                payload: result.inventory,
              });
            }
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin kho hàng:", error);
      }
    };

    fetchAllInventories();
  }, [products, dispatch, inventory]);

  // Sử dụng useMemo để tính toán các giá trị thống kê
  const statistics = useMemo(() => {
    // Chỉ đếm sản phẩm đang hoạt động (isActive !== false)
    const activeProducts = products.filter(
      (product) => product.isActive !== false
    );

    return {
      totalProducts: activeProducts.length,
      isLoading,
    };
  }, [products, isLoading]);

  const handleSubmit = async (productData: {
    name: string;
    price: number;
    quantity: number;
    category: string;
    description: string;
    attributes: any;
    tags: string[];
    thumbnailFile: File | null;
    imageFiles: File[];
  }) => {
    try {
      dispatch(setIsUploading(true));

      // Validate dữ liệu
      const isValid = validateProductData(
        productData.name,
        productData.price,
        productData.quantity,
        productData.category,
        productData.thumbnailFile,
        selectedProduct !== null
      );

      if (!isValid) {
        dispatch(setIsUploading(false));
        return;
      }

      if (selectedProduct !== null) {
        // Xử lý cập nhật sản phẩm
        const updatedProduct = prepareProductData(
          productData.name,
          productData.price,
          productData.category,
          productData.description,
          productData.attributes,
          productData.tags,
          profile?.shopId || "",
          productData.thumbnailFile,
          productData.imageFiles
        );

        if (profile?.shopId && selectedProduct._id) {
          // Thực hiện cập nhật sản phẩm và đợi kết quả
          await dispatch(
            updateProduct({
              productId: selectedProduct._id,
              productData: updatedProduct,
              quantity: productData.quantity,
            })
          );
        }
      } else {
        // Tạo sản phẩm mới
        const newProduct = prepareProductData(
          productData.name,
          productData.price,
          productData.category,
          productData.description,
          productData.attributes,
          productData.tags,
          profile?.shopId || "",
          productData.thumbnailFile,
          productData.imageFiles
        );

        // Gửi request API để tạo sản phẩm
        if (profile?.shopId) {
          // Thực hiện tạo sản phẩm và đợi kết quả
          await dispatch(
            createProduct({
              productData: newProduct,
              quantity: productData.quantity,
              shopId: profile.shopId,
            })
          );
          dispatch(resetProductForm());
        }
      }
    } catch (error) {
      console.error("Lỗi khi xử lý form:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      dispatch(setIsUploading(false));
    }
  };

  const handleEdit = async (product: any) => {
    try {
      // Lấy thông tin inventory từ redux nếu có
      const productInventory = product._id ? inventory[product._id] : null;

      // Đảm bảo attribute được xử lý đúng
      const productData = {
        ...product,
        quantity: productInventory?.total_quantity || 0,
        attribute: product.attribute || {},
      };

      console.log("Editing product with attributes:", productData.attribute);
      dispatch(setSelectedProduct(productData));
    } catch (error) {
      console.error("Lỗi khi xử lý edit sản phẩm:", error);
      toast.error("Không thể chỉnh sửa sản phẩm. Vui lòng thử lại sau.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteProduct(id));
      // Không cần fetch lại toàn bộ danh sách sản phẩm vì Redux đã được cập nhật
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await dispatch(toggleProductActive({ productId: id, isActive }));
      // Không cần fetch lại toàn bộ danh sách sản phẩm vì Redux đã được cập nhật
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
      toast.error(
        "Không thể cập nhật trạng thái sản phẩm. Vui lòng thử lại sau."
      );
    }
  };

  return (
    <section id="products" className="space-y-6 relative">
      <h2 className="text-3xl font-bold tracking-tight flex items-center">
        Quản lý sản phẩm
      </h2>

      {/* Product Stats */}
      <ProductStatistics
        totalProducts={statistics.totalProducts}
        isLoading={statistics.isLoading}
      />

      {/* Add/Edit Product Form */}
      <ProductForm
        selectedProduct={selectedProduct}
        isLoading={isLoading}
        isUploading={isUploading}
        onSubmit={handleSubmit}
        onCancel={() => dispatch(resetProductForm())}
        setIsUploading={(uploading) => dispatch(setIsUploading(uploading))}
      />

      {/* Product List */}
      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        isLoading={isLoading}
        isDeleting={isDeleting}
        editId={selectedProduct?._id || null}
        inventoryData={inventory}
      />
    </section>
  );
};

export default ProductManagement;
