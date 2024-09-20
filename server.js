import jsonServer from "json-server";
import cors from "cors";

const server = jsonServer.create();
const router = jsonServer.router("./data/cities.json");
const middleware = jsonServer.defaults();
const port = process.env.PORT || 9000;

server.use(cors());
server.use(middleware);
server.use(jsonServer.rewriter({ "/api/*": "/$1" }));
server.use(router);
server.listen(port, () => {
  console.log(`Server is active at ${port}`);
});
