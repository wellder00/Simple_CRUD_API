import http from "http";
import { routes } from "./routes/route";
import "dotenv/config";
import { port } from "./utils/const";

export const server = http
  .createServer(routes)
  .listen(port, () => console.log(`Server ${port} open`));
