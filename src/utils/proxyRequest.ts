import http, { IncomingMessage, ServerResponse } from "http";

export const proxyRequest = (port: number, req: IncomingMessage, res: ServerResponse) => {
  const proxy = http.request(
    {
      hostname: "localhost",
      port: port,
      path: req.url,
      method: req.method,
      headers: req.headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    },
  );

  req.pipe(proxy, { end: true });
};
