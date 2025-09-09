import express from "express";
import fileupload from "express-fileupload";
import user from "./routes/userRoute.js";

const app = express();

// parse json and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
export default app;
