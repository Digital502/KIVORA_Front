export const validatePerfil = ({ name, surname, username, phone, email }) => {
  if (!name || !surname || !username || !phone || !email)
    return { isValid: false, message: "Todos los campos son obligatorios" };

  if (name.length > 30 || surname.length > 30 || username.length > 30)
    return {
      isValid: false,
      message: "El nombre, apellido y usuario no pueden superar los 30 caracteres",
    };

  if (!/^\d{8}$/.test(phone))
    return { isValid: false, message: "El teléfono debe tener exactamente 8 dígitos" };

  if (!/@kinal\.edu\.gt$|@kinal\.org\.gt$/.test(email))
    return {
      isValid: false,
      message: "Solo se permiten correos con dominio @kinal.edu.gt o @kinal.org.gt",
    };

  return { isValid: true, message: "" };
};

export const validateCambioPassword = ({ oldPassword, newPassword }) => {
  if (!oldPassword || !newPassword)
    return { isValid: false, message: "Ambas contraseñas son obligatorias" };

  if (oldPassword === newPassword)
    return {
      isValid: false,
      message: "La nueva contraseña no puede ser igual a la anterior",
    };

  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  if (!regex.test(newPassword))
    return {
      isValid: false,
      message:
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo",
    };

  return { isValid: true, message: "" };
};

export const validateImagenPerfil = (file) => {
  if (!file)
    return { isValid: false, message: "Debes seleccionar una imagen" };

  const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (!validTypes.includes(file.type))
    return {
      isValid: false,
      message: "Solo se permiten archivos de imagen (jpg, jpeg, png, webp)",
    };

  const maxSizeMB = 5;
  if (file.size > maxSizeMB * 1024 * 1024)
    return {
      isValid: false,
      message: "La imagen no puede superar los 5MB",
    };

  return { isValid: true, message: "" };
};
