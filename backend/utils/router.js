const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const multer = require("multer");
const upload = multer();

const bindRouter = (routes) => {
  const router = express.Router();
  routes.map((route) => {
    const handlers = route.requireAuth ?
      [verifyToken, route.ctrl] :
      route.isUploadApi ?
        [upload.none(), route.ctrl] :
        [route.ctrl];

    if (route.method === "get") {
      router.get(route.url, ...handlers);
    } else if (route.method === "post") {
      router.post(route.url, ...handlers);
    } else if (route.method === "put") {
      router.get(route.url, ...handlers);
    } else if (route.method === "delete") {
      router.delete(route.url, ...handlers);
    } else {
      throw new Error(`Unsupported method: ${route.method}`);
    }
  });
  return router;
};

module.exports = bindRouter;
