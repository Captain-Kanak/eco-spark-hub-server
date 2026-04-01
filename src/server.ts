import app from "./app.js";
import { env } from "./config/env.js";

const port = Number(env.PORT);

const server = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

server();
