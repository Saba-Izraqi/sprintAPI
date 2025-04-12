import express from "express";
import './loggerOverwrite';

const app = express();
const DEFAULT_PORT = 3000;

app.use(express.json());

app.get("/health-check", (req, res) => {
  res.status(200).send({ status: "success" });
});

const startServer = (port: number = DEFAULT_PORT) => {
  app.listen(port, () => {
    console.info("server is listening at localhost:", port);
  });
};

export default startServer;
