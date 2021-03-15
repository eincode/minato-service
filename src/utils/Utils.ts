type ErrorName = "BadRequest" | "UnathorizedError";

function injectKeyToArray(key: string, value: any, arr: Array<any>) {
  return arr.map((member) => {
    member[key] = value;
    return member;
  });
}

function createError(name: ErrorName, message: string) {
  const error = new Error(message);
  error.name = name;
  return error;
}

export { injectKeyToArray, createError };
