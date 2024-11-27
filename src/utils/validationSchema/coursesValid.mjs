export const addCourseValidationSchema = {
  title: {
    notEmpty: {
      errorMessage: "Course title can not be empty",
    },
    isString: {
      errorMessage: "Course title must be a string",
    },
  },
  description: {
    notEmpty: {
      errorMessage: "Course description can not be empty",
    },
    isString: {
      errorMessage: "Course description must be a string",
    },
  },
  status: {
    notEmpty: {
      errorMessage: "Course status can not be empty",
    },
    isIn: {
      options: [["Has not started", "In Progress", "Completed"]],
      errorMessage:
        "Course status must be either Has not started, In Progress or Completed",
    },
    optional: true,
  },
  type: {
    notEmpty: {
      errorMessage: "Course type can not be empty",
    },
    isIn: {
      options: [["Free", "Paid"]],
      errorMessage: "Course must be either 'Free' or 'Paid'",
    },
    optional: true,
  },
  lessons: {
    optional: true,
    isArray: {
      errorMessage: "Course lessons must be an array if provided",
    },
    custom: {
      options: (value) => {
        if (value.length < 0) return false;
      },
      errorMessage: "Lesson must not be empty if provided",
    },
    custom: {
      options: (value) => {
        if (value && value.length > 0) {
          return value.every((item) => typeof item === "string");
        }
      },
      errorMessage: "Lesson must be an array of string if provided",
    },
  },
  price: {
    notEmpty: {
      errorMessage: "Course price can not be empty if provided",
    },
    isInt: {
      errorMessage: "Course price must be an integer if provided",
    },
    optional: true,
  },
};

export const addLessonValidationSchema = {
  courseId: {
    notEmpty: {
      errorMessage: "The course ID of the lesson can not be empty",
    },
    isString: {
      errorMessage: "The course ID of the lesson must be a string",
    },
  },
  title: {
    notEmpty: {
      errorMessage: "The title of the lesson can not be empty",
    },
    isString: {
      errorMessage: "The title of the lesson must be a string",
    },
  },
  material: {
    notEmpty: {
      errorMessage: "The material of the lesson can not be empty",
    },
  },
};
