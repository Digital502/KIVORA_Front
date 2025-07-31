import { useNavigate } from "react-router-dom";
import { login } from "../../services";
import toast from "react-hot-toast";
import { useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const toastSuccess = (title, message = "") => {
    toast.success(
      <div className="flex items-start gap-3">
        <CheckCircle className="w-5 h-5 mt-0.5 text-green-500" />
        <div>
          <p className="font-medium">{title}</p>
          {message && <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>}
        </div>
      </div>,
      {
        className: "border border-green-200 bg-green-50 dark:bg-gray-800 dark:border-green-800/50",
        position: "top-right",
      }
    );
  };

  const toastError = (title, message = "") => {
    toast.error(
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 mt-0.5 text-red-500" />
        <div>
          <p className="font-medium">{title}</p>
          {message && <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>}
        </div>
      </div>,
      {
        className: "border border-red-200 bg-red-50 dark:bg-gray-800 dark:border-red-800/50",
        position: "top-right",
      }
    );
  };

  const loginUser = async (email, password) => {
    try {
      setIsLoading(true);

      const response = await login({ email, password });
      const userDetails = response.data?.userDetails;

      if (!userDetails?.token) {
        toastError("Token faltante", "No se encontró el token en la respuesta del servidor.");
        return;
      }

      toastSuccess("¡Inicio de sesión exitoso!", response.data.message);
      localStorage.setItem("user", JSON.stringify(userDetails));
      navigate("/home", { replace: true });

    } catch (error) {
      const errorText = error?.response?.data?.error?.toLowerCase() || "";

      if (errorText.includes("no user")) {
        toastError("Correo incorrecto", "No existe una cuenta asociada a ese correo.");
      } else if (errorText.includes("password")) {
        toastError("Contraseña incorrecta", "Verifica tus credenciales.");
      } else {
        toastError("Error de autenticación", errorText || "Error al iniciar sesión.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginUser,
    isLoading,
  };
};
