interface FieldValidation {
  field: string
  value: string
  validations: {
    required?: [boolean, string]
    minLength?: [number, string]
    maxLength?: [number, string]
    pattern?: [RegExp, string]
  }
}

export const validations = (fields: FieldValidation[]): { isValid: boolean; message: string } => {
  for (let field of fields) {
    if (field.validations.required && field.value.trim() === '') {
      return {
        isValid: false,
        message: field.validations.required[1],
      }
    }
    if (field.validations.minLength) {
      if (field.value.trim().length < field.validations.minLength[0]) {
        return {
          isValid: false,
          message: field.validations.minLength[1],
        }
      }
    }
    if (field.validations.maxLength) {
      if (field.value.trim().length > field.validations.maxLength[0]) {
        return {
          isValid: false,
          message: field.validations.maxLength[1],
        }
      }
    }
    if (field.validations.pattern) {
      if (!field.validations.pattern[0].test(field.value)) {
        return {
          isValid: false,
          message: field.validations.pattern[1],
        }
      }
    }
  }

  return {
   isValid: true,
   message: '',
  }
}
