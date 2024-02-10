import cluster from "cluster";
import { Users } from "../types/interface";

export const broadcastUpdate = async (usersDb: Users[]) => {
  if (cluster.isWorker) {
    process.send({ type: "updateUsers", data: usersDb });
  }
};