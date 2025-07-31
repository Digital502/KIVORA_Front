
export const validateTitle = (title) => {
  return typeof title === 'string' && title.length > 0 && title.length <= 100;
};

export const validateTitleMessage = 'El título es obligatorio y debe tener máximo 100 caracteres';

export const validateDescription = (description) => {
  return typeof description === 'string' && description.length <= 500;
};

export const validateDescriptionMessage = 'La descripción debe tener máximo 500 caracteres';
