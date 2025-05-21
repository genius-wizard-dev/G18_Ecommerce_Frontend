/**
 * Bảng ánh xạ các thuộc tính sản phẩm từ tiếng Anh sang tiếng Việt
 */

// Ánh xạ chung cho tất cả các loại sản phẩm
export const commonAttributeTranslations: Record<string, string> = {
  // Thuộc tính chung
  brand: "Thương hiệu",
  material: "Chất liệu",
  size: "Kích thước",
  color: "Màu sắc",
  weight: "Trọng lượng",
  dimensions: "Kích thước",
  warranty: "Bảo hành",
  type: "Loại",
  category: "Danh mục",
};

// Ánh xạ cho từng loại sản phẩm cụ thể
export const categoryAttributeTranslations: Record<
  string,
  Record<string, string>
> = {
  // Quần áo
  Clothes: {
    pattern: "Họa tiết",
  },

  // Điện thoại di động
  Mobile: {
    screenSize: "Kích thước màn hình",
    ram: "RAM",
    storage: "Bộ nhớ trong",
    operatingSystem: "Hệ điều hành",
    battery: "Pin",
    camera: "Camera",
    rear: "Camera sau",
    front: "Camera trước",
  },

  // Thiết bị điện tử
  Electronics: {
    powerConsumption: "Công suất tiêu thụ",
    connectivity: "Kết nối",
  },

  // Máy tính
  Computer: {
    processor: "Bộ xử lý",
    storageType: "Loại ổ cứng",
  },

  // Máy ảnh
  Camera: {
    resolution: "Độ phân giải",
    lensType: "Loại ống kính",
    sensorType: "Loại cảm biến",
    videoResolution: "Độ phân giải video",
  },

  // Đồng hồ
  Watch: {
    watchType: "Loại đồng hồ",
    strapMaterial: "Chất liệu dây",
    waterResistance: "Khả năng chống nước",
    features: "Tính năng",
  },

  // Mỹ phẩm
  Beauty: {
    shade: "Tông màu",
    skinType: "Loại da",
    expirationDate: "Hạn sử dụng",
  },

  // Sức khỏe
  Health: {
    dosage: "Liều lượng",
    ingredients: "Thành phần",
    expirationDate: "Hạn sử dụng",
  },

  // Thực phẩm
  Grocery: {
    weight: "Khối lượng",
    nutritionalInfo: "Thông tin dinh dưỡng",
    expirationDate: "Hạn sử dụng",
  },

  // Đồ chơi
  Toy: {
    ageRange: "Độ tuổi phù hợp",
    safetyFeatures: "Tính năng an toàn",
  },

  // Giày nam
  MenShoes: {
    shoeType: "Kiểu giày",
  },

  // Giày nữ
  WomenShoes: {
    heelHeight: "Chiều cao gót",
  },

  // Túi xách nữ
  WomenBags: {
    bagType: "Kiểu túi",
  },

  // Phụ kiện thời trang
  FashionAccessories: {
    accessoryType: "Loại phụ kiện",
  },

  // Sách và văn phòng phẩm
  BooksStationery: {
    genre: "Thể loại",
    author: "Tác giả",
  },

  // Túi xách nam
  MenBags: {
    bagType: "Kiểu túi",
  },

  // Thú cưng
  Pet: {
    petType: "Loại thú cưng",
    productType: "Loại sản phẩm",
    suitableFor: "Phù hợp cho",
  },

  // Dụng cụ và cải thiện nhà cửa
  ToolsHomeImprovement: {
    toolType: "Loại dụng cụ",
    powerSource: "Nguồn điện",
    usage: "Công dụng",
  },

  // Mẹ và bé
  MomsKidsBabies: {
    productType: "Loại sản phẩm",
    ageRange: "Độ tuổi phù hợp",
    safetyFeatures: "Tính năng an toàn",
  },

  // Đồ gia dụng
  HomeLiving: {
    productType: "Loại sản phẩm",
  },

  // Thể thao và ngoài trời
  SportOutdoor: {
    activityType: "Loại hoạt động",
    features: "Tính năng",
  },

  // Thời trang trẻ em
  KidFashion: {
    ageRange: "Độ tuổi phù hợp",
  },

  // Chăm sóc nhà cửa
  HomeCare: {
    productType: "Loại sản phẩm",
    volume: "Dung tích",
    fragrance: "Hương thơm",
    usage: "Công dụng",
  },
};

/**
 * Hàm lấy tên thuộc tính tiếng Việt từ tên tiếng Anh
 * @param attributeName Tên thuộc tính tiếng Anh
 * @param category Danh mục sản phẩm
 * @returns Tên thuộc tính tiếng Việt
 */
export const getAttributeTranslation = (
  attributeName: string,
  category?: string
): string => {
  // Nếu có danh mục và thuộc tính tồn tại trong bảng ánh xạ của danh mục đó
  if (category && categoryAttributeTranslations[category]?.[attributeName]) {
    return categoryAttributeTranslations[category][attributeName];
  }

  // Kiểm tra trong bảng ánh xạ chung
  if (commonAttributeTranslations[attributeName]) {
    return commonAttributeTranslations[attributeName];
  }

  // Nếu không tìm thấy, trả về tên thuộc tính gốc với chữ cái đầu viết hoa
  return attributeName.charAt(0).toUpperCase() + attributeName.slice(1);
};
