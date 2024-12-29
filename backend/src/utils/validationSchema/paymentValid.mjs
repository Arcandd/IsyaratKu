export const createPaymentValidationMethod = {
  userId: {
    isLength: {
      options: { min: 24, max: 24 },
      errorMessage: "User ID must be 24 characters if provided",
    },
    notEmpty: {
      errorMessage: "User ID can not be empty if provided",
    },
    isString: {
      errorMessage: "User ID must be a string if provided",
    },
    optional: true,
  },
  courseId: {
    isLength: {
      options: { min: 24, max: 24 },
      errorMessage: "Course ID must be 24 characters",
    },
    notEmpty: {
      errorMessage: "Course ID can not be empty",
    },
    isString: {
      errorMessage: "Course ID must be a string",
    },
  },
  amount: {
    notEmpty: {
      errorMessage: "Payment amount can not be empty",
    },
    isInt: {
      errorMessage: "Payment amount must be an integer",
    },
  },
  status: {
    notEmpty: {
      errorMessage: "Payment status can not be empty if provided",
    },
    isIn: {
      options: [["Pending", "Completed", "Failed"]],
      errorMessage:
        "Payment status must be either 'Pending', 'Completed' or 'Failed' if provided",
    },
    isString: {
      errorMessage: "Payment status must be a string if provided",
    },
    optional: true,
  },
  method: {
    isString: {
      errorMessage: "Payment method must be a string",
    },
    isIn: {
      options: [["OVO", "GoPay", "DANA", "PayPal", "Master Card"]],
      errorMessage:
        "Payment method must be either 'OVO', 'GoPay', 'DANA', 'Paypal' or 'Master Card'",
    },
    notEmpty: {
      errorMessage: "Payment method can not be empty",
    },
  },
  transactionId: {
    isString: {
      errorMessage: "Transaction ID must be a string if provided",
    },
    notEmpty: {
      errorMessage: "Transaction ID can not be empty if provided",
    },
    optional: true,
  },
};
