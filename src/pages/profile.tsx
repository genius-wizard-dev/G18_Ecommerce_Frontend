import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getAllAddress } from "@/redux/thunks/address";
import { fetchProvinces } from "@/redux/thunks/location";
import { updateProfile } from "@/redux/thunks/profile";
import { Profile } from "@/schema/profile";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { OrderHistory } from "@/components/profile/OrderHistory";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import { SecuritySettings } from "@/components/profile/SecuritySettings";

type TabType = "info" | "orders" | "security";

const ProfilePage = () => {
  // Get account and profile from Redux
  const dispatch = useAppDispatch();
  const { account, isAuthenticated } = useAppSelector((state) => state.account);
  const { profile, isLoading: profileLoading } = useAppSelector(
    (state) => state.profile
  );
  const { address } = useAppSelector((state) => state.address);
  const { provinces } = useAppSelector((state) => state.location);

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile | null>(
    profile || null
  );
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("info");

  useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
    }
  }, [profile]);

  useEffect(() => {
    if (profile?.id) {
      dispatch(getAllAddress(profile.id));
    }
  }, [dispatch, profile]);

  useEffect(() => {
    if (provinces.length === 0) {
      dispatch(fetchProvinces());
    }
  }, [dispatch, provinces.length]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">
          Please login to view your profile
        </h1>
      </div>
    );
  }

  if (profileLoading && !profile) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading profile...</h1>
      </div>
    );
  }

  // Xử lý thay đổi input khi chỉnh sửa thông tin
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editedProfile) {
      setEditedProfile((prev) => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  // Xử lý cập nhật thông tin người dùng
  const handleUpdateProfile = async () => {
    if (!editedProfile || !account?.id) return;

    setIsUpdateLoading(true);
    try {
      await dispatch(
        updateProfile({
          userId: account.id,
          profileData: editedProfile,
        })
      ).unwrap();

      setIsEditing(false);
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      toast.error("Không thể cập nhật thông tin: " + error);
    } finally {
      setIsUpdateLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Trang cá nhân</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <ProfileSidebar
          profile={profile}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isEditing={isEditing}
        />

        <div className="w-full md:w-3/4">
          {activeTab === "info" && (
            <ProfileInfo
              profile={profile}
              editedProfile={editedProfile}
              isEditing={isEditing}
              isUpdateLoading={isUpdateLoading}
              address={address}
              handleInputChange={handleInputChange}
              handleUpdateProfile={handleUpdateProfile}
              setIsEditing={setIsEditing}
              setEditedProfile={setEditedProfile}
            />
          )}

          {activeTab === "orders" && <OrderHistory />}

          {activeTab === "security" && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
