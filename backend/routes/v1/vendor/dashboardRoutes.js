const dashboardCtrl = require("../../../controllers/v1/vendor/dashboardController");

module.exports = [
  {url: "/dashboard/get_dashboard_info", method: "get", requireAuth: false, ctrl: dashboardCtrl.getDashboardInfo},

]