import React, {useEffect, useState} from "react";
// @mui
import {Typography, IconButton,} from '@mui/material';
// Components
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Item from "./item";
import _ from 'lodash';

// --------------------------------------------------------------------------------------------------

const Modifiers = ({modifiers, selectedModifiers, handleChangePrice}) => {
  const newSelectedModifiers = new Set(selectedModifiers);
  // Maintain a set of selected item IDs
  const [selectedItems, setSelectedItems] = useState(newSelectedModifiers && newSelectedModifiers instanceof Set
    ? newSelectedModifiers
    : new Set());
  const [prices, setPrices] = useState([]);
  // State to control item content visibility
  const [expanded, setExpanded] = useState(true);
  const [selModifiers, setSelModifiers] = useState([]);

    useEffect(() => {
        console.log(selectedItems);
    }, [selectedItems]);

  // Handle item click to toggle selection
  const handleItemClick = (id, price, _id = '', limit = 1) => {
    setSelectedItems((prevSelected) => {
      const cnt = _.filter(selModifiers, {_id}).length;
      if (limit === 1) {
        const foundObjects = _.filter(selModifiers, {_id});
        const newSelected = new Set(prevSelected);
        let newPrices = [...prices];
        if (foundObjects && foundObjects.length > 0) {
          if (newSelected.has(foundObjects[0].id)) {
            // Deselect item
            newSelected.delete(foundObjects[0].id);
            // Remove corresponding price
            newPrices = newPrices.filter((p, index) => index !== [...prevSelected].indexOf(foundObjects[0].id));
          }
        }
        // Select item
        newSelected.add(id);
        newPrices.push(price); // Add price

        setPrices(newPrices);
        handleChangePrice(newPrices, newSelected);
        setSelModifiers([...selModifiers.filter(item => item._id !== _id), {_id, id}]);
        return newSelected;
      } else {
        const newSelected = new Set(prevSelected);
        let newPrices = [...prices];

        if (newSelected.has(id)) {
          // Deselect item
          newSelected.delete(id);
          // Remove corresponding price
          newPrices = newPrices.filter((p, index) => index !== [...prevSelected].indexOf(id));
          setSelModifiers([...selModifiers.filter(item => item._id === _id && item.id !== id)]);
        } else {
          if (cnt >= limit) return prevSelected;
          // Select item
          newSelected.add(id);
          newPrices.push(price); // Add price
          setSelModifiers([...selModifiers.filter(item => item._id === _id && item.id !== id), {_id, id}]);
        }

        setPrices(newPrices);
        handleChangePrice(newPrices, newSelected);

        return newSelected;
      }
    });
  };

  // Toggle expand/collapse
  const handleExpandToggle = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  return (
    <>
      <div className="w-full">
        <div className="w-full flex flex-col gap-[24px]">
          {modifiers && modifiers.map((modifier, index) => {
            return (
              <div className="w-full flex flex-col p-[16px] border rounded-[8px]" key={index}>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <Typography variant="h6">{modifier.name}</Typography>
                    {modifier.max > 1 && (
                      <Typography variant="subtitle3">You can select a maximum
                        of {modifier.max} items</Typography>
                    )}
                  </div>
                  <IconButton
                    className={`expand-item w-[32px] h-[32px] transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                    onClick={handleExpandToggle}
                  >
                    <KeyboardArrowDownIcon className="w-[20px]"/>
                  </IconButton>
                </div>
                <div
                  className={`item-container overflow-hidden transition-all duration-100 ${expanded ? 'max-h-screen mt-[24px]' : 'max-h-0'}`}>
                  <div className="flex flex-col gap-[24px]">
                    {modifier.modifierItems?.map((item) => (
                      <Item
                        key={item?._id}
                        img={item?.photo}
                        name={item?.name}
                        price={item?.price}
                        isSelected={selectedItems.has(item?._id)}
                        onClick={() => handleItemClick(item?._id, item?.price, modifier._id, modifier.max)}
                        isRadio={modifier.max === 1}
                        groupName={modifier.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  );
}

export default Modifiers;