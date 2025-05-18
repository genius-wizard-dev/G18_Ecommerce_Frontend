import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  createAddress,
  deleteAddress,
  updateAddress,
} from "@/redux/thunks/address";
import {
  fetchDistricts,
  fetchWards,
  selectDistrict,
  selectProvince,
  selectWard,
} from "@/redux/thunks/location";
import {
  Address,
  CreateAddress,
  District,
  Province,
  Ward,
} from "@/schema/address";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface AddressFormProps {
  address: Address[];
  profileId: string;
}

export const AddressForm = ({ address, profileId }: AddressFormProps) => {
  const dispatch = useAppDispatch();
  const {
    provinces,
    districts,
    wards,
    isLoading: locationLoading,
  } = useAppSelector((state) => state.location);
  const { isCreating, isUpdating, isDeleting } = useAppSelector(
    (state) => state.address
  );

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string>("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [selectedProvinceLocal, setSelectedProvinceLocal] = useState<
    Province | undefined
  >();
  const [selectedDistrictLocal, setSelectedDistrictLocal] = useState<
    District | undefined
  >();
  const [selectedWardLocal, setSelectedWardLocal] = useState<
    Ward | undefined
  >();
  const [newAddress, setNewAddress] = useState<CreateAddress>({
    street: "",
    ward: "",
    city: "",
    detail: "",
    district: "",
    type: "HOME",
    phoneShip: "",
  });

  const resetAddressForm = () => {
    setNewAddress({
      street: "",
      ward: "",
      city: "",
      detail: "",
      district: "",
      type: "HOME",
      phoneShip: "",
    });
    setSelectedProvinceLocal(undefined);
    setSelectedDistrictLocal(undefined);
    setSelectedWardLocal(undefined);
  };

  const handleProvinceChange = async (provinceCode: string) => {
    const province = provinces.find(
      (p: Province) => p.code.toString() === provinceCode
    );
    if (province) {
      dispatch(selectProvince(province));
      setSelectedProvinceLocal(province);
      await dispatch(fetchDistricts(province.code));
      setNewAddress((prev) => ({
        ...prev,
        district: "",
        ward: "",
      }));
      setSelectedDistrictLocal(undefined);
      setSelectedWardLocal(undefined);
    }
  };

  const handleDistrictChange = async (districtCode: string) => {
    const district = districts.find(
      (d: District) => d.code.toString() === districtCode
    );
    if (district) {
      dispatch(selectDistrict(district));
      setSelectedDistrictLocal(district);
      await dispatch(fetchWards(district.code));
      setNewAddress((prev) => ({
        ...prev,
        ward: "",
      }));
      setSelectedWardLocal(undefined);
    }
  };

  const handleWardChange = (wardCode: string) => {
    const ward = wards.find((w: Ward) => w.code.toString() === wardCode);
    if (ward) {
      dispatch(selectWard(ward));
      setSelectedWardLocal(ward);
    }
  };

  const handleEditAddress = async (addr: Address) => {
    try {
      setIsLoadingAddress(true);
      // Tìm và set tỉnh/thành phố
      const province = provinces.find((p: Province) => p.name === addr.city);
      if (province) {
        dispatch(selectProvince(province));
        setSelectedProvinceLocal(province);

        // Load quận/huyện
        const districtsResult = await dispatch(
          fetchDistricts(province.code)
        ).unwrap();
        if (districtsResult) {
          // Tìm và set quận/huyện
          const district = districtsResult.find(
            (d) => d.name === addr.district
          );
          if (district) {
            dispatch(selectDistrict(district));
            setSelectedDistrictLocal(district);

            // Load phường/xã
            const wardsResult = await dispatch(
              fetchWards(district.code)
            ).unwrap();
            if (wardsResult) {
              // Tìm và set phường/xã
              const ward = wardsResult.find((w) => w.name === addr.ward);
              if (ward) {
                dispatch(selectWard(ward));
                setSelectedWardLocal(ward);
              }
            }
          }
        }
      }

      setNewAddress({
        street: addr.street,
        ward: addr.ward,
        city: addr.city,
        detail: addr.detail,
        district: addr.district,
        type: addr.type,
        phoneShip: addr.phoneShip,
      });

      setIsEditingAddress(true);
      setEditingAddressId(addr.id);
    } catch (error) {
      toast.error("Không thể tải thông tin địa chỉ: " + error);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const handleAddAddress = async () => {
    if (
      !selectedProvinceLocal ||
      !selectedDistrictLocal ||
      !selectedWardLocal
    ) {
      toast.error("Vui lòng chọn đầy đủ thông tin địa chỉ");
      return;
    }

    try {
      const addressData: CreateAddress = {
        street: newAddress.street,
        ward: selectedWardLocal.name,
        city: selectedProvinceLocal.name,
        detail: newAddress.detail,
        district: selectedDistrictLocal.name,
        type: newAddress.type,
        phoneShip: newAddress.phoneShip,
      };

      await dispatch(
        createAddress({
          address: addressData as Address,
          profileId: profileId,
        })
      ).unwrap();

      setIsAddingAddress(false);
      resetAddressForm();
      toast.success("Thêm địa chỉ thành công!");
    } catch (error) {
      toast.error("Không thể thêm địa chỉ: " + error);
    }
  };

  const handleUpdateAddress = async () => {
    if (
      !selectedProvinceLocal ||
      !selectedDistrictLocal ||
      !selectedWardLocal
    ) {
      toast.error("Vui lòng chọn đầy đủ thông tin địa chỉ");
      return;
    }

    try {
      const addressData: CreateAddress = {
        street: newAddress.street,
        ward: selectedWardLocal.name,
        city: selectedProvinceLocal.name,
        detail: newAddress.detail,
        district: selectedDistrictLocal.name,
        type: newAddress.type,
        phoneShip: newAddress.phoneShip,
      };

      await dispatch(
        updateAddress({
          address: addressData,
          addressId: editingAddressId,
        })
      ).unwrap();

      setIsEditingAddress(false);
      setEditingAddressId("");
      resetAddressForm();
      toast.success("Cập nhật địa chỉ thành công!");
    } catch (error) {
      toast.error("Không thể cập nhật địa chỉ: " + error);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (isDeleting) return; // Prevent spam click when loading

    try {
      await dispatch(deleteAddress({ addressId })).unwrap();
      toast.success("Xóa địa chỉ thành công!");
    } catch (error) {
      toast.error("Không thể xóa địa chỉ: " + error);
    }
  };

  const handleCancel = () => {
    setIsAddingAddress(false);
    setIsEditingAddress(false);
    setEditingAddressId("");
    resetAddressForm();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Label>Địa chỉ</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddingAddress(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white relative"
          disabled={isCreating}
        >
          Thêm địa chỉ mới
        </Button>
      </div>

      {(isAddingAddress || isEditingAddress) && (
        <Card className="mb-4">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="province" className="text-sm font-medium">
                  Tỉnh/Thành phố
                </Label>
                <Select
                  value={selectedProvinceLocal?.code.toString() || ""}
                  onValueChange={handleProvinceChange}
                  disabled={locationLoading || isLoadingAddress}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Chọn tỉnh/thành phố" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border rounded-md shadow-lg max-h-[300px]">
                    {provinces.map(
                      (province: { code: number; name: string }) => (
                        <SelectItem
                          key={province.code}
                          value={province.code.toString()}
                          className="hover:bg-gray-100 cursor-pointer py-2"
                        >
                          {province.name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="district" className="text-sm font-medium">
                  Quận/Huyện
                </Label>
                <Select
                  value={selectedDistrictLocal?.code.toString() || ""}
                  onValueChange={handleDistrictChange}
                  disabled={
                    !selectedProvinceLocal ||
                    locationLoading ||
                    isLoadingAddress
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Chọn quận/huyện" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border rounded-md shadow-lg max-h-[300px]">
                    {districts.map(
                      (district: { code: number; name: string }) => (
                        <SelectItem
                          key={district.code}
                          value={district.code.toString()}
                          className="hover:bg-gray-100 cursor-pointer py-2"
                        >
                          {district.name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="ward" className="text-sm font-medium">
                  Phường/Xã
                </Label>
                <Select
                  value={selectedWardLocal?.code.toString() || ""}
                  onValueChange={handleWardChange}
                  disabled={
                    !selectedDistrictLocal ||
                    locationLoading ||
                    isLoadingAddress
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Chọn phường/xã" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border rounded-md shadow-lg max-h-[300px]">
                    {wards.map((ward: { code: number; name: string }) => (
                      <SelectItem
                        key={ward.code}
                        value={ward.code.toString()}
                        className="hover:bg-gray-100 cursor-pointer py-2"
                      >
                        {ward.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="street" className="text-sm font-medium">
                  Đường
                </Label>
                <Input
                  id="street"
                  value={newAddress.street}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      street: e.target.value,
                    })
                  }
                  className="h-10"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="detail" className="text-sm font-medium">
                  Ghi chú
                </Label>
                <Input
                  id="detail"
                  value={newAddress.detail}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      detail: e.target.value,
                    })
                  }
                  className="h-10"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="phoneShip" className="text-sm font-medium">
                  Số điện thoại
                </Label>
                <Input
                  id="phoneShip"
                  value={newAddress.phoneShip}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      phoneShip: e.target.value,
                    })
                  }
                  className="h-10"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="type" className="text-sm font-medium">
                  Loại địa chỉ
                </Label>
                <Select
                  value={newAddress.type}
                  onValueChange={(value: "HOME" | "WORK" | "OTHER") =>
                    setNewAddress({ ...newAddress, type: value })
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Chọn loại địa chỉ" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border rounded-md shadow-lg">
                    <SelectItem
                      value="HOME"
                      className="hover:bg-gray-100 cursor-pointer py-2"
                    >
                      Nhà riêng
                    </SelectItem>
                    <SelectItem
                      value="WORK"
                      className="hover:bg-gray-100 cursor-pointer py-2"
                    >
                      Công ty
                    </SelectItem>
                    <SelectItem
                      value="OTHER"
                      className="hover:bg-gray-100 cursor-pointer py-2"
                    >
                      Khác
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="h-10 px-4"
                disabled={isLoadingAddress}
              >
                Hủy
              </Button>
              <Button
                onClick={
                  isEditingAddress ? handleUpdateAddress : handleAddAddress
                }
                className="h-10 px-4 bg-blue-500 hover:bg-blue-600 text-white relative"
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating ? (
                  <>
                    <span className="opacity-0">
                      {isEditingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </>
                ) : isEditingAddress ? (
                  "Cập nhật địa chỉ"
                ) : (
                  "Thêm địa chỉ"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {address.map((addr) => (
        <Card key={addr.id} className="mb-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  {addr.type === "HOME"
                    ? "Nhà riêng"
                    : addr.type === "WORK"
                    ? "Công ty"
                    : "Khác"}
                </p>
                <p className="text-gray-600">Ghi chú: {addr.detail}</p>
                <p className="text-gray-600">
                  Địa chỉ: {addr.street}, {addr.ward}, {addr.district},{" "}
                  {addr.city}
                </p>
                <p className="text-gray-600">SĐT: {addr.phoneShip}</p>
              </div>
              <div className="flex gap-2">
                {addr.isDefault && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Mặc định
                  </span>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditAddress(addr)}
                    disabled={isUpdating}
                  >
                    Chỉnh sửa
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteAddress(addr.id)}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600 text-white relative"
                  >
                    {isDeleting ? (
                      <>
                        <span className="opacity-0">Xóa</span>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      </>
                    ) : (
                      "Xóa"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
