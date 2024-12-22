const orderCtrl = require("../../../controllers/v1/vendor/searchController");

module.exports = [
  {url: "/search_order", method: "get", requireAuth: true, ctrl: orderCtrl.searchOrder},
]