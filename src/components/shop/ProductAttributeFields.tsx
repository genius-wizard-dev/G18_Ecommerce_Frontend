import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AttributeRecord,
  ProductCategory,
  getAttributeSchemaForCategory,
} from "@/schema/product";
import { useEffect } from "react";

interface ProductAttributeFieldsProps {
  category: string;
  attributes: AttributeRecord;
  onAttributeChange: (key: string, value: any) => void;
  onArrayAttributeChange: (key: string, value: string) => void;
  onNestedObjectChange: (parent: string, key: string, value: string) => void;
  productCategories: { value: string; label: string }[];
}

const ProductAttributeFields: React.FC<ProductAttributeFieldsProps> = ({
  category,
  attributes,
  onAttributeChange,
  onArrayAttributeChange,
  onNestedObjectChange,
  productCategories,
}) => {
  // Log khi attributes thay đổi để debug
  useEffect(() => {
    if (Object.keys(attributes).length > 0) {
      console.log("Attributes updated in ProductAttributeFields:", attributes);
    }
  }, [attributes]);

  if (!category) return null;

  try {
    const categoryEnum = category as keyof typeof ProductCategory;
    const schema = getAttributeSchemaForCategory(ProductCategory[categoryEnum]);
    if (!schema) return null;

    // Lấy định nghĩa của schema
    const shape = schema._def.shape();
    const attributesRecord = attributes as AttributeRecord;
    const categoryLabel = productCategories.find(
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
                        const nestedArrayValue = nestedValue?.[nestedKey] || [];
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
                                onNestedObjectChange(
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
                    {key.charAt(0).toUpperCase() + key.slice(1)} (ngăn cách bằng
                    dấu phẩy)
                  </Label>
                  <Input
                    id={key}
                    value={displayValue}
                    onChange={(e) =>
                      onArrayAttributeChange(key, e.target.value)
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
                  onChange={(e) => onAttributeChange(key, e.target.value)}
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
};

export default ProductAttributeFields;
