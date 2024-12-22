const Discount = require("../models/Discount");
const VendorSetting = require("../models/VendorSetting");

// exports.addDiscount = async (req, res) => {
//   const { discountCode, discountAmount, method } = req.body;
//   const userId = req.userId;
//   try {
//     if (
//       typeof discountCode !== "string" ||
//       typeof discountAmount !== "number" ||
//       typeof method !== "string"
//     ) {
//       return res.status(400).json({ message: "Invalid parameters." });
//     }

//     // Add discount
//     const discount = await Discount.create({
//       vendor: userId,
//       discountCode: discountCode,
//       discountAmount: discountAmount,
//       method: method,
//     });

//     const vendorSetting = await VendorSetting.findOne({ vendorId: userId });
//     vendorSetting.discounts.push(discount);
//     vendorSetting.save();

//     return res.status(200).json({ discount });
//   } catch (error) {
//     console.log("addDiscount function.", error);
//     return res.status(500).json({ message: "Failed to add discount." });
//   }
// };

// exports.deleteDiscount = async (req, res) => {
//   const discountId = req.query.id;
//   try {
//     const deletedDiscount = await Discount.findByIdAndDelete(discountId);
//     if (!deletedDiscount) {
//       return res.status(400).json({ message: "Invalid id." });
//     }
//     return res.status(200).json({ message: "success" });
//   } catch (error) {
//     console.log("delelteDiscount function.", error);
//     return res.status(500).json({ message: "Failed to delete discount." });
//   }
// };

// exports.updateDiscount = async (req, res) => {
//   const { discountCode, discountAmount, method } = req.body;
//   const discountId = req.query.id;
//   const userId = req.userId;
//   try {
//     const opts = { runValidators: true };
//     if (
//       typeof discountCode !== "string" ||
//       typeof discountAmount !== "number" ||
//       typeof method !== "string"
//     ) {
//       return res.status(400).json({ message: "Invalid parameters." });
//     }

//     const discount = await Discount.findByIdAndUpdate(
//       discountId,
//       {
//         vendor: userId,
//         discountCode: discountCode,
//         discountAmount: discountAmount,
//         method: method,
//       },
//       opts
//     );

//     if (!discount) {
//       return res.status(400).json({ message: "Invalid id." });
//     }

//     const updatedDiscount = await Discount.findById(discount._id);
//     return res.status(200).json({ discount: updatedDiscount });
//   } catch (error) {
//     console.log("updateDiscount function.", error);
//     return res.status(500).json({ message: "Failed to update discount." });
//   }
// };

exports.getDiscounts = async (req, res) => {
  const userId = req.userId;
  try {
    // Find all discounts
    const vendorSetting = await VendorSetting.findOne({
      vendorId: userId,
    }).populate({
      path: "discounts",
      populate: [
        { path: "shop", select: "name" },
        { path: "locations", select: "address" },
      ],
    });

    return res.status(200).json({ discounts: vendorSetting.discounts });
  } catch (error) {
    console.log("getDiscounts function.", error);
    return res.status(500).json({ message: error });
  }
};

exports.updateDiscounts = async (req, res) => {
  const { discounts } = req.body;

  console.log(discounts);
  const vendorId = req.userId;
  
  // Validate
  if (!Array.isArray(discounts)) {
    return res.status(400).json({ message: "Invalid discounts params." });
  }

  try {
    const vendorSetting = await VendorSetting.findOne({ vendorId });

    const promises = discounts.map(async (discount) => {
      if (discount.type == "create") {
        const { discountCode, discountAmount, method, shop, title, description, locations } = discount;
        const discountRecord = await Discount.create({
          discountCode,
          discountAmount,
          method,
          title,
          description,
          shop, 
          locations
        });
        vendorSetting.discounts.push(discountRecord);
      } else if (discount.type == "delete") {
        const { id } = discount;
        if (typeof id == "undefined") {
          return;
        }
        await Discount.findByIdAndDelete(discount.id);
        const indexToRemove = vendorSetting.discounts.indexOf(id);
        if (indexToRemove > -1) {
          vendorSetting.discounts.splice(indexToRemove, 1);
        } else {
          return;
        }
      }
    });

    await Promise.all(promises);

    await vendorSetting.save();

    const updatedVendorSetting = await VendorSetting.findOne({
      vendorId,
    }).populate({
      path: "discounts",
      populate: [
        { path: "shop", select: "name" },
        { path: "locations", select: "address" },
      ],
    });

    return res.status(200).json({ discounts: updatedVendorSetting.discounts });

  } catch (error) {
    console.log("addDiscounts function.", error);
    return res.status(500).json({ message: error });
  }
};

exports.changeDiscountStatus = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const discount = await Discount.findById(id);
    if (!discount) {
      return res.status(400).json({ message: "Invalid id." });
    }

    discount.isActive = !discount.isActive;
    await discount.save();

    return res.status(200).json({ discount });
  } catch (error) {
    console.log("changeStatus function.", error);
    return res.status(500).json({ message: error });
  }
};
