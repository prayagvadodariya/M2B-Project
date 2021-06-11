/* eslint-disable no-useless-escape */
import validation from 'validate.js'

const validate = (fieldName, value, message) => {
  const constraints = {
    email: {
      presence: true,
      format: {
        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: '^Please enter valid email id',
      }
    },
    password: {
      presence: true,
      length: {
        minimum: 6,
        message: '^Password must be at least 6 characters',
      }
    },
    confirmPassword: {
      equality: {
        attribute: "password",
        message: "does not match",
        comparator: (v1) => {
          return v1.confirmPassword === v1.password
        }
      }
    },
    phoneNo: {
      presence: true,
      format: {
        pattern: "^[0-9]{10}$",
        message: '^Invalid phone number',
      },
    },
    username: {
      presence: true,
      length: {
        minimum: 1,
        message: '^A valid name is required',
      }
    },
    creditCardNumber: {
      presence: true,
      format: {
        pattern: /^(34|37|4|5[1-5]).*$/,
        message: "^Please enter a valid credit card number"
      },
      length: (v, attributes, attributeName, options) => {
        if (v) {
          // Amex
          if ((/^(34|37).*$/).test(value)) return { is: 15 };
          // Visa, Mastercard
          if ((/^(4|5[1-5]).*$/).test(value)) return { is: 16 };
        }
        // Unknown card, don't validate length
        return false;
      }
    },
    expMonth: {
      presence: true,
      length: {
        minimum: 2,
        message: '^Please select expiration month',
      }
    },
    expYear: {
      presence: true,
      length: {
        minimum: 4,
        message: '^Please select expiration year',
      }
    },
    cvv: {
      presence: true,
      length: {
        maximum: 3,
        minimum: 3,
        message: '^Please enter valid CVV',
      }
    },
    required: {
      presence: {
        allowEmpty: false,
        message: `^${message}`
      }
    }
  };

  const formValues = {}
  formValues[fieldName] = value

  const formFields = {}
  formFields[fieldName] = constraints[fieldName]

  const result = validation(formValues, formFields)

  if (result) {
    return result[fieldName][0]
  }
  return null
}

export default validate
