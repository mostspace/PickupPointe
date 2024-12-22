require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const routes = require("./routes/index");
const v1Routes = require("./routes/v1");
const { createChatSocketServer } = require("./utils/socket");
const { createServer } = require("https");
// const socketHandler = require("./utils/rt_socket");
const socketHandler = require("./socket");
const cronjob = require("./cronjob");
const {updateCache} = require("./utils/cache");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// const server = createServer(app);
// createChatSocketServer(server);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  })
);
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// User routes
app.use("/api/v1", routes);
app.use("/api/v1", v1Routes);

app.get('/', (req, res) => {
  res.send('Pickup Pointe backend api!');
})
// https.createServer(app).listen(443, () => {
//   console.log("Express server listening on port 443");
// });

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
socketHandler(server);
cronjob.run();
updateCache();