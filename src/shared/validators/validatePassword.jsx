export const validatePassword = (contraseña) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!contraseña.trim()) return { isValid: false, message: 'La contraseña no puede estar vacía' };
  const isValid = regex.test(contraseña);

  return {
    isValid,
    message: isValid
      ? ''
      : 'La contraseña debe tener al menos 8 caracteres, una minúscula, una mayúscula, un número y un símbolo',
  };
};

export const validatePasswordMessage = 'La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un símbolo especial (@$!%*?&)';

