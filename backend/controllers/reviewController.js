const Review = require("../models/Review");
const Shop = require("../models/Shop");

const getAverageRate = (previousAverageRate, numberOfReviews, newRate) => {
  const average =
    (previousAverageRate * numberOfReviews + newRate) / (numberOfReviews + 1);
  return average;
};

exports.postReviewByShopper = async (req, res) => {
  const shopId = req.params.shopId;
  const shopperId = req.userId;
  let { comment, rate } = req.body;
  if (typeof comment === "undefined" || comment === "") {
    return res.status(400).json({ message: "Bad request." });
  }
  rate = rate || 5;
  try {
    const review = await Review.findOne({ shopId, shopperId });
    if (review) {
      return res
        .status(400)
        .json({ message: "You already reviewed to this shop." });
    }
    const newReview = await Review.create({ shopId, shopperId, comment, rate });
    const shop = await Shop.findById(shopId);
    shop.averageRate = getAverageRate(
      shop.averageRate || 0,
      shop.numberOfReviews || 0,
      rate
    );
    shop.numberOfReviews++;
    await shop.save();

    return res.status(200).json({ review: newReview });
  } catch (error) {
    console.log("postReview", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllReviewsOfShop = async (req, res) => {
  const shopId = req.params.shopId;
  const pageSize = req.query["page-size"] || 4;
  const page = req.query.page || 1;
  const sortKey = req.query["sort-key"] || "reviews-rating";

  try {
    const offset = (page - 1) * pageSize;
    let sortQuery;
    const findQuery = { shopId };

    switch (sortKey) {
      case "reviews-rating":
        sortQuery = { rate: -1 };
        break;
      case "latest":
        sortQuery = { createdAt: -1 };
        break;
      case "oldest":
        sortQuery = { createdAt: 1 };
        break;
      case "popular":
        sortQuery = { rate: 1 };
        break;
      default:
        console.log("sortKey", sortKey);
    }
    const reviews = await Review.find(findQuery)
      .sort(sortQuery)
      .skip(offset)
      .limit(pageSize)
      .populate({
        path: "shopperId",
        select: "firstName lastName avatar",
      });
    const totalResults = await Review.countDocuments(findQuery);

    return res.status(200).json({ totalResults, reviews });
  } catch (error) {
    console.log("getAllReviewsOfShop", error);
    return res.status(500).json({ message: error.message });
  }
};
