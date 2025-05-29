import { ValidationError } from "../types";

export default function processValidationErrors(
  errors: { path: string[]; message: string }[]
) {
  return errors.reduce(
    (prev: ValidationError, e: { path: string[]; message: string }) => {
      prev[e.path.join(".")] = e.message;
      return prev;
    },
    {} as ValidationError
  );
}
