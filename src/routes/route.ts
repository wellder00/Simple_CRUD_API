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
import { consoleColors } from "../utils/const";

export const routes = async (req: IncomingMessage, res: ServerResponse) => {
  res.setHeader("Content-Type", "application/json");
  console.log(consoleColors.blue, `Worker №${process.pid} works`);
  res.setHeader("X-Worker-PID", process.pid.toString());
  const { api, users, id, rest } = getUrlParts(req.url);
  if (isValidApiAndUsers(api, users, rest)) {
    if (req.method === "GET") {
      await (id ? getUserById(req, res, id) : getAllUsers(req, res));
    } else if (req.method === "POST") {
      await createUser(req, res);
    } else if (req.method === "PUT") {
      await updateUser(req, res, id);
    } else if (req.method === "DELETE") {
      await deleteUser(req, res, id);
    } else {
      methodNotAllowed(res);
    }
  } else {
    handleError(res);
  }
};
