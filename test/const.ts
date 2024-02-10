import { Users } from "../src/types/interface";

export const url = "/api/users";

export const user: Users = {
  id: "75100618-6be6-4f0d-a322-ce5f8a301819",
  username: "Vladislav",
  age: 35,
  hobbies: ["playTheGuitar", "badminton"],
};

export const updatedUser = { ...user, username: "Junior", hobbies: ["nothing"] };

export const invalidId = "123";

export const nonExistentUserId = "e32e8b92-acce-40ba-a4a9-6ed8baaee5f8";