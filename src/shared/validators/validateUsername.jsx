export const validateUsername = (username) => {
  const regex = /^[a-zA-Z0-9_]{4,20}$/

  return regex.test(username)
}

export const validateUsernameMessage = 'El nombre de usuario debe tener entre 4 y 20 caracteres y solo puede contener letras, números y guiones bajos (_)'