const orderCtrl = require("../../../controllers/v1/merchant/orderController");

module.exports = [
  {url: "/order/list", requireAuth: true, method: "get", ctrl: orderCtrl.getOrders},
  {url: "/order/item/:_id", requireAuth: true, method: "get", ctrl: orderCtrl.getOrderById},
  {url: "/order/confirm_order/:_id", requireAuth: true, method: "post", ctrl: orderCtrl.confirmOrder},
  {url: "/order/cancel_order/:_id", requireAuth: true, method: "post", ctrl: orderCtrl.cancelOrder},
  {url: "/order/out_of_stock", requireAuth: true, method: "post", ctrl: orderCtrl.makeItemMakeOfStock},
  {url: "/order/refund_order_item/:_id", requireAuth: true, method: "post", ctrl: orderCtrl.refundOrderItem},
  {url: "/order/replaceable_items", requireAuth: true, method: "get", ctrl: orderCtrl.getReplaceableItems},
  {url: "/order/replace_item", requireAuth: true, method: "post", ctrl: orderCtrl.replaceItem},
];