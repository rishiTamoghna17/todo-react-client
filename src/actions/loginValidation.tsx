import { users } from "../assets/dummyUser";

export interface User {
  id: number;
  name: string;
  password: string;
  email: string;
  token: string;
}

interface LoginValidationResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface ValidationResult {
  success: boolean;
  user?: User;
  error?: string;
}

export const loginValidation = (
  email: string,
  password: string
): LoginValidationResponse => {
  const user = users.find((user: User) => user.email === email);
  if (user) {
    if (user.password === password) {
      return { success: true, user };
    } else {
      return { success: false, error: "Incorrect password" };
    }
  } else {
    return { success: false, error: "User not found" };
  }
};
