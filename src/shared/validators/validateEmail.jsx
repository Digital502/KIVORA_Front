export const validateEmail = (correo) => {
  const regex = /^[a-zA-Z0-9._%+-]+@kinal\.(edu|org)\.gt$/;
  if (!correo.trim()) {
    return { isValid: false, message: 'El correo no puede estar vacío' };
  }

  const isValid = regex.test(correo);

  return  {
    isValid,
    message: isValid ? '' : 'Ingresa un correo institucional válido (@kinal.edu.gt o @kinal.org.gt)',
  };
};

export const validateEmailMessage = 'El correo debe ser @kinal.edu.gt o @kinal.org.gt';

