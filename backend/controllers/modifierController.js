const Modifier = require("../models/Modifier");
const ModifierItem = require("../models/ModifierItem");
const { deleteFileFromS3UsingURL } = require("../utils/aws");

exports.addModifier = async (req, res) => {
  const { name, required, max, category } = req.body;
  const items = req.body.items ? JSON.parse(req.body.items) : [];

  const files = req.files;
  const vendorId = req.userId;
  try {
    const modifier = await Modifier.create({
      vendorId,
      name,
      required,
      max,
      category,
    });
    if (!modifier) {
      // Remove files uploaded on AWS because failed to create modifier.
      const promises = files?.map(async (file) => {
        await deleteFileFromS3UsingURL(file.location);
      });
      await Promise.all(promises);

      return res.status(400).json({ message: "Invalid values." });
    }

    // Create modifierItems
    let j = 0;
    const promises = items?.map(async (item) => {
      // Create modifierItem
      let addQuery = {};
      if (item.hasPhoto == true) {
        addQuery = {
          photo: files[j] ? files[j].location : "",
          name: item.name,
          price: item.price,
        };
        j++;
      } else if (item.hasPhoto == false) {
        addQuery = {
          photo: "",
          name: item.name,
          price: item.price,
        };
      }

      const modifierItem = await ModifierItem.create(addQuery);
      modifier.modifierItems.push(modifierItem);
    });

    await Promise.all(promises);

    await modifier.save();

    const populatedModifier = await Modifier.findById(modifier._id)
      .populate("modifierItems")
      .populate({
        path: "category",
        select: "category",
      });

    return res.status(200).json({ modifier: populatedModifier });
  } catch (error) {
    // Remove files uploaded on AWS because failed to create modifier.
    const promises = files.map(async (file) => {
      await deleteFileFromS3UsingURL(file.location);
    });

    await Promise.all(promises);
    return res.status(500).json({ message: error });
  }
};

exports.getModifiers = async (req, res) => {
  const vendorId = req.userId;
  try {
    // Find all modifiers
    const modifiers = await Modifier.find({ vendorId })
      .populate("modifierItems")
      .populate({
        path: "category",
        select: "category",
      });

    if (!modifiers) {
      return res.status(400).json({ message: "Failed to get all modifiers." });
    }

    return res.status(200).json({ modifiers });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.deleteModifier = async (req, res) => {
  const modifierId = req.query.id;

  try {
    // Validate
    if (typeof modifierId === "undefined") {
      return res
        .status(400)
        .json({ message: "Not found id of modifier to remove." });
    }

    const modifier = await Modifier.findByIdAndDelete(modifierId);
    if (!modifier) {
      return res.status(400).json({ message: "Invlid id." });
    }
    const promises = modifier.modifierItems.map(async (modifierItem) => {
      await deleteFileFromS3UsingURL(modifierItem.photo);
      await ModifierItem.findByIdAndDelete(modifierItem._id);
    });

    await Promise.all(promises);
    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

/*
  items:
  [
    {"name":"asdf", "price":20, "isCreate": false, id="66d5ca687eac1876c85e50a5", "isPhotoChanged": true},
    {"name":"qwer", "price":20, "isCreate": false, id="66d5ca687eac1876c85e50a4", "isPhotoChanged": false},
    {"name":"qwer", "price":20, "isCreate": true, "hasPhoto": true}

  ]
*/

exports.updateModifier = async (req, res) => {
  const modifierId = req.query.id;
  const vendorId = req.userId;

  const { name, required, max, category } = req.body;
  let items;
  try {
    items = JSON.parse(req.body.items);
  } catch (error) {
    return res.status(400).json({
      error: `Invalid JSON format for items. Please check your request body.`,
    });
  }
  // const items = JSON.parse(req.body.items);
  const files = req.files || [];

  try {
    // Validate
    if (typeof modifierId === "undefined") {
      return res
        .status(400)
        .json({ message: "Not found id of modifier to update." });
    }

    // Find the modifier
    const modifier = await Modifier.findByIdAndUpdate(modifierId, {
      name,
      required,
      max,
      category,
    });
    if (!modifier) {
      const promises = files.map(async (file) => {
        await deleteFileFromS3UsingURL(file.location);
      });
      await Promise.all(promises);
      return res.status(400).json({ message: "Not found modifier." });
    }

    let j = 0;
    const promises = items?.map(async (item) => {
      if (item.isCreate == true) {
        let addQuery;
        if (item.hasPhoto == true) {
          addQuery = {
            photo: files[j] ? files[j].location : "",
            name: item.name,
            price: item.price,
          };
          j++;
        } else if (item.hasPhoto == false) {
          addQuery = {
            name: item.name,
            price: item.price,
          };
        }
        const modifierItem = await ModifierItem.create(addQuery);
        modifier.modifierItems.push(modifierItem);
      } else if (item.isCreate == false) {
        const modifierItem = await ModifierItem.findById(item.id);
        if (!modifierItem) return;

        if (item.photoStatus === "changed") {
          deleteFileFromS3UsingURL(modifierItem.photo);
          modifierItem.photo = files[j] ? files[j].location : "";
          j++;
        } else if (item.photoStatus === "removed") {
          deleteFileFromS3UsingURL(modifierItem.photo);
          modifierItem.photo = "";
        }
        modifierItem.name = item.name;
        modifierItem.price = item.price;
        modifierItem.save();
      }
    });

    await Promise.all(promises);
    await modifier.save();

    const populatedModifier = await Modifier.findById(modifier._id)
      .populate("modifierItems")
      .populate({
        path: "category",
        select: "category",
      });

    return res.status(200).json({ modifier: populatedModifier });
  } catch (error) {
    console.log("updateModifier function.", error);
    return res.status(500).json({ message: error.message });
  }
};
