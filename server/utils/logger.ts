export const infoLog = (...params: any[]) => {
  console.log(...params);
};

export const errorLog = (...params: any[]) => {
  if (process.env.NODE_ENV !== "dev") {
    console.log(...params);
  }
};
