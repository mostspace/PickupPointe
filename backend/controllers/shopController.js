const crypto = require("crypto");
const axios = require("axios");
const { S3LocationFilterSensitiveLog } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const { deleteFileFromS3UsingURL } = require("../utils/aws");
const { calculateMinutesDifference, getStartAndEndOfDayUTC } = require("../utils/date");
const { doorDashClient } = require("../utils/doordash");
const { isEmailValid, isPhoneValid } = require("../utils/validators");
const { objectToStringAddress } = require("../utils/address");
const { haversineDistance } = require("../utils/distance");
const { getDifferenceHour } = require("../utils/date");

const Shop = require("../models/Shop");
const Shopper = require("../models/Shop");
const Location = require("../models/Location");
const ShopCategory = require("../models/ShopCategory");
const Item = require("../models/Item");
const Review = require("../models/Review");

const { METERS_PER_MILE } = require("../config/distance");
const VendorSettingModel = require("../models/VendorSetting");
// Shops

exports.getLocalShopsByCoordinates = async (req, res) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 8;
  const { longitude, latitude } = req.query;
  const radius = req.query.radius || METERS_PER_MILE * 7; // 11,265.38

  // get the user's address with longitude and latitude
  let userAddress;
  if (typeof longitude !== "undefined" && typeof latitude !== "undefined") {
    const mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKEN;

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxAccessToken}`;
    await axios
      .get(url)
      .then((response) => {
        const result = response.data;
        if (result && result.features && result.features.length > 0) {
          userAddress = result.features[0].place_name;
        } else {
          console.log("Address not found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching address:", error);
      });
  }

  try {
    // get near by locations to user
    const nearByLocations = await Location.find({
      coordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: radius,
        },
      },
    }).select("_id");

    // convert location records to object.
    const locationIds = nearByLocations?.map((location) => location._id);

    const offset = (page - 1) * pageSize;

    // find shops
    const shops = await Shop.find({
      locations: { $in: locationIds },
    })
      .skip(offset)
      .limit(pageSize)
      .populate("locations");

    const shopsPromise = shops.map(async (shop) => {
      let minFee = 100000,
        minTime;
      const shopDeliveryData = shop.locations.map(async (location) => {
        const response = await doorDashClient.deliveryQuote({
          external_delivery_id: uuidv4(),
          pickup_address: objectToStringAddress(location.address),
          dropoff_address: userAddress,
          dropoff_phone_number: "+16504379788",
        });
        console.log("doordash response => ", response)
        if (response.data) {
          const mins = calculateMinutesDifference(
            response.data.pickup_time_estimated,
            response.data.dropoff_time_estimated
          );
          if (minFee > response.data.fee) {
            minFee = response.data.fee;
            minTime = mins;
          }
        }
      });
      await Promise.all(shopDeliveryData);
      return {
        ...shop.toObject(),
        fee: minFee,
        deliveryTime: minTime,
      };
    });

    const updatedShops = await Promise.all(shopsPromise);
    return res.status(200).json({ shops: updatedShops });
  } catch (error) {
    console.log("getLocalShops error:", error);
    return res.status(200).json({ message: error.message });
  }
};

exports.getLocalShops = async (req, res) => {
  const authHeader = req.header("Authorization") || null;

  const categories = req.body.categories || null;
  const page = req.body.params.page || 1;
  const pageSize = req.body.params.pageSize || 8;
  const startTime = req.body.params.startTime || getStartAndEndOfDayUTC().endOfDay;
  const endTime = req.body.params.endTime || getStartAndEndOfDayUTC().startOfDay;
  const pickupOrDelivery = req.body.params.pickupOrDelivery || "both";
  const location = req.body.params.location || "anywhere";
  const mile = req.body.params.mile || 10;
  const longitude = req.body.params.longitude || -119.2921; // visalia, California longitude
  const latitude = req.body.params.latitude || 36.3302; // visalia, California latitude

  if (longitude === "null") {
    longitude = -119.292;
  }
  if (latitude === "null") {
    latitude = 36.3302;
  }

  console.log("pickupOrDelivery", pickupOrDelivery, startTime, endTime)

  const radius = mile * METERS_PER_MILE;
  const offset = (page - 1) * pageSize;

  const locationFindQuery = {};
  const shopFindQuery = {};

  shopFindQuery.isActive = true;
  shopFindQuery.isLive = true;

  if (pickupOrDelivery === "both") {

    locationFindQuery.$and = [
      // { "pickup.isUse": true }, // Pickup must be in use
      // { "delivery.isUse": true }, // Delivery must be in use
      {
        $expr: {
          $or: [
            {
              $and: [
                {
                  $lte: [
                    { $dateToString: { format: "%H:%M:%S", date: { $add: [{ $toDate: "$pickup.from" }, { $multiply: [-8, 60 * 60 * 1000] } ] } } },
                    { $dateToString: { format: "%H:%M:%S", date: { $add: [{ $toDate: startTime }, { $multiply: [-8, 60 * 60 * 1000] } ] } } },
                  ],
                },
                {
                  $gte: [
                    {
                      $dateToString: {
                        format: "%H:%M:%S",
                        date: { $add: [{ $toDate: "$pickup.to" }, { $multiply: [-8, 60 * 60 * 1000] } ] },
                      },
                    },
                    {
                      $dateToString: {
                        format: "%H:%M:%S",
                        date: { $add: [{ $toDate: endTime }, { $multiply: [-8, 60 * 60 * 1000] } ] },
                      },
                    },
                  ],
                },
              ],
            },
            {
              $and: [
                {
                  $lte: [
                    {
                      $dateToString: {
                        format: "%H:%M:%S",
                        date: { $add: [{ $toDate: "$delivery.from" }, { $multiply: [-8, 60 * 60 * 1000] } ] },
                      },
                    },
                    {
                      $dateToString: {
                        format: "%H:%M:%S",
                        date: { $add: [{ $toDate: startTime }, { $multiply: [-8, 60 * 60 * 1000] } ] },
                      },
                    },
                  ],
                },
                {
                  $gte: [
                    {
                      $dateToString: {
                        format: "%H:%M:%S",
                        date: { $add: [{ $toDate: "$delivery.to" }, { $multiply: [-8, 60 * 60 * 1000] } ] },
                      },
                    },
                    {
                      $dateToString: {
                        format: "%H:%M:%S",
                        date: { $add: [{ $toDate: endTime }, { $multiply: [-8, 60 * 60 * 1000] } ] },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        }
      },
    ];
  } else if (pickupOrDelivery === "pickup") {
    locationFindQuery.$and = [
      { "pickup.isUse": true }, // Pickup must be in use
      {
        $expr: {
          $and: [
            {
              $lte: [
                {
                  $dateToString: {
                    format: "%H:%M:%S",
                    date: { $add: [{ $toDate: "$pickup.from" }, { $multiply: [-8, 60 * 60 * 1000] } ] }, // Adjust pickup.from to UTC-8
                  },
                },
                {
                  $dateToString: {
                    format: "%H:%M:%S",
                    date: { $add: [{ $toDate: startTime }, { $multiply: [-8, 60 * 60 * 1000] } ] }, // Adjust endTime to UTC-8
                  },
                },
              ],
            },
            {
              $gte: [
                {
                  $dateToString: {
                    format: "%H:%M:%S",
                    date: { $add: [{ $toDate: "$pickup.to" }, { $multiply: [-8, 60 * 60 * 1000] } ] }, // Adjust pickup.to to UTC-8
                  },
                },
                {
                  $dateToString: {
                    format: "%H:%M:%S",
                    date: { $add: [{ $toDate: endTime }, { $multiply: [-8, 60 * 60 * 1000] } ] }, // Adjust startTime to UTC-8
                  },
                },
              ],
            },
          ],
        },
      },
    ];
  } else if (pickupOrDelivery === "delivery") {
    locationFindQuery.$and = [
      { "delivery.isUse": true }, // Delivery must be in use
      {
        $expr: {
          $and: [
            {
              $lte: [
                {
                  $dateToString: {
                    format: "%H:%M:%S",
                    date: { $add: [{ $toDate: "$delivery.from" }, { $multiply: [-8, 60 * 60 * 1000] } ] }, // Adjust delivery.from to UTC-8
                  },
                },
                {
                  $dateToString: {
                    format: "%H:%M:%S",
                    date: { $add: [{ $toDate: startTime }, { $multiply: [-8, 60 * 60 * 1000] } ] }, // Adjust endTime to UTC-8
                  },
                },
              ],
            },
            {
              $gte: [
                {
                  $dateToString: {
                    format: "%H:%M:%S",
                    date: { $add: [{ $toDate: "$delivery.to" }, { $multiply: [-8, 60 * 60 * 1000] } ] }, // Adjust delivery.to to UTC-8
                  },
                },
                {
                  $dateToString: {
                    format: "%H:%M:%S",
                    date: { $add: [{ $toDate: endTime }, { $multiply: [-8, 60 * 60 * 1000] } ] }, // Adjust startTime to UTC-8
                  },
                },
              ],
            },
          ],
        },
      },
    ];
  }

  // if (categories) {
  //   shopFindQuery.categories = { $in: categories };
  // }

  try {
    // get all shops
    if (location === "anywhere") {
      const locationRecords = await Location.find(locationFindQuery);
      const locationIds = locationRecords?.map((location) => location._id);
      shopFindQuery.locations = { $in: locationIds };

    } else if (location === "local") {

      // shopper_guest view
      if (authHeader === null || true === true) {

        locationFindQuery.coordinates = {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: radius,
          },
        };

        const nearByLocations = await Location.find(locationFindQuery);

        // convert location records to object.
        const locationIds = nearByLocations?.map((location) => location._id);
        shopFindQuery.locations = { $in: locationIds };
      }

      // shopper and vendor view
      else if (true === false) {
        let userId, userRole;

        try {
          const token = authHeader.split(" ")[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          userId = decoded.id;
          userRole = decoded.role;
        } catch (error) {
          res.status(401).json({ error: "Invalid token" });
        }

        if (userRole === "shopper") {
          const shopper = await Shopper.findById(userId);
          if (shopper.delivery) {
          }

          locationFindQuery.coordinates = {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [longitude, latitude],
              },
              $maxDistance: radius,
            },
          };
          const nearByLocations = await Location.find(locationFindQuery);

          // convert location records to object.
          const locationIds = nearByLocations?.map((location) => location._id);
          shopFindQuery.locations = { $in: locationIds };
        } else if (userRole === "vendor") {

          const vendorLocations = await Location.find({
            vendorId: userId,
          });

          const locationIds = vendorLocations?.map((location) => location._id);
          shopFindQuery.locations = { $in: locationIds };
        }
      }
    }
    const totalResults = await Shop.countDocuments(shopFindQuery);
    const shops = await Shop.find(shopFindQuery)
      .skip(offset)
      .limit(pageSize)
      .select(
        "_id photo name shopId averageRate aboutUs categories savePercent logo"
      )
      .populate({ path: "locations" })
      .populate({ path: "categories" });

    const updatedShops = shops.map((shop) => {
      let isDelivery = false;
      let isPickup = false;
      let minMile = Infinity;
      let maxRemainTime = 0;
      shop.locations.map((location) => {
        const distanceToLocation = haversineDistance(
          latitude,
          longitude,
          location.coordinates.coordinates[1],
          location.coordinates.coordinates[0],
          "mile"
        );
        if(distanceToLocation < minMile) {
          if (location.delivery.isUse) isDelivery = true;
          if (location.pickup.isUse) isPickup = true;
        }
        minMile = Math.min(minMile, distanceToLocation);

        console.log("distance:", distanceToLocation);

        const pickupTime = location.pickup.isUse
          ? getDifferenceHour(location.pickup.to)
          : 0;
        const deliveryTime = location.delivery.isUse
          ? getDifferenceHour(location.delivery.to)
          : 0;
        console.log("getDifferenceHour:", location.pickup.to, pickupTime, deliveryTime);

        maxRemainTime = Math.max(
          maxRemainTime,
          deliveryTime,
          pickupTime
        );
      });
      const objectShop = shop.toObject();
      delete objectShop.locations;
      let delivery =
        isDelivery && isPickup
          ? "Pickup & Delivery"
          : isDelivery
          ? "Delivery"
          : "Pickup";

      return {
        ...objectShop,
        distance: minMile,
        delivery,
        remainTime: maxRemainTime,
      };
    });

    return res.status(200).json({ totalResults, shops: updatedShops });
  } catch (error) {
    console.log("getLocalShops error:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.createShop = async (req, res) => {
  const photo = req.files[0]?.location || "";
  const logo = req.files[1]?.location || "";
  console.log("shop photo:", photo);
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
    locations,
    aboutUs,
    phoneNumber,
    supportEmail,
    website,
    socialMedias,
    categories,
  } = req.body;

  if (!isEmailValid(supportEmail)) {
    deleteFileFromS3UsingURL(photo);
    return res.status(400).json({ message: "Email is not valid" });
  }

  if (!isPhoneValid(phoneNumber)) {
    deleteFileFromS3UsingURL(photo);
    return res.status(400).json({ message: "Phone is not valid" });
  }

  try {
    let idNum;
    let tempShop;
    do {
      idNum = crypto.randomInt(0, 10000000).toString().padStart(6, "0");
      console.log("idNum:", idNum);
      tempShop = await Shop.findOne({ pickupId: "shop" + idNum });
    } while (tempShop);

    const shop = await Shop.create({
      vendorId,
      shopId: "shop" + idNum,
      photo,
      logo,
      name,
      locations,
      aboutUs,
      phoneNumber,
      supportEmail,
      website,
      socialMedias,
      categories,
    });
    if (!shop) {
      deleteFileFromS3UsingURL(photo);
      return res.status(400).json({ message: "Bad params" });
    }

    const relatedItems = await Item.find({
      locations: {
        $elemMatch: { locationId: { $in: locations } },
      },
    });

    shop.items = relatedItems;
    await shop.save();

    const promises = locations?.map(async (location) => {
      const locationRecord = await Location.findById(location);
      if (locationRecord) {
        locationRecord.contact.supportEmail = supportEmail || "No email";
        await locationRecord.save();
      }
    });

    await Promise.all(promises);

    const populatedShop = await (
      await (
        await shop.populate({
          path: "categories",
          select: "category photo",
        })
      ).populate({ path: "locations" })
    ).populate({ path: "categories" });

    // const populatedShop = await Shop.findById(shop._id)
    //   .populate({
    //     path: "categories",
    //     select: "category photo",
    //   })
    //   .populate({ path: "locations", select: "address contact" });

    return res.status(201).json({ shop: populatedShop });
  } catch (error) {
    console.log("createShop error", error);
    deleteFileFromS3UsingURL(photo);
    res.status(500).json({ message: error.message });
  }
};

exports.updateShop = async (req, res) => {
  const id = req.params.id;
  const photo = req.file?.location || "";
  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      try {
        req.body[key] = JSON.parse(req.body[key]);
      } catch (e) {
        console.log(`Failed to parse ${key}: ${req.body[key]}`);
      }
    }
  }
  const {
    name,
    locations,
    aboutUs,
    phoneNumber,
    supportEmail,
    website,
    socialMedias,
    categories,
    isActive,
    businessDetail,
    payments,
    primaryPayment
  } = req.body;

  if (typeof supportEmail !== "undefined" && !isEmailValid(supportEmail)) {
    deleteFileFromS3UsingURL(photo);
    return res.status(400).json({ message: "Email is not valid" });
  }

  if (typeof phoneNumber !== "undefined" && !isPhoneValid(phoneNumber)) {
    deleteFileFromS3UsingURL(photo);
    return res.status(400).json({ message: "Phone is not valid" });
  }

  const vendorId = req.userId;
  try {
    const updateQuery = {
      name,
      locations,
      aboutUs,
      phoneNumber,
      supportEmail,
      website,
      socialMedias,
      categories,
      isActive,
      businessDetail,
      payments,
      primaryPayment
    };
    const shop = await Shop.findOneAndUpdate(
      { vendorId, _id: id },
      updateQuery,
      { new: true }
    );

    if (!shop) {
      return res.status(404).json({ message: "Bad request." });
    }

    if (supportEmail) {
      const promises = shop.locations?.map(async (location) => {
        const locationRecord = await Location.findById(location.toString());
        if (locationRecord) {
          locationRecord.contact.supportEmail = supportEmail;
          await locationRecord.save();
        }
      });
      await Promise.all(promises);
    }

    if (photo !== "") {
      deleteFileFromS3UsingURL(shop.photo);
      shop.photo = photo;
    }

    await shop.save();
    res.status(200).json(shop);
  } catch (error) {
    console.log("updateShop error", error);
    deleteFileFromS3UsingURL(photo);
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteShop = async (req, res) => {
  const id = req.params.id;
  const vendorId = req.userId;
  try {
    const shop = await Shop.findOneAndDelete({ vendorId, _id: id });
    if (!shop) {
      return res.status(404).json({ message: "Not found" });
    }
    deleteFileFromS3UsingURL(shop.photo);

    return res.status(200).json({ message: "Shop deleted" });
  } catch (error) {
    console.log("deleteShop error", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllShopsByVendorId = async (req, res) => {
  const vendorId = req.userId;
  try {
    const shops = await Shop.find({ vendorId })
      .populate({
        path: "categories",
        select: "category photo",
      })
      .populate({ path: "locations", select: "address pickup delivery" })
      .populate({ path: "payments" });

    return res.status(200).json({ shops });
  } catch (error) {
    console.log("getAllShopsByVendorId error", error);
    return res.status(500).json({ message: error.message });
  }
};

// ---------------------------------
// Shop category endpoints for admin
// ---------------------------------

exports.createShopCategory = async (req, res) => {
  const photo = req.file ? req.file.location : "";
  const { category } = req.body;
  if (!category) {
    deleteFileFromS3UsingURL(photo);
    return res.status(400).json({ message: "Category is required" });
  }
  try {
    const shopCategory = await ShopCategory.create({
      category,
      photo,
    });
    res.status(201).json(shopCategory);
  } catch (error) {
    deleteFileFromS3UsingURL(photo);
    console.log("createShopCategory error", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getShopList = async (req, res) => {
  try {
    const shopList = await Shop.find().limit(8);
    res.status(200).json(shopList);
  } catch (error) {
    console.log("getShopList error", error);
    res.status(500).json({ message: error.message });
  }
}

exports.getShopCategories = async (req, res) => {
  try {
    const shopCategories = await ShopCategory.find().select("photo category");
    res.status(200).json(shopCategories);
  } catch (error) {
    console.log("getShopCategories error", error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteShopCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const shopCategory = await ShopCategory.findByIdAndDelete(id);
    if (!shopCategory) {
      return res.status(404).json({ message: "Shop category not found" });
    }
    deleteFileFromS3UsingURL(shopCategory.photo);
    res.status(200).json({ message: "Shop category deleted" });
  } catch (error) {
    console.log("deleteShopCategory error", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateShopCategory = async (req, res) => {
  const photo = req.file ? req.file.location : "";
  const { id } = req.params;
  const { category } = req.body;
  try {
    const shopCategory = await ShopCategory.findByIdAndUpdate(
      id,
      { category },
      { new: true }
    );
    if (!shopCategory) {
      return res.status(404).json({ message: "Shop category not found" });
    }
    if (photo !== "") {
      deleteFileFromS3UsingURL(shopCategory.photo);
      shopCategory.photo = photo;
    }

    await shopCategory.save();
    res.status(200).json(shopCategory);
  } catch (error) {
    deleteFileFromS3UsingURL(photo);
    console.log("updateShopCategory error", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getShopById = async (req, res) => {
  const shopId = req.params.id;
  try {
    const shop = await Shop.findById(shopId)
      .populate({
        path: "categories",
        select: "category photo",
      })
      .populate({ path: "locations", select: "address" })
      .populate({ path: "payments" })
      .populate({ path: "subscription" });

    const reviews = await Review.find({ shopId: shop._id });
    return res.status(200).json({ shop: { ...shop.toObject(), reviews } });
  } catch (error) {
    console.log("getShopById error:", error);
    return res.status(500).json({ message: error });
  }
};

exports.getShopDetailsByIdForMarketplace = async (req, res) => {
  const shopId = req.params.id;
  let longitude = req.query.longitude || -119.292;
  let latitude = req.query.latitude || 36.3302;
  let userId, userRole;
  let shopper;
  let userAddress;

  if (longitude === "null") {
    longitude = -119.292;
  }
  if (latitude === "null") {
    latitude = 36.3302;
  }


  console.log("reqstring", req.params, req.query)

  // const authHeader = req.header("Authorization") || null;
  // if (authHeader) {
  //   const token = authHeader && authHeader.split(" ")[1];
  //   if (!token) return res.status(401).json({ error: "Access denied" });
  //   try {
  //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //     userId = decoded.id;
  //     userRole = decoded.role;
  //     if (userRole === "shopper") {
  //       shopper = await Shopper.findById(userId);
  //     }
  //   } catch (error) {
  //     console.log("verify token error:", error.message);
  //     res.status(401).json({ error: "Invalid token" });
  //   }
  // }

  try {
    // longitude = authHeader
    //   ? shopper?.coordinates?.longitude || -119.2921
    //   : longitude;
    // latitude = authHeader ? shopper?.cooridnate?.latitude || 36.3302 : latitude;

    if (shopper || false) {
      userAddress = shopper.deliveryAddress
        ? objectToStringAddress(shopper.deliveryAddress)
        : "104 East Main Street, Visalia, California 93291, United States";
    } else {
      const mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKEN;

      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxAccessToken}`;
      await axios
        .get(url)
        .then((response) => {
          const result = response.data;
          if (result && result.features && result.features.length > 0) {
            userAddress = result.features[0].place_name;
          } else {
            console.log("Address not found.", response);
          }
        })
        .catch((error) => {
          console.error("Error fetching address:", error);
        });
    }
    console.log("userAddress=>", userAddress);

    const shop = await Shop.findById(shopId)
      .populate({
        path: "categories",
        select: "category photo",
      })
      .populate({ path: "locations" });

    const shopObject = shop.toObject();
    const shopPromises = shopObject.locations.map(async (location) => {
      const distanceToLocation = haversineDistance(
        latitude,
        longitude,
        location.coordinates.coordinates[1],
        location.coordinates.coordinates[0],
        "mile"
      );
      console.log("distanceToLocation:", distanceToLocation, latitude, longitude, location.coordinates.coordinates[1], location.coordinates.coordinates[0]);
      location.distance = distanceToLocation;

      location.deliveryType =
      location.delivery.isUse && location.pickup.isUse
        ? "Pickup & Delivery"
        : location.delivery.isUse
        ? "Delivery"
        : "Pickup";

      const pickupTime = location.pickup.isUse
        ? getDifferenceHour(location.pickup.to)
        : 0;
      const deliveryTime = location.delivery.isUse
        ? getDifferenceHour(location.delivery.to)
        : 0;

      location.remainingTime = Math.max(
        deliveryTime,
        pickupTime
      );

      try {
        const response = await doorDashClient.deliveryQuote({
          external_delivery_id: uuidv4(),
          pickup_address: objectToStringAddress(location.address),
          dropoff_address: userAddress,
          dropoff_phone_number: "+16504379788",
        });

        console.log("doordash response", response)

        location.pickupTime = calculateMinutesDifference(
          response.data.updated_at,
          response.data.pickup_time_estimated
        );
        location.deliveryTime = calculateMinutesDifference(
          response.data.updated_at,
          response.data.dropoff_time_estimated
        );
        location.deliveryFee = response.data.fee;
        console.log("doordash===========================================", response.data.fee, response.data.updated_at, calculateMinutesDifference(
          response.data.updated_at,
          response.data.pickup_time_estimated
        ))
      } catch (error) {
        console.log("doordash error", error, userAddress, objectToStringAddress(location.address))
        location.pickupTime = "Exceeded distance";
        location.deliveryTime = "Exceeded distance";
      }
    });
    await Promise.all(shopPromises);

    let isDelivery = false;
    let isPickup = false;
    let minMile = Infinity;
    let maxRemainTime = 0;
    shopObject.locations.map((location) => {
      const distanceToLocation = haversineDistance(
        latitude,
        longitude,
        location.coordinates.coordinates[1],
        location.coordinates.coordinates[0],
        "mile"
      );

      minMile = Math.min(minMile, distanceToLocation);

      if (location.delivery.isUse) isDelivery = true;
      if (location.pickup.isUse) isPickup = true;
      console.log("distance:", distanceToLocation);

      const pickupTime = location.pickup.isUse
        ? getDifferenceHour(location.pickup.to)
        : 0;
      const deliveryTime = location.delivery.isUse
        ? getDifferenceHour(location.delivery.to)
        : 0;
      console.log("getDifferenceHour:", location.pickup.to, pickupTime, deliveryTime);

      maxRemainTime = Math.max(
        maxRemainTime,
        deliveryTime,
        pickupTime
      );
    });

    const objectShop = shop.toObject();
    delete objectShop.locations;
    let delivery =
      isDelivery && isPickup
        ? "Pickup & Delivery"
        : isDelivery
        ? "Delivery"
        : "Pickup";

    const reviews = await Review.find({ shopId: shop._id })
    .populate({
      path: "shopperId",
      select: "firstName lastName avatar",
    });

    // Find items that have at least one matching location
    const items = await Item.find({
      'locations.locationId': { $in: shopObject.locations.map(loc => loc._id) }
    })
      .populate({path: 'categories'})
      .populate({path: 'modifiers', populate: ({
        path: "modifierItems"
      })});
    const featuredItems = items.filter((item) => item.isFeatured === true);

    const vendorSettings = await VendorSettingModel.find({
      vendorId: shopObject.vendorId
    }).populate({path: 'discounts'})

    return res.status(200).json({ shop: {
      ...shopObject,
      distance: minMile,
      delivery,
      remainTime: maxRemainTime,
      items: featuredItems,
      vendorSettings: vendorSettings,
      reviews
    }});
  } catch (error) {
    console.log("getShopDetailsById error:", error);
    return res.status(500).json({ message: error.message });
  }
};
