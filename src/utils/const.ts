
export const errorMessages = {
  invalidUserId: "Invalid user ID.",
  userNotFound: "User not found",
  missingFields: "Body does not contain required fields",
  invalidRequestBody: "Invalid request body. Please check the JSON format and required fields.",
  invalidBody: "Invalid JSON format in request body",
  internalError: "Something went wrong.",
  somethingWrong: "Something went wrong.",
  notFound: "Not found",
  internalServerError: "Internal Server Error. Please try again later.",
};

export const enum StatusCode {
  ok = 200,
  created = 201,
  noContent = 204,
  badRequest = 400,
  notFound = 404,
  internalServerError = 500,
}

export const consoleColors = {
  green: "\x1b[32m%s\x1b[0m",
  turquoise: "\x1b[36m%s\x1b[0m",
  blue: "\x1b[34m%s\x1b[0m",
  red: "\x1b[31m%s\x1b[0m",
};