/**
 * Utility functions for form validation
 */

/**
 * Validates email format
 * Uses a more comprehensive regex pattern that better matches RFC 5322
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
  // More comprehensive email validation regex
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

/**
 * Validates Vietnamese phone number format
 * Accepts 10-11 digit numbers (standard Vietnamese mobile and landline formats)
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} True if phone number is valid
 */
export const isValidVietnamesePhoneNumber = (phoneNumber) => {
  // Vietnamese phone numbers: 10-11 digits
  // Mobile: starts with 03, 05, 07, 08, 09 (10 digits)
  // Landline: area code + number (10-11 digits)
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phoneNumber);
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @param {number} minLength - Minimum length required (default: 6)
 * @returns {object} Validation result with isValid and message
 */
export const validatePassword = (password, minLength = 6) => {
  if (!password) {
    return { isValid: false, message: "Mật khẩu không được để trống" };
  }
  if (password.length < minLength) {
    return { isValid: false, message: `Mật khẩu phải có ít nhất ${minLength} ký tự` };
  }
  return { isValid: true, message: "" };
};

/**
 * Validates name format
 * @param {string} name - Name to validate
 * @param {number} minLength - Minimum length required (default: 2)
 * @returns {object} Validation result with isValid and message
 */
export const validateName = (name, minLength = 2) => {
  if (!name) {
    return { isValid: false, message: "Họ tên không được để trống" };
  }
  if (name.trim().length < minLength) {
    return { isValid: false, message: `Họ tên phải có ít nhất ${minLength} ký tự` };
  }
  return { isValid: true, message: "" };
};
