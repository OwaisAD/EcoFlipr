import { validatePassword } from "../utils/validator";

test("validatePassword returns true when password is correct", () => {
  expect(validatePassword("test1234")).toBe(true);
});