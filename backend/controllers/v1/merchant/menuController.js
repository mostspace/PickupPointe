const dayjs = require("dayjs");
const {ObjectId} = require("mongoose").Types;
const MerchantUserModel = require("../../../models/Merchant");
const Item = require("../../../models/Item");
const ItemStock = require("../../../models/ItemStock");
const Modifier = require("../../../models/Modifier");
const ModifierItem = require("../../../models/ModifierItem");
const axios = require("axios");

const getMenus = async (req, res) => {
  try {
    const merchantId = req.userId;

    const merchant = await MerchantUserModel.findById(merchantId);
    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    const items = await Item.find({
      'locations.locationId': { $in: merchant.locations }
    }).populate('categories modifiers perMetric');

    const itemStocks = await ItemStock.find({ location: { $in: merchant.locations }, outOfStockUntil: { $gt: dayjs().format("YYYY-MM-DD HH:mm:ss") } });

    const groupedItems = items.reduce((acc, item) => {
      item.categories.forEach(category => {
        const categoryName = category.category;
        
        if (!acc[categoryName]) {
          acc[categoryName] = [];
        }
        acc[categoryName].push({
          id: item._id,
          img: item.photo,
          name: item.name,
          price: item.defaultPrice.toFixed(2),
          activeStatus: itemStocks.filter(stock => stock.item.toString() === item._id.toString())[0]?.outOfStockUntil || "Available"
        });
      });
      return acc;
    }, {});

    const formattedResponse = Object.entries(groupedItems).map(([category, items]) => ({
      category,
      items
    }));
    /*try {
      const response = await fetch('https://sandbox.dev.clover.com/v3/merchants/3YWGEMARQ42N1/items', {
        method: "GET",
        headers: {
          Authorization: "Bearer 923f9080-20ff-5253-e8eb-3a8ab15b2d12",
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        const data = await response.json();
        formattedResponse.push({
          category: "Clover",
          items: data.elements.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price.toFixed(2),
            activeStatus: item.available ? "Available" : "Out of Stock"
          }))
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }*/

    return res.status(200).json({
      success: true,
      result: formattedResponse
    });

  } catch (error) {
    console.error('Error in getMenus:', error);
    return res.status(200).json({
      success: false,
      result: []
    });
  }
};

const getModifiers = async (req, res) => {
  try {
    const merchantId = req.userId;

    const merchant = await MerchantUserModel.findById(merchantId, "locations");
    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    const items = await Item.find({
      'locations.locationId': { $in: merchant.locations }
    }, 'modifiers');

    const modifierIds = [...new Set(items.flatMap(item => item.modifiers))];

    const modifiers = await Modifier.find({
      _id: { $in: modifierIds }
    }).populate('modifierItems');

    const formattedResponse = modifiers.map(modifier => ({
      _id: modifier._id,
      name: modifier.name,
      count: items.filter(item => item.modifiers.includes(modifier._id)).length,
      modifier: modifier.modifierItems.map(item => ({
        id: item._id,
        img: item.photo,
        name: item.name,
        isInStock: item.isInStock,
        price: item.price.toFixed(2)
      }))
    }));

    return res.status(200).json({
      success: true,
      result: formattedResponse
    });

  } catch (error) {
    console.error('Error in getModifiers:', error);
    return res.status(200).json({
      success: false,
      result: []
    });
  }
};

const setModifierOutOfStock = async (req, res) => {
  const {items, groupId} = req.body;
  if (!items || !groupId) {
    return res.status(400).json({ message: "Invalid request" });
  }
  const modifier = await Modifier.findById(groupId, "modifierItems");
  if (!modifier) {
    return res.status(404).json({ message: "Modifier not found" });
  }
  const itemIds = items.map(id => new ObjectId(id));
  for (const id of modifier.modifierItems) {
    await ModifierItem.findByIdAndUpdate(id, {isInStock: !itemIds.map(id => id.toString()).includes(id.toString())})
  }
  
  return res.json({status: "success"})
};

module.exports = {
  getMenus,
  getModifiers,
  setModifierOutOfStock
};