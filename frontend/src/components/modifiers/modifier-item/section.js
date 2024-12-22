import React, {useState, useRef, useEffect} from "react";
import {Typography, IconButton,} from "@mui/material";

// Components
import Item from "./item";
import Iconify from "src/components/iconify/iconify";
import IOSSwitch from "../../ios-switch/index.js";
import {useDispatch} from "react-redux";
import {updateModifierInStock} from "../../../reducers/modifierSlice.js";
import {toast} from "react-toastify";

// -------------------------------------------------------------------------------------------------

export default function Section(props) {
	const dispatch = useDispatch();
	
	const handleRemoveItem = (numberToRemove) => {
		const updatedSectionNumbers = sectionNumbers.filter((number) => number !== numberToRemove);
		setSectionNumbers(updatedSectionNumbers);
		setAppendItemComponents((prevComponents) => (
			prevComponents.filter((component) => {
				const componentNumber = parseInt(component.props.number, 10);
				return componentNumber !== numberToRemove;
			})
		));
	};

	const {removeSection, section, handleSection, index, handlePhotoFiles} = props;

	const [appendItemComponents, setAppendItemComponents] = useState([
		<Item key={1} number={1} removeItem={handleRemoveItem} section={section} handleSection={handleSection}
		      index={index}/>
	]);

	const [isInStock, setIsInStock] = useState(section.isInStock);

	const [sectionNumbers, setSectionNumbers] = useState([1]);
	const [sectionNum, setSectionNum] = useState(2);
	const itemTargetRef = useRef(null);

	const handleAddItem = () => {
		setSectionNum(prevSectionNum => prevSectionNum + 1);
		const newComponent = <Item key={sectionNum} number={sectionNum} removeItem={handleRemoveItem}/>;
		setAppendItemComponents([...appendItemComponents, newComponent]);
		setSectionNumbers([...sectionNumbers, sectionNum]);
	};

	const handleRemoveClick = () => {
		removeSection(index);
	};

	const onIsInStockChange = (e) => {
		dispatch(updateModifierInStock({id: section._id, isInStock: e.target.checked}));
		setIsInStock(e.target.checked);
		toast(`You've marked this modifier as ${e.target.checked ? "In Stock" : "Out of Stock"}.`, { type: "success", className: 'toast-custom' })
	}

	useEffect(() => {
		setAppendItemComponents([<Item key={1} number={1} removeItem={handleRemoveItem} section={section}
		                               handleSection={handleSection} index={index}
		                               handlePhotoFiles={handlePhotoFiles}/>])
	}, [props.section])
	return (
		<>
			<div className="flex flex-col gap-[16px] border rounded-[8px]">
				<div className="flex justify-between items-center p-[16px] pb-0">
					<Typography variant="subtitle1">Item {index + 1}</Typography>
					<div className="flex justify-end gap-[16px] items-center">
						<IOSSwitch checked={isInStock} onChange={onIsInStockChange}/>
						<IconButton className="bg-[#f6f6f6]" onClick={handleRemoveClick}>
							<Iconify icon="solar:trash-bin-trash-outline" width={18} className="text-heading"/>
						</IconButton>
					</div>
				</div>

				<div className="flex flex-col" ref={itemTargetRef}>
					{appendItemComponents.map((component, index) => (
						<React.Fragment key={index}>{component}</React.Fragment>
					))}
				</div>
			</div>
		</>
	);
}