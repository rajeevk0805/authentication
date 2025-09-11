import express from "express";
import cookieParser from "cookie-parser";
import fileupload from "express-fileupload";
import user from "./routes/userRoute.js";
import center from "./routes/centerRoute.js";
import appointmentroute from "./routes/appointmentRoute.js";

const app = express();

// parse json and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static("public"));
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true,
    parseNested: true,
  })
);

app.get("/", (req, res) => {
  res.send("Server is running! ^^");
});

app.use("/api/users", user);
app.use("/api/center", center);
app.use("/api/appointment", appointmentroute);

export default app;
