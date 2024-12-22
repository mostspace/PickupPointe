const orderCtrl = require("../../../controllers/v1/vendor/orderController");

module.exports = [
  {url: "/orders", method: "get", requireAuth: true, ctrl: orderCtrl.getOrders},
  {url: "/get_order_calendar", method: "get", requireAuth: true, ctrl: orderCtrl.getOrderCalendar},
  {url: "/order/:_id", method: "get", requireAuth: true, ctrl: orderCtrl.getOrderById},

  {url: "/order/save_service_availability", method: "post", requireAuth: true, ctrl: orderCtrl.saveServiceAvailability},
]