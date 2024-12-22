import React from "react";
import IncrementerButton from "../incrementer-button";
import { Divider, IconButton, Typography } from "@mui/material";
import { ic_trash } from "src/assets";

import { formattedNumber } from "src/utils/utilityFunctions";

const CartItem = ({ item, onDecrease, onIncrease, onClear, isFinal }) => {
  return (
    <div key={item._id} className="pt-1">
      <div className="flex flex-col gap-[10px]">
        <div className="flex gap-[12px] items-center">
          <img
            loading="lazy"
            src={item.photo}
            className="w-[56px] h-[48px] rounded-[8px] mix-blend-darken"
          />
          <div className="flex flex-col">
            <Typography variant="subtitle1">{item.name}</Typography>
            <Typography variant="label" className={"capitalize"}>
              {item.variant}
            </Typography>
          </div>
        </div>
        <div className="flex flex-col items-start pl-10 gap-1">
          {item.selectedItems &&
            item.selectedItems.map((modifierItem, index) => {
              return item.modifiers.map((modifier) => {
                const modifierObject = modifier.modifierItems.find(
                  (item) => item._id === modifierItem
                );
                if (modifierObject)
                  return (
                    <Typography
                      variant="label"
                      key={index}
                      className="flex justify-center items-center gap-[8px]"
                    >
                      <img
                        src={modifierObject.photo}
                        className="w-[28px] h-[24px] rounded-[4px] mix-blend-darken"
                      />
                      {/* {<CircleIcon className="text-[3px] mx-[3px]" />} */}
                      {modifierObject.name}
                    </Typography>
                  );
                else return <></>;
              });
            })}
        </div>
        <div className="flex items-end gap-6 justify-between">
          <IncrementerButton
            sx={{ border: "none" }}
            quantity={item.quantity}
            unit={""}
            onDecrease={() => onDecrease(item._id, item.variant)}
            onIncrease={() => onIncrease(item._id, item.variant)}
            disabledDecrease={item.quantity <= 0}
            disabledIncrease={item.quantity >= 100}
          />
          <div className="flex gap-[8px] items-center">
            <Typography variant="h6">
              $
              {formattedNumber(
                (item.defaultPrice +
                  (item.modifierPrices || []).reduce(
                    (acc, element) => acc + element,
                    0
                  )) *
                  item.quantity
              )}
            </Typography>
            <IconButton onClick={() => onClear(item._id, item.variant)}>
              <img src={ic_trash} className="" loading="lazy" />
            </IconButton>
          </div>
        </div>
      </div>
      {!isFinal && <Divider className="my-[12px]" />}
    </div>
  );
};

export default CartItem;
