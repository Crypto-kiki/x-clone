// index.ts
import express from "express";

import userRouter from "./routes/user";

const app = express();
const port = 3010;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("Hello Express TS!");
});

app.listen(port, () => {
  console.log(`📡 Server is listening on port: ${port}`);
});
