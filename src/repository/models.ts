import { IncomingMessage, ServerResponse } from "http";
import { usersDb } from "../db/users";
import { StatusCode, errorMessages } from "../utils/const";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { isValidUUID, isValidUser } from "../utils/validate";
import { broadcastUpdate } from "../utils/updateObj";


export const getAllUsers = async (_: IncomingMessage, res: ServerResponse) => {
  try {
    res.writeHead(StatusCode.ok, { "Content-Type": "application/json" });
    res.end(JSON.stringify(usersDb));
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
    const user = usersDb.find((user) => user.id === id);
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

export const createUser = async(req: IncomingMessage, res: ServerResponse) => {
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
          
          usersDb.push(newUser);
          broadcastUpdate(usersDb)
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

export const updateUser = async(req: IncomingMessage, res: ServerResponse, id: string) => {
  try {
    if (!uuidValidate(id)) {
      res.writeHead(StatusCode.badRequest, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: errorMessages.invalidUserId }));
      return;
    }
    const userIndex = usersDb.findIndex((user) => user.id === id);
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
          usersDb[userIndex] = { ...usersDb[userIndex], ...updates };
          broadcastUpdate(usersDb)
          res.writeHead(StatusCode.ok, { "Content-Type": "application/json" });
          res.end(JSON.stringify(usersDb[userIndex]));
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

export const deleteUser = async(_: IncomingMessage, res: ServerResponse, id: string) => {
  try {
    const userId = id;

    if (!uuidValidate(userId)) {
      res.writeHead(StatusCode.badRequest, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: errorMessages.invalidUserId }));
      return;
    }

    const userIndex = usersDb.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      res.writeHead(StatusCode.notFound, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: errorMessages.userNotFound }));
    } else {
      usersDb.splice(userIndex, 1);
      broadcastUpdate(usersDb)
      res.writeHead(StatusCode.noContent);
      res.end();
    }
  } catch (error) {
    console.error(errorMessages.internalServerError);
    res.writeHead(StatusCode.internalServerError, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: errorMessages.internalServerError }));
  }
};

export const methodNotAllowed = async(res: ServerResponse) => {
  try {
    res.writeHead(StatusCode.notFound, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: errorMessages.notFound }));
  } catch (error) {
    console.error(errorMessages.internalServerError);
    res.writeHead(StatusCode.internalServerError, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: errorMessages.internalServerError }));
  }
};

export const handleError = async(res: ServerResponse) => {
  console.error(errorMessages.notFound);
  res.writeHead(StatusCode.notFound, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: errorMessages.notFound }));
};


