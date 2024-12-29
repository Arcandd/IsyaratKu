export const signUpValidationSchema = {
  username: {
    isLength: {
      options: { min: 5, max: 24 },
      errorMessage: "Username must be atleast 5-24 characters",
    },
    notEmpty: {
      errorMessage: "Username cannot be empty",
    },
    isString: {
      errorMessage: "Username must be a string",
    },
  },
  password: {
    isLength: {
      options: { min: 8, max: 20 },
      errorMessage: "Password must be atleast 8-20 characters",
    },
    notEmpty: {
      errorMessage: "Password cannot be empty",
    },
    isString: {
      errorMessage: "Password must be a string",
    },
  },
  confirmPassword: {
    notEmpty: {
      errorMessage: "Confirm password cannot be empty",
    },
    isString: {
      errorMessage: "Confirm password must be a string",
    },
  },
  email: {
    notEmpty: {
      errorMessage: "Email cannot be empty",
    },
    isString: {
      errorMessage: "Email must be a string",
    },
    matches: {
      options: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/], // Regular expression to match gmail.com
      errorMessage: "Email must include @gmail.com",
    },
  },
  role: {
    optional: true,
    isIn: {
      options: [["user", "admin"]],
      errorMessage: "Role must be either 'user' or 'admin'",
    },
    notEmpty: {
      errorMessage: "Role cannot be empty",
    },
  },
  enrolledCourses: {
    optional: true,
    isArray: {
      errorMessage: "Enrolled course must be an array if provided",
    },
    custom: {
      options: (value) => {
        if (value.length < 0) return false;
      },
      errorMessage: "Enrolled course must not be empty if provided",
    },
    custom: {
      options: (value) => {
        if (value && value.length > 0) {
          return value.every((item) => typeof item === "string");
        }
      },
      errorMessage: "Enrolled course must be an array of string if provided",
    },
  },
};

export const logInValidationSchema = {
  username: {
    isString: {
      errorMessage: "Username must be a string",
    },
    notEmpty: {
      errorMessage: "Username cannot be empty",
    },
    isLength: {
      options: { min: 5, max: 24 },
      errorMessage: "Username must be 5-24 characters",
    },
  },
  password: {
    isString: {
      errorMessage: "Password must be a string",
    },
    notEmpty: {
      errorMessage: "Password cannot be empty",
    },
    isLength: {
      options: { min: 8, max: 20 },
      errorMessage: "Password must be 8-20 characters",
    },
  },
};

export const changeUsernameValidationSchema = {
  newUsername: {
    isLength: {
      options: { min: 5, max: 24 },
      errorMessage: "Username must be atleast 5-24 characters",
    },
    notEmpty: {
      errorMessage: "Username cannot be empty",
    },
    isString: {
      errorMessage: "Username must be a string",
    },
  },
};

export const changePasswordValidationSchema = {
  oldPassword: {
    notEmpty: {
      errorMessage: "Old password can not be empty",
    },
    isString: {
      errorMessage: "Old password must be a string",
    },
    isLength: {
      options: { min: 8, max: 20 },
      errorMessage: "Old password must be atleast 8-20 characters",
    },
  },
  newPassword: {
    notEmpty: {
      errorMessage: "New password can not be empty",
    },
    isString: {
      errorMessage: "New password must be a string",
    },
    isLength: {
      options: { min: 8, max: 20 },
      errorMessage: "New password must be atleast 8-20 characters",
    },
  },
};

export const changeEmailValidationSchema = {
  newEmail: {
    notEmpty: {
      errorMessage: "Email cannot be empty",
    },
    isString: {
      errorMessage: "Email must be a string",
    },
    matches: {
      options: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/], // Regular expression to match gmail.com
      errorMessage: "Email must be from gmail.com",
    },
  },
};
