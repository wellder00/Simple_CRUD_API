import { Users } from "../types/interface";
import { usersDb } from "../db/users";

export const updateLocalUsers = (newUsers: Users[]) => {
  usersDb.splice(0, usersDb.length, ...newUsers);
};
