import { toast } from "react-toastify";

type ToastType = "success" | "error" | "info" | "warning" | "default";

const showToastMessage = (message: string, type: ToastType) => {
  toast(message, {
    position: "bottom-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    type,
  });
};

export default showToastMessage;
