const ModifierItem = require("../models/ModifierItem");
const ModifierCategory = require("../models/ModifierCategory");

exports.addModifierCategory = async (req, res) => {
  const { category } = req.body;
  if (typeof category === "undefined" || category === "") {
    return res.status(400).json({ message: "Bad request." });
  }

  const vendorId = req.userId;
  try {
    const modifierCategory = await ModifierCategory.findOne({
      vendorId,
      category,
    });
    if (modifierCategory) {
      return res.status(400).json({ message: "Already exists" });
    }

    const newModifierCategory = await ModifierCategory.create({
      vendorId,
      category,
    });
    if (!newModifierCategory) {
      return res
        .status(400)
        .json({ message: "Failed to add modifier category" });
    }
    return res.status(200).json({ message: newModifierCategory });
  } catch (error) {
    console.log("addModifierCategory", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllModifierCategories = async (req, res) => {
  const vendorId = req.userId;
  try {
    const modifierCategories = await ModifierCategory.find({ vendorId }).select(
      "category"
    );
    return res.status(200).json({ modifierCategories });
  } catch (error) {
    console.log("getAllModifierCategories", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteModifierCategory = async (req, res) => {
  const id = req.params.id;
  const vendorId = req.userId;
  if (typeof id === "undefined") {
    return res.status(400).json({ message: "No id in request" });
  }
  try {
    const modifierCategory = await ModifierCategory.findOneAndDelete({
      _id: id,
      vendorId,
    });
    if (!modifierCategory) {
      return res
        .status(404)
        .json({ message: "Invalid id or it is not yours." });
    }
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log("deleteModifierCategory", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateModifierCategory = async (req, res) => {
  const id = req.params.id;
  if (typeof id === "undefined") {
    return res.status(400).json({ message: "No id in request" });
  }
  const { category } = req.body;
  if (typeof category === "undefined" || category === "") {
    return res.status(400).json({ message: "Bad request." });
  }
  const vendorId = req.userId;
  try {
    const modifierCategory = await ModifierCategory.findOne({
      vendorId,
      category,
    });
    if (modifierCategory) {
      return res.status(400).json({ message: "Already exist" });
    }

    const updatedModifierCategory = await ModifierCategory.findOneAndUpdate(
      {
        _id: id,
        vendorId,
      },
      { category },
      { new: true }
    ).select("category");
    return res.status(200).json({ category: updatedModifierCategory });
  } catch (error) {
    console.log("updateModifierCategory", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateModifierInStock = async (req, res) => {
  const { id, isInStock } = req.body;
  if (typeof id === "undefined" || typeof isInStock === "undefined") {
    return res.status(400).json({ message: "Bad request." });
  }
  try {
    const modifier = await ModifierItem.findOneAndUpdate({ _id: id}, { isInStock }, { new: true })
    return res.status(200).json({ modifier });
  } catch (error) {
    console.log("updateModifierInStock", error);
    return res.status(500).json({ message: error.message });
  }
}