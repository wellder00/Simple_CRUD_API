import { IncomingMessage, ServerResponse } from "http";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  methodNotAllowed,
  handleError,
  updateUser,
} from "../repository/models";
import { getUrlParts } from "../service/getUrlParts";
import { isValidApiAndUsers } from "../utils/validate";

export const routes = async (req: IncomingMessage, res: ServerResponse) => {
  res.setHeader("Content-Type", "application/json");
  console.log(`Worker ${process.pid} start`);
  const { api, users, id, rest } = getUrlParts(req.url);

  if (isValidApiAndUsers(api, users, rest)) {
    if (req.method === "GET") {
      await (id ? getUserById(req, res, id) : getAllUsers(req, res));
    } else if (req.method === "POST") {
      createUser(req, res);
    } else if (req.method === "PUT") {
      updateUser(req, res, id);
    } else if (req.method === "DELETE") {
      deleteUser(req, res, id);
    } else {
      methodNotAllowed(res);
    }
  } else {
    handleError(res);
  }
};
