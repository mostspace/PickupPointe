const Item = require("../models/Item");
const ItemCategory = require("../models/ItemCategory");
const Shop = require("../models/Shop");
const Metric = require("../models/Metric");
const ItemStock = require("../models/ItemStock");
const ItemVariant = require("../models/ItemVariant");
const {cache} = require("../utils/cache");

const { deleteFileFromS3UsingURL } = require("../utils/aws");

// Item APIs
exports.addItem = async (req, res) => {
  const photo = req.file ? req.file.location : "";

  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      try {
        req.body[key] = JSON.parse(req.body[key]);
      } catch (e) {
        console.log(`Failed to parse ${key}: ${req.body[key]}`);
      }
    }
  }

  const vendorId = req.userId;

  const {
    name,
    itemId,
    isFeatured,
    description,
    nutritionalInformation,
    categories,
    locations,
    variants,
    perMetric,
    defaultPrice,
    inclusions,
    importantNotes,
    isUseTimePromotion,
    timePromotions,
    isInStock,
    sourceItemSales,
    attributes,
    modifiers,
  } = req.body;

  try {
    // Validate
    if (typeof name === "undefined") {
      return res.status(400).json({ message: "Bad request." });
    }

    const itemCheck = await Item.findOne({ vendorId, itemId });
    if (itemCheck) {
      await deleteFileFromS3UsingURL(photo);
      return res.status(400).json({ message: "Already exists" });
    }
    const item = await Item.create({
      vendorId,
      photo,
      name,
      itemId,
      isFeatured,
      categories: categories || [],
      defaultPrice,
      perMetric,
      variants,
      description,
      nutritionalInformation,
      isInStock,
      sourceItemSales,
      attributes,
      isUseTimePromotion,
      timePromotions: timePromotions || [],
      modifiers,
      inclusions,
      locations,
      importantNotes,
    });

    if (!item) {
      return res.status(400).json({ message: "Invalid parameters." });
    }

    const stockInsertData = locations.map(location => ({
      location: location._id,
      item: item._id,
      currentQuantity: location.maxQty
    }));
    await ItemStock.insertMany(stockInsertData);

    const populatedItem = await (
      await item.populate("categories")
    ).populate({ path: "perMetric", select: "name" });

    return res.status(200).json({ item: populatedItem });
  } catch (error) {
    console.log("addItem error", error);
    await deleteFileFromS3UsingURL(photo);
    return res.status(500).json({ message: error.message });
  }
};
/*
[
  {
    name: "promotion1",
    type: 1,
    value: 20,
    from: {
      hour: 10,
      minute: 0,
    },
    to: {
      hour: 21,
      minute: 30,
    },
    frequencyType: 2,
    scheduleType: 3,
    scheduleDate: [1, 2, 3, 4],
  },
];
*/
exports.getAll = async (req, res) => {
  const vendorId = req.userId;

  const query = req.query;
  const pageSize = query.pageSize ? query.pageSize : 5;
  const page = query.page ? query.page : 1;
  const searchKey = query.searchKey ? query.searchKey : null;
  const categoryIds = req.body.categories ? req.body.categories : [];
  const locationIds = req.body.locations ? req.body.locations : [];

  try {
    let findQuery = {
      vendorId,
    };
    const offset = (page - 1) * pageSize;
    if (searchKey) {
      findQuery.name = { $regex: searchKey, $options: "i" };
    }

    if (categoryIds.length !== 0) {
      findQuery.categories = { $all: categoryIds };
    }
    if (locationIds.length !== 0) {
      findQuery.locations = {
        $elemMatch: { _id: { $in: locationIds } },
      };
    }
    console.log("findQuery:", findQuery);
    // Find the vendor's items.
    const items = await Item.find(findQuery)
      .skip(offset)
      .limit(pageSize)
      .populate({ path: "categories" })
      .populate({ path: "locations.locationId" })
      .populate({ path: "modifiers" });

    const totalResults = await Item.countDocuments(findQuery);
    return res.status(200).json({ totalResults, items });
  } catch (error) {
    console.log("getAll endpoint:", error);
    return res.status(500).json({ message: error });
  }
};

exports.deleteItem = async (req, res) => {
  const itemId = req.params.id;
  try {
    // Find the item to remove
    const item = await Item.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(404).json({ message: "Not found item." });
    }

    return res.status(200).json({});
  } catch (error) {
    console.log("removeItem:", error);
    return res.status(500).json({ message: error });
  }
};

