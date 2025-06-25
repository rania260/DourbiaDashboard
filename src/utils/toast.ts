import { toast as Toastify } from "react-toastify";

export const toast = {
  success: (message: string) => {
    Toastify.success(message);
  },
  error: (message: string) => {
    Toastify.error(message);
  }
};

// Export the original toast for direct usage
export { Toastify as toastOriginal };
