const orderCtrl = require("../../../controllers/v1/shopper/orderController");

module.exports = [
  {url: "/orders", method: "get", requireAuth: true, ctrl: orderCtrl.getOrders},
  {url: "/order/:_id", method: "get", requireAuth: true, ctrl: orderCtrl.getOrderById},
  {url: "/get_active_orders", method: "get", requireAuth: true, ctrl: orderCtrl.getActiveOrders},
  {url: "/withdraw_order/:_id", method: "post", requireAuth: true, ctrl: orderCtrl.withdrawOrder},
];