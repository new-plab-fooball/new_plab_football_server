import express from "express";
import cors from "cors";
import userRouter from "./router/user";
import authRouter from "./router/auth";
import cookies from "cookie-parser";

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:3001"],
  })
);

app.use(cookies());

app.use("/user", userRouter);
app.use("/auth", authRouter);

app.listen("8000", () => {
  console.log(`
  ################################################
  🛡️  Server listening on port: 8000
  ################################################
`);
});
