import { createServer } from "node:http";
import { resolve } from "node:path";
import handler from "serve-handler";

const port = env.VITE_PORT ?? 5173
const publicDir = resolve(process.cwd(), "build", "client");

const server = createServer((request, response) =>
  handler(request, response, {
    public: publicDir,
    rewrites: [{ source: "**", destination: "/index.html" }],
  }),
);

server.listen(port, () => {
  console.log(`Web is running on http://localhost:${port}`);
});
