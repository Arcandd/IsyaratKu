export const enrollCourseValidationSchema = {
  courseId: {
    notEmpty: {
      errorMessage: "Course ID cannot be empty",
    },
    isString: {
      errorMessage: "Course ID must be a string",
    },
  },
};
