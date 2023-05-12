export const infoLog = (...params: any[]) => {
  //if (process.env.NODE_ENV !== "test") {
  console.log(...params);
  //}
};

export const errorLog = (...params: any[]) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(...params);
  }
};
