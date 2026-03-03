import { notification } from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  InfoCircleFilled,
  ExclamationCircleFilled,
} from "@ant-design/icons";

export let notify: ReturnType<typeof notification.useNotification>[0];

export const AppNotification = () => {
  const [api, contextHolder] = notification.useNotification();

  notify = api;

  return <>{contextHolder}</>;
};

export const showNotify = (
  type: "success" | "error" | "info" | "warning",
  message: string,
  description?: string,
) => {
  if (!notify) return;

  const icons = {
    success: <CheckCircleFilled className="text-green-400" />,
    error: <CloseCircleFilled className="text-red-400" />,
    info: <InfoCircleFilled className="text-blue-400" />,
    warning: <ExclamationCircleFilled className="text-yellow-400" />,
  };

  notify[type]({
    message: <span className="text-white font-bold">{message}</span>,
    description: <span className="text-white/70 text-xs">{description}</span>,
    placement: "topLeft",
    duration: 3,
    icon: icons[type],
    className:
      "bg-[#D43B42] backdrop-blur-md !border !rounded-1xl !border-white-50 shadow-2xl custom-notification",
    closeIcon: (
      <span className="text-white/70 text-2xl  hover:text-white transition-colors">
        ×
      </span>
    ),
  });
};
