import cluster from "cluster";
import http from "http";
import { availableParallelism } from "os";
import "dotenv/config";
import { routes } from "./routes/route";

import { Users } from "./types/interface";
import { updateLocalUsers } from "./utils/updateUsers";
import { consoleColors } from "./utils/const";
import { proxyRequest } from "./utils/proxyRequest";

const serverPort = +process.env.PORT || 4000;
const numCPUs = availableParallelism() - 1;

if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork({ PORT_FOR_WORKER: `${serverPort + i + 1}` });
  }

  Object.values(cluster.workers).forEach((worker) => {
    worker.on("message", (msg) => {
      if (msg.type === "updateUsers") {
        Object.values(cluster.workers).forEach((worker) => worker?.send(msg));
      }
    });
  });

  const workerPorts = [...Array(numCPUs).keys()].map((i) => serverPort + i + 1);
  let roundRobinIndex = 0;
  const proxyServer = http.createServer((req, res) => {
    const workerPort = workerPorts[roundRobinIndex++ % numCPUs];
    proxyRequest(workerPort, req, res);
  });

  proxyServer.listen(serverPort, () => {
    console.log(consoleColors.turquoise, `Balancer is running on port ${serverPort}`);
  });
} else {
  const port = +process.env.PORT_FOR_WORKER;
  if (port) {
    http.createServer(routes).listen(port, () => {
      console.log(consoleColors.green, `Worker ${process.pid} started on port ${port}`);
    });
  }

  process.on("message", (msg) => {
    const { type } = msg as { type: string };
    if (type === "updateUsers") {
      const { data } = msg as { data: Users[] };
      updateLocalUsers(data);
    }
  });
}