exports.getItemById = async (req, res) => {
  const id = req.params.id;
  if (typeof id === "undefined") {
    return res.status(400).json({ message: "Not found id in your url." });
  }

  try {
    let item = await Item.findById(id)
      .populate("locations.locationId", "-createdAt -updatedAt")
      .populate("categories")
      .lean();
    
    item.locations = item.locations.map(location => {
      return {
        ...location,
        currentQuantity: cache.get(`${location.locationId?._id}.${id}`) || 0
      };
    });

    if (!item) {
      return res.status(404).json({ message: "Invalid id." });
    }

    return res.status(200).json({ item });
  } catch (error) {
    console.log("getItemById:", error);
    return res.status(500).json({ message: error });
  }
};

exports.updateItem = async (req, res) => {
  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      try {
        req.body[key] = JSON.parse(req.body[key]);
      } catch (e) {
        console.log(`Failed to parse ${key}: ${req.body[key]}`);
      }
    }
  }

  const id = req.params.id;
  if (typeof id === "undefined") {
    if (req.file) {
      deleteFileFromS3UsingURL(req.file.location);
    }
    return res.status(404).json({ message: "Add id to update" });
  }

  const {
    name,
    itemId,
    isFeatured,
    description,
    attributes,
    nutritionalInformation,
    categories,
    locations,
    taxRate,
    variants,
    perMetric,
    defaultPrice,
    inclusions,
    importantNotes,
    timePromotions,
    isUseTimePromotion,
    isInStock,
    sourceItemSales,
    modifiers,
    photoStatus,
  } = req.body;
  try {
    const updateQuery = {
      name,
      itemId,
      isFeatured,
      description,
      nutritionalInformation,
      attributes,
      categories,
      locations,
      taxRate,
      variants,
      perMetric,
      defaultPrice,
      inclusions,
      importantNotes,
      timePromotions,
      isUseTimePromotion,
      isInStock,
      sourceItemSales,
      modifiers,
    };

    // Find the item
    const item = await Item.findById(id);
    if (!item) {
      if (req.file) {
        deleteFileFromS3UsingURL(req.file.location);
      }
      return res.status(404).json({ message: "Invalid id" });
    }

    if (photoStatus == "changed") {
      updateQuery.photo = req.file ? req.file.location : "";
      deleteFileFromS3UsingURL(item.photo);
    }

    const updatedItem = await Item.findByIdAndUpdate(id, updateQuery, {
      new: true,
    })
      .populate("locations.locationId")
      .populate("categories");

    // TODO: Update the current stock when the vendor modifies the stock amount.
    // TODO: Update the isInStock field when the vendor modifies it.

    const bulkOps = locations.map(location => {
      cache.set(`${location.locationId}.${id}`, location.currentQuantity);
      return {
        updateOne: {
          filter: {item: id, location: location.locationId},
          update: {
            $set: {currentQuantity: location.currentQuantity},
            $setOnInsert: {location: location.locationId, item: id}
          },
          upsert: true
        }
      }
    });

    if (bulkOps.length > 0) {
      await ItemStock.bulkWrite(bulkOps);
    }

    return res.status(200).json({ item: updatedItem });
  } catch (error) {
    console.log("updateItem function.", error);
    return res.status(500).json({ message: error });
  }
};

// Item category apis
exports.addItemCategory = async (req, res) => {
  const { category } = req.body;
  const vendorId = req.userId;
  try {
    // Validate
    if (typeof category === "undefined" || category === "") {
      return res.status(400).json({ message: "Invalid category." });
    }
    const itemCategory = await ItemCategory.findOne({ vendorId, category });
    if (itemCategory) {
      return res.status(400).json({ message: "Already exist" });
    }

    const newCategory = await ItemCategory.create({ vendorId, category });
    if (!newCategory) {
      return res.status(400).json({ message: "Failed to create category." });
    }

    return res.status(200).json({ category: newCategory });
  } catch (error) {
    console.log("addItemCategory function.", error);
    return res.status(500).json({ message: error });
  }
};

exports.deleteItemCategory = async (req, res) => {
  const id = req.params.id;
  const vendorId = req.userId;
  try {
    // Validate
    if (typeof id === "undefined") {
      return res.status(400).json({ message: "Please add item category id." });
    }

    // Find and delete
    const itemCategory = await ItemCategory.findByIdAndDelete(id);
    if (!itemCategory) {
      return res.status(400).json({ message: "Invalid id." });
    }

    // Find all categories
    const itemCategories = await ItemCategory.find({ vendorId });
    return res.status(200).json({ itemCategories });
  } catch (error) {
    console.log("removeItemCategory function.", error);
    return res.status(500).json({ message: "Failed to remove category." });
  }
};

exports.updateItemCategory = async (req, res) => {
  const id = req.params.id;
  const { category } = req.body;
  const vendorId = req.userId;
  try {
    // Validate
    if (typeof id === "undefined" || typeof category === "undefined") {
      return res.status(400).json({ message: "Invalid params." });
    }

    // Find and delete
    const itemCategory = await ItemCategory.findByIdAndUpdate(id, { category });
    if (!itemCategory) {
      return res.status(400).json({ message: "Invalid id." });
    }

    // Find all categories
    const itemCategories = await ItemCategory.find({ vendorId });
    return res.status(200).json({ itemCategories });
  } catch (error) {
    console.log("updateItemCategory function.", error);
    return res.status(500).json({ message: error });
  }
};

