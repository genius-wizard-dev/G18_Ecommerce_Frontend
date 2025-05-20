import { z } from "zod";

// Định nghĩa enum cho các danh mục sản phẩm
export enum ProductCategory {
  Clothes = "Clothes",
  Mobile = "Mobile",
  Electronics = "Electronics",
  Computer = "Computer",
  Camera = "Camera",
  Watch = "Watch",
  Beauty = "Beauty",
  Health = "Health",
  Grocery = "Grocery",
  Toy = "Toy",
  MenShoes = "MenShoes",
  WomenShoes = "WomenShoes",
  WomenBags = "WomenBags",
  FashionAccessories = "FashionAccessories",
  BooksStationery = "BooksStationery",
  MenBags = "MenBags",
  Pet = "Pet",
  ToolsHomeImprovement = "ToolsHomeImprovement",
  MomsKidsBabies = "MomsKidsBabies",
  HomeLiving = "HomeLiving",
  SportOutdoor = "SportOutdoor",
  KidFashion = "KidFashion",
  HomeCare = "HomeCare",
}

// Schema cho ratings
export const RatingsSchema = z.object({
  average: z.number(),
  count: z.number(),
});

export type Ratings = z.infer<typeof RatingsSchema>;

// Các schema cho từng loại sản phẩm
export const ClothesAttributeSchema = z.object({
  brand: z.string(),
  material: z.string(),
  size: z.array(z.string()),
  color: z.array(z.string()),
  pattern: z.array(z.string()),
});

export const MobileAttributeSchema = z.object({
  brand: z.string(),
  screenSize: z.string(),
  ram: z.array(z.string()),
  storage: z.array(z.string()),
  operatingSystem: z.string(),
  battery: z.string(),
  camera: z.object({
    rear: z.array(z.string()),
    front: z.array(z.string()),
  }),
  color: z.array(z.string()),
});

export const ElectronicsAttributeSchema = z.object({
  brand: z.string(),
  powerConsumption: z.string(),
  dimensions: z.string(),
  connectivity: z.array(z.string()),
  warranty: z.string(),
});

export const ComputerAttributeSchema = z.object({
  brand: z.string(),
  processor: z.string(),
  ram: z.array(z.string()),
  storageType: z.string(),
  operatingSystem: z.array(z.string()),
});

export const CameraAttributeSchema = z.object({
  brand: z.string(),
  resolution: z.string(),
  lensType: z.array(z.string()),
  sensorType: z.string(),
  videoResolution: z.array(z.string()),
});

export const WatchAttributeSchema = z.object({
  brand: z.string(),
  watchType: z.string(),
  strapMaterial: z.string(),
  waterResistance: z.string(),
  features: z.array(z.string()),
});

export const BeautyAttributeSchema = z.object({
  brand: z.string(),
  type: z.string(),
  shade: z.array(z.string()),
  skinType: z.array(z.string()),
  expirationDate: z.string(),
});

export const HealthAttributeSchema = z.object({
  brand: z.string(),
  category: z.string(),
  dosage: z.string(),
  ingredients: z.array(z.string()),
  expirationDate: z.string(),
});

export const GroceryAttributeSchema = z.object({
  brand: z.string(),
  category: z.string(),
  weight: z.string(),
  nutritionalInfo: z.string(),
  expirationDate: z.string(),
});

export const ToyAttributeSchema = z.object({
  brand: z.string(),
  ageRange: z.string(),
  material: z.string(),
  safetyFeatures: z.array(z.string()),
  type: z.string(),
});

export const MenShoesAttributeSchema = z.object({
  brand: z.string(),
  material: z.string(),
  size: z.array(z.string()),
  color: z.array(z.string()),
  shoeType: z.string(),
});

export const WomenShoesAttributeSchema = z.object({
  brand: z.string(),
  material: z.string(),
  size: z.array(z.string()),
  color: z.array(z.string()),
  heelHeight: z.string(),
});

export const WomenBagsAttributeSchema = z.object({
  brand: z.string(),
  material: z.string(),
  size: z.string(),
  color: z.array(z.string()),
  bagType: z.string(),
});

export const FashionAccessoriesAttributeSchema = z.object({
  brand: z.string(),
  material: z.string(),
  accessoryType: z.string(),
  color: z.array(z.string()),
  size: z.string(),
});

export const BooksStationeryAttributeSchema = z.object({
  brand: z.string(),
  category: z.string(),
  genre: z.string(),
  author: z.string(),
});

