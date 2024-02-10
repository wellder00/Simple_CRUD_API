export const isValidApiAndUsers = (api: string, users: string, rest: string[]): boolean => {
  return `${api}/${users}` === "api/users" && rest.length === 0;
};

export const isValidUUID = (id: string) => {
  const regexExp =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return regexExp.test(id);
};

export const isValidUser = (username: string, age: number, hobbies: string[]) => {
  return (
    !username ||
    typeof username !== "string" ||
    typeof age !== "number" ||
    !hobbies ||
    !Array.isArray(hobbies) ||
    !hobbies.every(hobby => typeof hobby === "string")
  );
};