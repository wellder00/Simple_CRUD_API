import { IncomingMessage, ServerResponse } from "http";
import { users } from "../db/users";
import { StatusCode, errorMessages } from "../utils/const";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { isValidUUID, isValidUser } from "../utils/validate";

export const getAllUsers = async (_: IncomingMessage, res: ServerResponse) => {
  try {
    res.writeHead(StatusCode.ok, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  } catch (error) {
    console.error(errorMessages.internalServerError);
    res.writeHead(StatusCode.internalServerError, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: errorMessages.internalServerError }));
  }
};

export const getUserById = async (_: IncomingMessage, res: ServerResponse, id: string) => {
  try {
    if (!isValidUUID(id)) {
      res.writeHead(StatusCode.badRequest, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: errorMessages.invalidUserId }));
      return;
    }
    const user = users.find((user) => user.id === id);
    if (!user) {
      res.writeHead(StatusCode.notFound, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: errorMessages.userNotFound }));
    } else {
      res.writeHead(StatusCode.ok, { "Content-Type": "application/json" });
      res.end(JSON.stringify(user));
    }
  } catch (error) {
    console.error("Something went wrong.", error);
    res.writeHead(StatusCode.internalServerError, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: StatusCode.internalServerError }));
  }
};

export const createUser = (req: IncomingMessage, res: ServerResponse) => {
  try {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const { username, age, hobbies } = JSON.parse(body);
        if (isValidUser(username, age, hobbies)) {
          res.writeHead(StatusCode.badRequest, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: errorMessages.missingFields }));
        } else {
          const newUser = {
            id: uuidv4(),
            username,
            age,
            hobbies,
          };
          users.push(newUser);
          res.writeHead(StatusCode.created, { "Content-Type": "application/json" });
          res.end(JSON.stringify(newUser));
        }
      } catch (error) {
        console.error("Invalid JSON in request body.");
        res.writeHead(StatusCode.badRequest, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: errorMessages.invalidBody }));
      }
    });
  } catch (error) {
    console.error(errorMessages.internalServerError);
    res.writeHead(StatusCode.internalServerError, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: errorMessages.internalServerError }));
  }
};

export const updateUser = (req: IncomingMessage, res: ServerResponse, id: string) => {
  try {
    if (!uuidValidate(id)) {
      res.writeHead(StatusCode.badRequest, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: errorMessages.invalidUserId }));
      return;
    }
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      res.writeHead(StatusCode.notFound, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: errorMessages.userNotFound }));
      return;
    }

    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const { username, age, hobbies } = JSON.parse(body);
        if (isValidUser(username, age, hobbies)) {
          res.writeHead(StatusCode.badRequest, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: errorMessages.missingFields }));
        } else {
          const updates = JSON.parse(body);
          users[userIndex] = { ...users[userIndex], ...updates };
          res.writeHead(StatusCode.ok, { "Content-Type": "application/json" });
          res.end(JSON.stringify(users[userIndex]));
        }
      } catch (error) {
        console.error("Invalid JSON in request body.", error);
        res.writeHead(StatusCode.badRequest, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: errorMessages.invalidRequestBody }));
      }
    });
  } catch (error) {
    console.error(errorMessages.internalServerError);
    res.writeHead(StatusCode.internalServerError, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: errorMessages.internalServerError }));
  }
};

export const deleteUser = (_: IncomingMessage, res: ServerResponse, id: string) => {
  try {
    const userId = id;

    if (!uuidValidate(userId)) {
      res.writeHead(StatusCode.badRequest, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: errorMessages.invalidUserId }));
      return;
    }

    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      res.writeHead(StatusCode.notFound, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: errorMessages.userNotFound }));
    } else {
      users.splice(userIndex, 1);
      res.writeHead(StatusCode.noContent);
      res.end();
    }
  } catch (error) {
    console.error(errorMessages.internalServerError);
    res.writeHead(StatusCode.internalServerError, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: errorMessages.internalServerError }));
  }
};

export const methodNotAllowed = (res: ServerResponse) => {
  try {
    res.writeHead(StatusCode.notFound, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: errorMessages.notFound }));
  } catch (error) {
    console.error(errorMessages.internalServerError);
    res.writeHead(StatusCode.internalServerError, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: errorMessages.internalServerError }));
  }
};

export const handleError = (res: ServerResponse) => {
  console.error(errorMessages.notFound);
  res.writeHead(StatusCode.notFound, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: errorMessages.notFound }));
};