export const MenBagsAttributeSchema = z.object({
  brand: z.string(),
  material: z.string(),
  size: z.string(),
  color: z.array(z.string()),
  bagType: z.string(),
});

export const PetAttributeSchema = z.object({
  brand: z.string(),
  petType: z.string(),
  productType: z.string(),
  weight: z.string(),
  suitableFor: z.array(z.string()),
});

export const ToolsHomeImprovementAttributeSchema = z.object({
  brand: z.string(),
  toolType: z.string(),
  material: z.string(),
  powerSource: z.string(),
  usage: z.array(z.string()),
});

export const MomsKidsBabiesAttributeSchema = z.object({
  brand: z.string(),
  productType: z.string(),
  ageRange: z.string(),
  material: z.string(),
  safetyFeatures: z.array(z.string()),
});

export const HomeLivingAttributeSchema = z.object({
  brand: z.string(),
  productType: z.string(),
  material: z.string(),
  dimensions: z.string(),
  color: z.array(z.string()),
});

export const SportOutdoorAttributeSchema = z.object({
  brand: z.string(),
  activityType: z.string(),
  material: z.string(),
  size: z.string(),
  features: z.array(z.string()),
});

export const KidFashionAttributeSchema = z.object({
  brand: z.string(),
  material: z.string(),
  size: z.array(z.string()),
  color: z.array(z.string()),
  ageRange: z.string(),
});

export const HomeCareAttributeSchema = z.object({
  brand: z.string(),
  productType: z.string(),
  volume: z.string(),
  fragrance: z.string(),
  usage: z.array(z.string()),
});

// Tạo các type từ schema
export type ClothesAttribute = z.infer<typeof ClothesAttributeSchema>;
export type MobileAttribute = z.infer<typeof MobileAttributeSchema>;
export type ElectronicsAttribute = z.infer<typeof ElectronicsAttributeSchema>;
export type ComputerAttribute = z.infer<typeof ComputerAttributeSchema>;
export type CameraAttribute = z.infer<typeof CameraAttributeSchema>;
export type WatchAttribute = z.infer<typeof WatchAttributeSchema>;
export type BeautyAttribute = z.infer<typeof BeautyAttributeSchema>;
export type HealthAttribute = z.infer<typeof HealthAttributeSchema>;
export type GroceryAttribute = z.infer<typeof GroceryAttributeSchema>;
export type ToyAttribute = z.infer<typeof ToyAttributeSchema>;
export type MenShoesAttribute = z.infer<typeof MenShoesAttributeSchema>;
export type WomenShoesAttribute = z.infer<typeof WomenShoesAttributeSchema>;
export type WomenBagsAttribute = z.infer<typeof WomenBagsAttributeSchema>;
export type FashionAccessoriesAttribute = z.infer<
  typeof FashionAccessoriesAttributeSchema
>;
export type BooksStationeryAttribute = z.infer<
  typeof BooksStationeryAttributeSchema
>;
export type MenBagsAttribute = z.infer<typeof MenBagsAttributeSchema>;
export type PetAttribute = z.infer<typeof PetAttributeSchema>;
export type ToolsHomeImprovementAttribute = z.infer<
  typeof ToolsHomeImprovementAttributeSchema
>;
export type MomsKidsBabiesAttribute = z.infer<
  typeof MomsKidsBabiesAttributeSchema
>;
export type HomeLivingAttribute = z.infer<typeof HomeLivingAttributeSchema>;
export type SportOutdoorAttribute = z.infer<typeof SportOutdoorAttributeSchema>;
export type KidFashionAttribute = z.infer<typeof KidFashionAttributeSchema>;
export type HomeCareAttribute = z.infer<typeof HomeCareAttributeSchema>;

