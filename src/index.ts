import http from "http";
import { routes } from "./routes/route";
import "dotenv/config";

const severPort = process.env.PORT || 4000;

export const server = http
  .createServer(routes)
  .listen(severPort, () => console.log(`Server ${severPort} open`));
