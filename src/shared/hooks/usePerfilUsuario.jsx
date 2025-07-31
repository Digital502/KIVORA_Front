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

export const usePerfilUsuario = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [perfil, setPerfil] = useState(null);
  const navigate = useNavigate();

  const construirPerfil = (data) => {
    if (!data) return null;

    return {
      ...data,
      imageUrl: data.imageUrl
        ? data.imageUrl
        : `http://res.cloudinary.com/ddchtdi5y/image/upload/v1/${data.profilePicture}`,
    };
  };

  // Obtener datos del usuario autenticado
  const fetchMyUser = async () => {
    try {
      setIsLoading(true);
      const response = await getMyUser();

      if (!response.success || !response.services?.[0]) {
        toast.error("No se pudo obtener la información del usuario");
        return;
      }

      const perfilConstruido = construirPerfil(response.services[0]);
      setPerfil(perfilConstruido);
    } catch (error) {
      toast.error("Error al obtener el perfil del usuario");
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar perfil (nombre, apellido, username, teléfono)
  const actualizarPerfil = async (datosActualizados) => {
    try {
      setIsLoading(true);
      const response = await updateUser(datosActualizados);

      if (!response.success) {
        toast.error("No se pudo actualizar el perfil");
        return;
      }

      const perfilActualizado = construirPerfil(response.user);
      setPerfil(perfilActualizado);
      toast.success(response.message || "Perfil actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  // Cambiar contraseña
  const cambiarContrasena = async ({ oldPassword, newPassword }) => {
    try {
      setIsLoading(true);
      const response = await changePassword({ oldPassword, newPassword });

      if (response.message?.toLowerCase().includes("updated")) {
        toast.success("Contraseña actualizada exitosamente");
      } else {
        toast.error("Error al cambiar la contraseña");
      }
    } catch (error) {
      toast.error("Error al cambiar la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar cuenta del usuario
  const eliminarCuenta = async () => {
    try {
      setIsLoading(true);
      const response = await deleteUser();

      if (response.success) {
        toast.success("Cuenta eliminada con éxito");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      } else {
        toast.error("No se pudo eliminar la cuenta");
      }
    } catch (error) {
      toast.error("Error al eliminar la cuenta");
    } finally {
      setIsLoading(false);
    }
  };

  const actualizarFotoPerfil = async (file) => {
  try {
    setIsLoading(true);
    const response = await updateProfilePicture(file);

    if (!response.success) {
      toast.error("No se pudo actualizar la imagen");
      return;
    }

    const perfilActualizado = construirPerfil(response.user);
    setPerfil(perfilActualizado);
    toast.success(response.message || "Imagen actualizada correctamente");
  } catch (error) {
    toast.error("Error al actualizar la imagen");
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
