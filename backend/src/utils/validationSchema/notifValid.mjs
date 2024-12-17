export const createNotificationValidationSchema = {
  targetUser: {
    isLength: {
      options: { min: 24, max: 24 },
      errorMessage: "Notification target ID must be 24 characters",
    },
    notEmpty: {
      errorMessage: "Notification target ID can not be empty if provided",
    },
    isString: {
      errorMessage: "Notification target ID must be a string if provided",
    },
    optional: true,
  },
  title: {
    notEmpty: {
      errorMessage: "Notification title can not be empty",
    },
    isString: {
      errorMessage: "Notification title must be a string",
    },
  },
  content: {
    notEmpty: {
      errorMessage: "Notification content can not be empty",
    },
  },
};
