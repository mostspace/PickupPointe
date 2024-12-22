const cron = require('node-cron');
const ItemModel = require("../models/Item");
const ItemStock = require("../models/ItemStock");
const dayjs = require("dayjs");

const updateStock = () => {
	cron.schedule('0 0 * * *', async () => {
		try {
			const currentDay = dayjs().format('dddd');
			const currentDate = dayjs().format("DD");
			let items = await ItemModel.find({}, "_id locations")

			for (const item of items) {
				if (item?.locations?.length > 0) {
					for (const location of item.locations) {
						try {
							if (location.per === "day" || (location.per === "week" && currentDay === "Monday") || (location.per === "month" && currentDate === "01")) {
								await ItemStock.findOneAndUpdate(
									{
										item: item._id,
										location: location.locationId,
										$or: [
											{ outOfStockUntil: { $lte: dayjs().format("YYYY-MM-DD HH:mm:ss") } },
											{ outOfStockUntil: null },
										],
										outOfStockUntil: { $ne: "Forever" }
									},
									{
										$set: { currentQuantity: location.maxQty },
										$setOnInsert: { location: location.locationId, item: item._id }
									},
									{ upsert: true }
								)
							}
						} catch (innerError) {
							console.error('Error updating individual item:', innerError);
						}
					}
				}
			}
		} catch (error) {
			console.error('Error in cron job:', error);
		}
	});
}

module.exports = {
	run: () => {
		updateStock();
	},
};