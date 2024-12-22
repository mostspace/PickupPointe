const NodeCache = require('node-cache');
const ItemStockModel = require("../models/ItemStock");

const cache = new NodeCache({ stdTTL: 360 });

const refreshCache =  () => {
	ItemStockModel.find({}, "location item currentQuantity")
		.then(data => {
			for (const item of data) {
				cache.set(`${item.location}.${item.item}`, item.currentQuantity);
			}
		});
}

const updateCache =  () => {
	refreshCache()
	setInterval(() => {
		refreshCache();
	}, 5 * 60 * 1000)
}

module.exports = {
	cache, updateCache
};