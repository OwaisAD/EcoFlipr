type UserInputWithPass = {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  password: string;
};

type UserInputWithoutPass = {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
};

export { UserInputWithPass, UserInputWithoutPass };
