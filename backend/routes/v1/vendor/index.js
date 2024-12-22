const orderRoutes = require("./orderRoutes");
const locationRoutes = require("./locationRoutes");
const shopRoutes = require("./shopRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const searchRoutes = require("./searchRoutes");

module.exports = [
  /**
   * @Author: Daniel P
   * @example: {url: "/test", method: "get", requireAuth: false, isMulter: false, ctrl: "vendor/orderController@index"}
   *           api url of example data is /api/<version>/<module>/test
   * @requireAuth: optional, default value is false.
   * @isMulter: optional, default value is false.
   * @url: required
   * @method: required <get | post | put | delete>
   * @ctrl: required, <controller-file-path>@<method-name>
   */
  ...orderRoutes,
  ...locationRoutes,
  ...shopRoutes,
  ...dashboardRoutes,
  ...searchRoutes,
]