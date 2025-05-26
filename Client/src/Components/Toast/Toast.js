import { toast, Bounce } from 'react-toastify';

const showToast = (message, success) => {
  if (success) {
    
    toast(`✅ ${message}` || 'Task Successful', {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  } else {
    toast.warn(message, {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
    });
  }
};

export default showToast;
