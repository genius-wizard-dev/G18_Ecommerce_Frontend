import { useNavigate } from "react-router-dom";

interface NotFoundProps {
  message?: string;
}

const NotFound: React.FC<NotFoundProps> = ({
  message = "Không tìm thấy trang",
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">{message}</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
};

export default NotFound;
