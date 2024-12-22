const Notification = require("../models/Notification");

const addNotifications = async (userId, text, type, role) => {
  Notification.create({
    userId: userId,
    userRole: role,
    text: text,
    type: type,
  });
};

exports.getNotifications = async (req, res) => {
  const userId = req.userId;
  const userRole = req.userRole;
  const query = req.query;
  console.log("reqQuery:", query);

  // Add notification
  addNotifications(
    userId,
    "pickup <a href='./login'></a>text",
    "pickup",
    userRole
  );

  // Get queries
  const pageSize = query.pageSize ? query.pageSize : 7;
  const page = query.page ? query.page : 1;
  const searchKey = query.searchKey ? query.searchKey : null;
  const filter = query.filter ? query.filter : "drop_off";
  const sort = query.sort ? query.sort : "new_first";

  try {
    // Set queries
    const offset = (page - 1) * pageSize;

    // Set sort query
    let sortQuery;
    console.log(sort);
    switch (sort) {
      case "new_first":
        sortQuery = { createdAt: 1 };
        break;
      case "old_first":
        sortQuery = { createdAt: -1 };
        break;
      case "a_to_z":
        sortQuery = { text: 1 };
        break;
    }

    // Set find query
    if (searchKey) {
      findQuery = {
        userId: userId,
        userRole: userRole,
        type: filter,
        text: { $regex: searchKey },
      };
    } else {
      findQuery = {
        userId: userId,
        userRole: userRole,
        type: filter,
      };
    }

    const notificationRecords = await Notification.find(findQuery)
      .sort(sortQuery)
      .skip(offset)
      .limit(pageSize);
    const totalResults = await Notification.countDocuments(findQuery);

    // Convert records to array
    let notifications = [];
    notificationRecords.map((notificationRecord) => {
      notifications.push({
        _id: notificationRecord._id,
        type: notificationRecord.type,
        text: notificationRecord.text,
      });
    });

    return res.status(200).json({ notifications, totalResults });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};
