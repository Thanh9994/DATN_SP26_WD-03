import { UploadOutlined } from "@ant-design/icons";
import { useAuth } from "@web/hooks/useAuth";
import { Button, Upload } from "antd";

export const ProfileInfo = () => {
  const { user } = useAuth();

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
        <h1 className="text-xl md:text-3xl font-bold text-white">
          Information
        </h1>
        <div className="justify-end">
          <Button
            size="large"
            className="w-full sm:w-auto !bg-red-500 !border-none !text-white hover:!bg-red-600"
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 lg:p-8 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-white mb-8">
          Personal Information
        </h2>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <img
              src="https://i.pravatar.cc/150"
              alt="avatar"
              className="w-32 h-32 rounded-3xl object-cover border-4 border-red-500 shadow-lg"
            />

            <Upload showUploadList={false}>
              <Button
                icon={<UploadOutlined />}
                className="!bg-red-500 !border-none !text-white hover:!bg-red-600"
              >
                Change Avatar
              </Button>
            </Upload>

            <p className="text-gray-400 text-sm">AVATAR</p>
          </div>

          {/* Form */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <p className="text-gray-400 text-sm mb-2">Full Name</p>
                <div className="bg-white/10 border border-white/10 h-12 rounded-xl flex items-center px-4 text-white">
                  {user?.ho_ten || "Chưa cập nhật"}
                </div>
              </div>

              <div className="flex-1">
                <p className="text-gray-400 text-sm mb-2">Phone Number</p>
                <div className="bg-white/10 border border-white/10 h-12 rounded-xl flex items-center px-4 text-white">
                  {user?.phone || "Chưa cập nhật"}
                </div>
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-2">Email</p>
              <div className="bg-white/10 border border-white/10 h-12 rounded-xl flex items-center px-4 text-white">
                {user?.email || "Chưa cập nhật"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 w-16 h-1 bg-red-500 rounded-full" />
    </div>
  );
};
