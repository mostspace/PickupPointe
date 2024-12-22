const menuCtrl = require("../../../controllers/v1/merchant/menuController");

module.exports = [
  {url: "/menu/list", requireAuth: true, method: "get", ctrl: menuCtrl.getMenus},
  {url: "/menu/modifiers", requireAuth: true, method: "get", ctrl: menuCtrl.getModifiers},
  {url: "/menu/set-modifier-out-of-stock", requireAuth: true, method: "post", ctrl: menuCtrl.setModifierOutOfStock},
];