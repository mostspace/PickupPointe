// Models
const Shopper = require("../models/Shopper");
const Vendor = require("../models/Vendor");

exports.getCurrentUser = async (req, res) => {
  const userId = req.userId;
  const userRole = req.userRole;

  try {
    // Find the user
    let user;
    if (userRole == "shopper") {
      user = await Shopper.findById(userId).select("-password");
    } else if (userRole == "vendor") {
      user = await Vendor.findById(userId).select("-password");
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.log("getCurrentUser:", error);
    return res.status(500).json({ message: error });
  }
};

exports.getUserList = async (req, res) => {
  try {
    let users;
    const searchQuery = req.query.search ? req.query.search.replace(/\s+/g, '') : '';
    let search = {};
    if (searchQuery) {
      search = {
        $or: [
          {
            $expr: {
              $regexMatch: {
                input: { $concat: ["$firstName", "$lastName"] },
                regex: searchQuery,
                options: "i",
              },
            },
          },
          {
            $expr: {
              $regexMatch: {
                input: { $concat: ["$lastName", "$firstName"] },
                regex: searchQuery,
                options: "i",
              },
            },
          },
          { firstName: { $regex: searchQuery, $options: "i" } },
          { lastName: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
        ],
      };
    }
    if (req.query.userRole === "shopper") {
      // users = await Shopper.find(search).find({ _id: { $ne: 1 } });
      users = await Vendor.find(search).find({ _id: { $ne: req.query.userId } });
    } else {
      users = await Shopper.find(search).find({ _id: { $ne: req.query.userId } });
    } 
    res.status(200).send(users);
  } catch (error) {
    console.log("get user list", error);
  }
};