// Map category to attribute schema
export const CategoryAttributeSchemaMap = {
  [ProductCategory.Clothes]: ClothesAttributeSchema,
  [ProductCategory.Mobile]: MobileAttributeSchema,
  [ProductCategory.Electronics]: ElectronicsAttributeSchema,
  [ProductCategory.Computer]: ComputerAttributeSchema,
  [ProductCategory.Camera]: CameraAttributeSchema,
  [ProductCategory.Watch]: WatchAttributeSchema,
  [ProductCategory.Beauty]: BeautyAttributeSchema,
  [ProductCategory.Health]: HealthAttributeSchema,
  [ProductCategory.Grocery]: GroceryAttributeSchema,
  [ProductCategory.Toy]: ToyAttributeSchema,
  [ProductCategory.MenShoes]: MenShoesAttributeSchema,
  [ProductCategory.WomenShoes]: WomenShoesAttributeSchema,
  [ProductCategory.WomenBags]: WomenBagsAttributeSchema,
  [ProductCategory.FashionAccessories]: FashionAccessoriesAttributeSchema,
  [ProductCategory.BooksStationery]: BooksStationeryAttributeSchema,
  [ProductCategory.MenBags]: MenBagsAttributeSchema,
  [ProductCategory.Pet]: PetAttributeSchema,
  [ProductCategory.ToolsHomeImprovement]: ToolsHomeImprovementAttributeSchema,
  [ProductCategory.MomsKidsBabies]: MomsKidsBabiesAttributeSchema,
  [ProductCategory.HomeLiving]: HomeLivingAttributeSchema,
  [ProductCategory.SportOutdoor]: SportOutdoorAttributeSchema,
  [ProductCategory.KidFashion]: KidFashionAttributeSchema,
  [ProductCategory.HomeCare]: HomeCareAttributeSchema,
} as const;

// Thêm interface mới để hỗ trợ truy cập thuộc tính động
export interface AttributeRecord {
  [key: string]: string | string[] | { [key: string]: string[] };
}

// Union type cho tất cả các attribute
export type ProductAttribute =
  | ClothesAttribute
  | MobileAttribute
  | ElectronicsAttribute
  | ComputerAttribute
  | CameraAttribute
  | WatchAttribute
  | BeautyAttribute
  | HealthAttribute
  | GroceryAttribute
  | ToyAttribute
  | MenShoesAttribute
  | WomenShoesAttribute
  | WomenBagsAttribute
  | FashionAccessoriesAttribute
  | BooksStationeryAttribute
  | MenBagsAttribute
  | PetAttribute
  | ToolsHomeImprovementAttribute
  | MomsKidsBabiesAttribute
  | HomeLivingAttribute
  | SportOutdoorAttribute
  | KidFashionAttribute
  | HomeCareAttribute
  | AttributeRecord;

// Schema chung cho sản phẩm
export const ProductDataSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  shopId: z.string(),
  description: z.string(),
  price: z.number().positive("Giá sản phẩm phải là số dương"),
  category: z.nativeEnum(ProductCategory),
  attribute: z.union([
    ClothesAttributeSchema,
    MobileAttributeSchema,
    ElectronicsAttributeSchema,
    ComputerAttributeSchema,
    CameraAttributeSchema,
    WatchAttributeSchema,
    BeautyAttributeSchema,
    HealthAttributeSchema,
    GroceryAttributeSchema,
    ToyAttributeSchema,
    MenShoesAttributeSchema,
    WomenShoesAttributeSchema,
    WomenBagsAttributeSchema,
    FashionAccessoriesAttributeSchema,
    BooksStationeryAttributeSchema,
    MenBagsAttributeSchema,
    PetAttributeSchema,
    ToolsHomeImprovementAttributeSchema,
    MomsKidsBabiesAttributeSchema,
    HomeLivingAttributeSchema,
    SportOutdoorAttributeSchema,
    KidFashionAttributeSchema,
    HomeCareAttributeSchema,
  ]),
  images: z.array(z.string().url("URL hình ảnh không hợp lệ")),
  thumbnailImage: z.string().url("URL hình ảnh đại diện không hợp lệ"),
  ratings: RatingsSchema.optional(),
  isActive: z.boolean().default(true),
  tags: z.array(z.string()),
});

// Schema cho dữ liệu danh sách sản phẩm
export const ProductListDataSchema = z.object({
  products: z.array(ProductDataSchema),
  total: z.number().nonnegative(),
  page: z.number().positive(),
  pages: z.number().nonnegative(),
});

// Schema cho response của API
export const BaseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// Schema cho response của API danh sách sản phẩm
export const ProductListResponseSchema = BaseResponseSchema.extend({
  data: ProductListDataSchema,
});

// Schema cho response của API chi tiết sản phẩm
export const ProductResponseSchema = BaseResponseSchema.extend({
  data: ProductDataSchema,
});

// Các type export
export type ProductResponse = z.infer<typeof ProductResponseSchema>;
export type ProductInput = z.infer<typeof ProductDataSchema>;
export type ProductListResponse = z.infer<typeof ProductListResponseSchema>;
// Helper function để lấy schema attribute dựa trên category
export const getAttributeSchemaForCategory = (category: ProductCategory) => {
  return CategoryAttributeSchemaMap[category];
};
