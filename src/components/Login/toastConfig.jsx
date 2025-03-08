import { toast } from "react-toastify";

const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    closeButton: false,
    pauseOnHover: false,
    draggable: true,
    theme: "dark",
    style: {
        minWidth: "350px",
        minHeight: "120px",
        paddingTop: "100px",
        padding: "20px",
    },
};

export const showSuccessToast = (message) => {
    toast.success(message, {
        ...toastConfig,
        style: { ...toastConfig.style, backgroundColor: "#016322" },
    });
};

export const showErrorToast = (message) => {
    toast.error(message, {
        ...toastConfig,
        style: { ...toastConfig.style, backgroundColor: "#880707" }, 
   });
};