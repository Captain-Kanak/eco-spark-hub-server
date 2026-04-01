import app from "./app.js";
import { env } from "./config/env.js";

const port = process.env.PORT || env.PORT || 5000;

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
