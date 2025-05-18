import { Profile } from "@/schema/profile";
import { Card, CardContent } from "../ui/card";

type TabType = "info" | "orders" | "security";

interface ProfileSidebarProps {
  profile: Profile | null;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isEditing: boolean;
}

const ProfileSidebar = ({
  profile,
  activeTab,
  setActiveTab,
  isEditing,
}: ProfileSidebarProps) => {
  // Get initial letter for the avatar
  const getInitial = () => {
    if (profile?.fullName && profile.fullName.length > 0) {
      return profile.fullName.charAt(0).toUpperCase();
    }
    return "U"; // Default initial if no name is available
  };

  // Check if user has avatar
  const hasAvatar = profile?.avatar && profile.avatar.trim() !== "";

  return (
    <div className="w-full md:w-1/4">
      <Card className="mb-6">
        <CardContent className="p-6 flex flex-col items-center">
          <div className="relative mb-4">
            {hasAvatar ? (
              <img
                src={profile.avatar || undefined}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-orange-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-md">
                {getInitial()}
              </div>
            )}
            {!isEditing && (
              <button className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full w-8 h-8 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                  />
                </svg>
              </button>
            )}
          </div>
          <h2 className="text-xl font-bold">
            {profile?.fullName || "Chưa cập nhật tên"}
          </h2>
          <p className="text-gray-500">{profile?.email}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            <button
              className={`w-full p-4 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                activeTab === "info" ? "bg-gray-50 font-semibold" : ""
              }`}
              onClick={() => setActiveTab("info")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              Thông tin cá nhân
            </button>
            <button
              className={`w-full p-4 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                activeTab === "orders" ? "bg-gray-50 font-semibold" : ""
              }`}
              onClick={() => setActiveTab("orders")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              Lịch sử đơn hàng
            </button>
            <button
              className={`w-full p-4 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                activeTab === "security" ? "bg-gray-50 font-semibold" : ""
              }`}
              onClick={() => setActiveTab("security")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
              Bảo mật tài khoản
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSidebar;
