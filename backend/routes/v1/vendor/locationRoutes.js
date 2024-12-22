const locationCtrl = require("../../../controllers/v1/vendor/locationController");

module.exports = [
  {url: "/locations", method: "get", requireAuth: true, ctrl: locationCtrl.getLocations},
  {url: "/location/:_id", method: "get", requireAuth: true, ctrl: locationCtrl.getLocationById},
]