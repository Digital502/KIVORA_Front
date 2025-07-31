export const validateName = (name) => {
    const regex = /^[^\s]{1}[A-Za-zÁ-ÿ\u00f1\u00d1\s]{1,23}[^\s]{1}$/

    return regex.test(name.trim()) 
}

export const validateNameMessage = 'El nombre debe contener entre 3 y 25 caracteres'