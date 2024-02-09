import cluster from "cluster";
import http from "http";
import { availableParallelism } from "os";
import "dotenv/config";
import { routes } from "./routes/route";

const serverPort = +process.env.PORT || 4000;


const numCPUs = availableParallelism() - 1;

if (cluster.isPrimary) {
  console.log(`\n\rMain ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    worker.send({ port: serverPort + i + 1 });
  }
} else {
  process.on("message", (msg) => {
    const { port } = msg as { port: number };
    if (port) {
      http.createServer(routes).listen(port);
      console.log(`Worker ${process.pid} started on port ${port}`);
    }
  });
}
