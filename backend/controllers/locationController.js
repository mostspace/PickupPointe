const Location = require("../models/Location");
const Shop = require("../models/Shop");
const Vendor = require("../models/Vendor");
const { isAddressValid } = require("../utils/validators");

exports.addLocation = async (req, res) => {
  const { name, address, contact, pickup, delivery, isPrivate, taxRate } = req.body;
  console.log(req.body);
  const userId = req.userId;
  try {
    // Validate
    if (
      typeof name === "undefined" ||
      typeof address === "undefined" ||
      typeof contact === "undefined" ||
      typeof isPrivate !== "boolean"
    ) {
      return res.status(400).json({ message: "Bad Request." });
    }
    const { countryCode, state, city, street, zipCode } = address;

    const result = await isAddressValid({
      countryCode,
      state,
      city,
      street,
      zipCode,
    });
    if (result === false) {
      return res.status(400).json({ message: "Invalid address" });
    }
    const { longitude, latitude } = result;

    // Add location
    const newLocation = await Location.create({
      vendorId: userId,
      name,
      address,
      contact,
      pickup,
      delivery,
      isPrivate,
      coordinates: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      taxRate
    });
    if (!newLocation) {
      return res.status(400).json({ message: "Bad Request." });
    }

    // await newLocation.save();
    return res.status(201).json({ location: newLocation });
  } catch (error) {
    console.log("addLocation:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteLocation = async (req, res) => {
  const locationId = req.params.id;
  const userId = req.userId;

  try {
    // Find the location to remove. If it exists it, delete it
    const location = await Location.findByIdAndDelete(locationId);
    if (!location)
      return res.status(400).json({ message: "Id is not correct!" });

    // Convert records to array
    return res.status(200).json({ message: "Deleted." });
  } catch (error) {
    console.log("removeLocation", error);
    return res.status(500).json({ message: error });
  }
};

exports.getLocations = async (req, res) => {
  const vendorId = req.userId;
  console.log("getLocations user id:", vendorId);

  const query = req.query;

  let findQuery = {vendorId};
  if (query.shop !== "all") {
    let shopData = await Shop.findById(query.shop).exec();
    if (shopData) {
      findQuery._id = {$in: shopData.locations};
    }
  }
  console.log(findQuery);
  const pageSize = query.pageSize ? query.pageSize : 5;
  const page = query.page ? query.page : 1;
  try {
    const offset = (page - 1) * pageSize;
    // Get vendor's all locations
    const locations = await Location.find(findQuery)
      .skip(offset)
      .limit(pageSize);

    const totalResults = await Location.countDocuments(findQuery);

    return res.status(200).json({ totalResults, locations });
  } catch (error) {
    console.log("getAllLocations:", error);
    return res.status(500).json({ message: error });
  }
};

exports.updateLocation = async (req, res) => {
  const locationId = req.params.id;
  const { name, address, contact, pickup, delivery, isPrivate, taxRate } = req.body;

  try {
    // Validate
    if (
      typeof name === "undefined" ||
      typeof address === "undefined" ||
      typeof contact === "undefined" ||
      typeof isPrivate !== "boolean"
    ) {
      return res.status(400).json({ message: "Bad Request." });
    }
    const { countryCode, state, city, street, zipCode } = address;

    const result = await isAddressValid({
      countryCode,
      state,
      city,
      street,
      zipCode,
    });

    if (result === false) {
      return res.status(400).json({ message: "Invalid address." });
    }

    const { longitude, latitude } = result;

    const updateQuery = {
      name,
      address,
      contact,
      pickup,
      delivery,
      isPrivate,
      coordinates: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      taxRate
    };

    // Find the location to update
    const updatedLocation = await Location.findByIdAndUpdate(
      locationId,
      updateQuery,
      { new: true }
    );

    return res.status(200).json({ location: updatedLocation });
  } catch (error) {
    console.log("updateLocation:", error);
    return res.status(500).json({ message: error });
  }
};
