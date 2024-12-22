const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    photo: {
      type: String,
      default: "",
    },
    shops: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
      },
    ],
    name: {
      type: String,
      required: true,
    },
    itemId: {
      type: String,
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ItemCategory",
      },
    ],
    defaultPrice: {
      type: Number,
      default: 0,
      required: true,
    },
    perMetric: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Metric",
      required: false,
    },
    variants: {
      isUse: { type: Boolean, default: false },
      attributes: { type: [String], default: [] },
    },
    description: { type: String },
    isInStock: { type: Boolean, default: true },
    attributes: {
      prepareTime: {
        time: { type: Number, default: 0 },
        unit: {
          type: String,
          default: "days",
          enum: ["days", "minutes", "hours"],
        },
      },
      lifeExpiration: {
        time: { type: Number, default: 0, min: 0, max: 60 },
        unit: {
          type: String,
          default: "days",
          enum: ["days", "minutes", "hours"],
        },
      },
      isAutoPay: { type: Boolean, default: true },
      isPerishable: { type: Boolean, default: true },
    },
    sourceItemSales: {
      type: Array,
    },
    isUseTimePromotion: {
      type: Boolean,
      default: false,
    },
    timePromotions: [
      {
        name: { type: String },
        description: { type: String },
        type: { type: Number, default: 0, min: 0, max: 3 },
        value: { type: Number, min: 0 },
        from: {
          hour: { type: Number, default: 0, min: 0, max: 24 },
          minute: { type: Number, default: 0, min: 0, max: 60 },
        },
        to: {
          hour: { type: Number, default: 0, min: 0, max: 24 },
          minute: { type: Number, default: 0, min: 0, max: 60 },
        },
        frequencyType: { type: Number, default: 0, min: 0, max: 1 },
        scheduleType: { type: Number, default: 0, min: 0, max: 3 },
        scheduleDate: { type: Schema.Types.Mixed },
      },
    ],
    // timePromotion: {
    //   isUse: { type: Boolean, default: true },
    //   name: { type: String, default: "" },
    //   date: { type: String },
    //   discount: { type: Number },
    //   from: {
    //     hour: { type: Number, default: 0 },
    //     minute: { type: Number, default: 0 },
    //   },
    //   to: {
    //     hour: { type: Number, default: 0 },
    //     minute: { type: Number, default: 0 },
    //   },
    // },
    modifiers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Modifier",
      },
    ],
    inclusions: {
      isEatingUtensilsIncluded: { type: Boolean, default: false },
      isDisposableCoolingPads: { type: Boolean, default: false },
      isDiscountCertificates: { type: Boolean, default: false },
      isCondimentsIncluded: { type: Boolean, default: false },
      isExtraFragile: { type: Boolean, default: false },
      isIdsposableHeatingPads: { type: Boolean, default: false },
      IsLiquids: { type: Boolean, default: false },
      isOther: { type: Boolean, default: false },
      otherDetails: { type: String },
    },
    locations: [
      {
        locationId: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
        amountAtThis: { type: Number, default: 0 },
        maxQty: { type: Number, default: 0 },
        per: { type: String, defaul: "day", enum: ["day", "week", "month"] },
      },
    ],
    importantNotes: {
      isVisibleToCustomers: { type: Boolean, default: true },
      description: { type: String, default: "" },
    },
    nutritionalInformation: {
      type: String,
      default: "",
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Item", ItemSchema);
