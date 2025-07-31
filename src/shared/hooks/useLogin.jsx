import { useNavigate } from "react-router-dom";
import { login } from "../../services";
import toast from "react-hot-toast";
import { useState } from "react";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loginUser = async (email, password) => {
    try {
      setIsLoading(true);

      const response = await login({ email, password });

      const userDetails = response.data?.userDetails;

      if (!userDetails?.token) {
        toast.error("Token no encontrado en la respuesta del servidor.");
        return;
      }

      toast.success(response.data.message || "Inicio de sesión exitoso");

      localStorage.setItem("user", JSON.stringify(userDetails));

      navigate("/home", { replace: true });

    } catch (error) {
      const errorText = error?.response?.data?.error?.toLowerCase() || "";

      if (errorText.includes("no user")) {
        toast.error("Correo electrónico incorrecto");
      } else if (errorText.includes("password")) {
        toast.error("Contraseña incorrecta");
      } else {
        toast.error(errorText || "Error al iniciar sesión.");
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
