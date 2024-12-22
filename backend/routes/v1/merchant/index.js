const authRoutes = require("./authRoutes");
const orderRoutes = require("./orderRoutes");
const menuRoutes = require("./menuRoutes");
const settingRoutes = require("./settingRoutes");

module.exports = [
  /**
   * @Author: Daniel P
   * @example: {url: "/test", method: "get", requireAuth: false, isMulter: false, ctrl: "shopper/orderController@index"}
   *           api url of example data is /api/<version>/<module>/test
   * @requireAuth: optional, default value is false.
   * @isMulter: optional, default value is false.
   * @url: required
   * @method: required <get | post | put | delete>
   * @ctrl: required, <controller-file-path>@<method-name>
   */
  ...authRoutes,
  ...menuRoutes,
  ...orderRoutes,
  ...settingRoutes,
]