exports.getItemCategories = async (req, res) => {
  const vendorId = req.userId;
  try {
    // Find all item categories.
    const itemCategories = await ItemCategory.find({ vendorId });
    return res.status(200).json({ itemCategories });
  } catch (error) {
    console.log("getItemCategories function.", error);
    return res.status(500).json({ message: error });
  }
};

exports.addMetric = async (req, res) => {
  const { name } = req.body;
  if (typeof name === "undefined") {
    return res.status(400).json({ message: "Bad request" });
  }
  try {
    const metric = await Metric.create({ name });
    if (!metric) {
      return res.status(400).json({ message: "Bad request" });
    }
    return res.status(201).json({ metric });
  } catch (error) {
    console.log("addMetric error", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllMetrics = async (req, res) => {
  try {
    const metrics = await Metric.find({}).sort({ name: 1 });
    return res.status(200).json({ metrics });
  } catch (error) {
    console.log("getMetric error", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteMetricById = async (req, res) => {
  const metricId = req.params.id;
  try {
    const metric = await Metric.findByIdAndDelete(metricId);
    if (!metric) {
      return res.status(404).json({ message: "Invalid id" });
    }
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log("deleteMetricById error", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateMetricById = async (req, res) => {
  const metricId = req.params.id;
  const { name } = req.body;
  try {
    const metric = await Metric.findOne({ name });
    if (metric) {
      return res.status(404).json({ message: "Already exists" });
    }
    const updatedMetric = await Metric.findByIdAndUpdate(
      metricId,
      { name },
      { new: true }
    );
    if (!updatedMetric) {
      return res.status(404).json({ message: "Bad request" });
    }
    return res.status(200).json({ metric: updatedMetric });
  } catch (error) {
    console.log("deleteMetricById error", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.addVariant = async (req, res) => {
  const { name } = req.body;
  if (typeof name === "undefined") {
    return res.status(400).json({ message: "Bad request" });
  }
  const vendorId = req.userId;
  try {
    const variant = await ItemVariant.findOne({ vendorId, name });
    if (variant) {
      return res.status(400).json({ message: "Already exists" });
    }
    const newVariant = await ItemVariant.create({ vendorId, name });
    if (!newVariant) {
      return res.status(400).json({ message: "Failed to add variant" });
    }
    const variantObj = newVariant.toObject();
    delete variantObj.vendorId;
    delete variantObj.__v;
    return res.status(200).json({ variant: variantObj });
  } catch (error) {
    console.log("addVariant error:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllVariants = async (req, res) => {
  const vendorId = req.userId;
  try {
    const variants = await ItemVariant.find({ vendorId }).select(
      "-__v -vendorId"
    );
    return res.status(200).json({ variants });
  } catch (error) {
    console.log("getAllVariants error:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteVariant = async (req, res) => {
  const variantId = req.params.id;
  const vendorId = req.userId;
  try {
    const variant = await ItemVariant.findOneAndDelete({
      vendorId,
      _id: variantId,
    });
    if (!variant) {
      return res
        .status(404)
        .json({ message: "Not exist variant or not yours" });
    }
    return res.status(200).json({ message: "Deleted" });
  } catch (error) {
    console.log("deleteVariant error:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateVariant = async (req, res) => {
  const vendorId = req.userId;
  const variantId = req.params.id;
  const { name } = req.body;
  if (typeof name === "undefined") {
    return res.status(400).json({ message: "Bad request" });
  }
  try {
    const variant = await ItemVariant.findOneAndUpdate(
      { vendorId, _id: variantId },
      { name },
      { new: true }
    ).select("-vendorId -__v");
    if (!variant) {
      return res
        .status(404)
        .json({ message: "Not exist variant or not yours" });
    }

    return res.status(200).json({ variant });
  } catch (error) {
    console.log("updateVariant error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// =============Shop=============

exports.getItemsByShopId = async (req, res) => {
  const shopId = req.params.id;

  const query = req.query;
  const pageSize = query.pageSize ? query.pageSize : 5;
  const page = query.page ? query.page : 1;
  const searchKey = query.searchKey ? query.searchKey : null;
  const categoryIds = req.body.categories ? req.body.categories : [];
  const locationIds = req.body.locations ? req.body.locations : [];

  try {
    const shopLocations = await Shop.findById(shopId).select("locations");

    return res.status(200).json({ locations: shopLocations.locations });
  } catch (error) {
    console.log("getItemsByShopId error", error);
    return res.status(500).json({ message: error.message });
  }
};
