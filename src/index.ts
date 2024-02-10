import http from "http";
import { routes } from "./routes/route";
import "dotenv/config";
import { consoleColors } from "./utils/const";

const severPort = process.env.PORT || 4000;

export const server = http
  .createServer(routes)
  .listen(severPort, () => console.log(consoleColors.turquoise, `\n\rServer ${severPort} open`));
