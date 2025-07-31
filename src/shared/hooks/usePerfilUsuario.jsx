import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyUser,
  updateUser,
  deleteUser,
  changePassword,
  updateProfilePicture,
} from "../../services";
import toast from "react-hot-toast";
import { CheckCircle, AlertCircle } from "lucide-react";

export const usePerfilUsuario = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [perfil, setPerfil] = useState(null);
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

  const construirPerfil = (data) => {
    if (!data) return null;
    return {
      ...data,
      imageUrl: data.imageUrl
        ? data.imageUrl
        : `http://res.cloudinary.com/ddchtdi5y/image/upload/v1/${data.profilePicture}`,
    };
  };

  const fetchMyUser = async () => {
    try {
      setIsLoading(true);
      const response = await getMyUser();

      if (!response.success || !response.services?.[0]) {
        toastError("No se pudo obtener el usuario");
        return;
      }

      const perfilConstruido = construirPerfil(response.services[0]);
      setPerfil(perfilConstruido);
    } catch (error) {
      toastError("Error al obtener el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const actualizarPerfil = async (datosActualizados) => {
    try {
      setIsLoading(true);
      const response = await updateUser(datosActualizados);

      if (!response.success) {
        toastError("No se pudo actualizar el perfil");
        return;
      }

      const perfilActualizado = construirPerfil(response.user);
      setPerfil(perfilActualizado);
      toastSuccess("Perfil actualizado", response.message || "Cambios guardados correctamente");
    } catch (error) {
      toastError("Error al actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const cambiarContrasena = async ({ oldPassword, newPassword }) => {
    try {
      setIsLoading(true);
      const response = await changePassword({ oldPassword, newPassword });

      if (response.message?.toLowerCase().includes("updated")) {
        toastSuccess("Contraseña actualizada");
      } else {
        toastError("Error al cambiar la contraseña");
      }
    } catch (error) {
      toastError("Error al cambiar la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarCuenta = async () => {
    try {
      setIsLoading(true);
      const response = await deleteUser();

      if (response.success) {
        toastSuccess("Cuenta eliminada", "Esperamos verte pronto");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      } else {
        toastError("No se pudo eliminar la cuenta");
      }
    } catch (error) {
      toastError("Error al eliminar la cuenta");
    } finally {
      setIsLoading(false);
    }
  };

  const actualizarFotoPerfil = async (file) => {
    try {
      setIsLoading(true);
      const response = await updateProfilePicture(file);

      if (!response.success) {
        toastError("No se pudo actualizar la imagen");
        return;
      }

      const perfilActualizado = construirPerfil(response.user);
      setPerfil(perfilActualizado);
      toastSuccess("Imagen actualizada", response.message || "Se ha guardado tu nueva foto");
    } catch (error) {
      toastError("Error al actualizar la imagen");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    perfil,
    isLoading,
    fetchMyUser,
    actualizarPerfil,
    cambiarContrasena,
    eliminarCuenta,
    actualizarFotoPerfil,
  };
};
