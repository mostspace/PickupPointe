import React, {useState, useRef, useEffect} from "react";
import { useFormContext } from "react-hook-form"; // Assuming you are using react-hook-form

// @mui
import {FormControlLabel, Typography, Button,} from '@mui/material';

// Components
import IOSSwitch from "src/components/ios-switch";
import PromotionsItem from './promotions-item';

// Icons
import AddIcon from '@mui/icons-material/Add';

// --------------------------------------------------------------------------------------------------

const SpecialTimedPromotions = () => {
    const { watch, setValue } = useFormContext(); // Access watch and setValue from context
    const promotionsItemTargetRef = useRef(null);

    const handleTimePromotionOpen = (value) => {
        setValue("isUseTimePromotion", value)
    };

    // ====================================== Handle Promotions Item =============================================
    // Appending promotions item
    const [appendPromotionsItem, setAppendPromotionsItem] = useState([]);

    useEffect(() => {
        let promotionData = watch("timePromotions");
        if (promotionData && promotionData.length > 0) {
            setAppendPromotionsItem(promotionData.map((item, key) => <PromotionsItem key={key} number={key} data={promotionData}/>));
            setPromotionsItemNum(promotionData.length);
        } else {
            setAppendPromotionsItem([<PromotionsItem key={0} number={0} data={promotionData}/>]);
        }

    }, [watch("timePromotions"), watch("isUseTimePromotion")]);

    const [promotionsItemNum, setPromotionsItemNum] = useState(1);

    const handleAddPromotionsItem = () => {
        const newPromotionsItem = <PromotionsItem key={promotionsItemNum} number={promotionsItemNum}  />;
        setAppendPromotionsItem((prev) => [...prev, newPromotionsItem]);
        setPromotionsItemNum(prev => prev + 1);
    };

    return (
        <div className="w-full flex flex-col gap-[14px]">
            <div className="w-full flex justify-between items-center">
                <Typography variant="h5" className="capitalize">Special timed promotions</Typography>
                <FormControlLabel className="!text-[10px] m-0"
                    control={
                        <IOSSwitch
                            checked={watch("isUseTimePromotion") ?? false}
                            onChange={event => handleTimePromotionOpen(event.target.checked)}
                            aria-label="Toggle special timed promotions"
                        />
                    }
                />
            </div>

            {!watch("isUseTimePromotion") ?
                <Typography variant='subtitle1' className='text-center mt-10'>No timed promotions created yet</Typography>
                : (
                    <div className="w-full flex flex-col border rounded-[8px] p-[15px] sm:p-[20px] gap-[20px]" ref={promotionsItemTargetRef}>
                        {appendPromotionsItem.map((component) => (
                            <React.Fragment key={component.key}>
                                {component}
                            </React.Fragment>
                        ))}

                        <div className="flex">
                            <Button
                                sx={{
                                    width: 'inherit',
                                    padding: '8px 24px',
                                    fontFamily: 'Gilroy',
                                    fontSize: '14px',
                                    color: '#181818',
                                    borderRadius: '8px',
                                    backgroundColor: '#F5F5F5',
                                    textTransform: 'unset',
                                }}
                                onClick={handleAddPromotionsItem}
                                aria-label="Add new promotion"
                            >
                                <AddIcon className="mr-2 text-heading text-[18px]"/> Add new promotion
                            </Button>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default SpecialTimedPromotions;