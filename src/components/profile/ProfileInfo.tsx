import { Address } from "@/types/address";
import { Profile } from "@/types/profile";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { AddressForm } from "./AddressForm";

interface ProfileInfoProps {
  profile: Profile | null;
  editedProfile: Profile | null;
  isEditing: boolean;
  isUpdateLoading: boolean;
  address: Address[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdateProfile: () => void;
  setIsEditing: (value: boolean) => void;
  setEditedProfile: (profile: Profile | null) => void;
}

const ProfileInfo = ({
  profile,
  editedProfile,
  isEditing,
  isUpdateLoading,
  address,
  handleInputChange,
  handleUpdateProfile,
  setIsEditing,
  setEditedProfile,
}: ProfileInfoProps) => {
  // Format định dạng ngày
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN").format(date);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>Quản lý thông tin cá nhân của bạn</CardDescription>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setEditedProfile(profile);
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleUpdateProfile} disabled={isUpdateLoading}>
              {isUpdateLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Họ và tên</Label>
            {isEditing ? (
              <Input
                id="fullName"
                name="fullName"
                value={editedProfile?.fullName || ""}
                onChange={handleInputChange}
              />
            ) : (
              <div className="p-2 border rounded-md bg-gray-50">
                {profile?.fullName || "Chưa cập nhật"}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            {isEditing ? (
              <Input
                id="email"
                name="email"
                type="email"
                value={editedProfile?.email || ""}
                onChange={handleInputChange}
              />
            ) : (
              <div className="p-2 border rounded-md bg-gray-50">
                {profile?.email || "Chưa cập nhật"}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Số điện thoại</Label>
            {isEditing ? (
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={editedProfile?.phoneNumber || ""}
                onChange={handleInputChange}
              />
            ) : (
              <div className="p-2 border rounded-md bg-gray-50">
                {profile?.phoneNumber || "Chưa cập nhật"}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthday">Ngày sinh</Label>
            {isEditing ? (
              <Input
                id="birthday"
                name="birthday"
                type="date"
                value={editedProfile?.birthday || ""}
                onChange={handleInputChange}
              />
            ) : (
              <div className="p-2 border rounded-md bg-gray-50">
                {profile?.birthday
                  ? formatDate(profile.birthday)
                  : "Chưa cập nhật"}
              </div>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <AddressForm address={address} profileId={profile?.id} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileInfo;
