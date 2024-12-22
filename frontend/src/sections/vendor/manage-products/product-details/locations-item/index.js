import React from "react";

// @mui
import {Typography, IconButton} from '@mui/material';

// Icons
import AddIcon from '@mui/icons-material/Add';

// Components
import StoreCard from "./store-card";
import AssignModal from "./assign-modal";
import EditLocationModal from "src/components/modal/location";

// --------------------------------------------------------------------------------------------------

const LocationsItem = () => {

    /*
    //Get locations by shop
    const [selectedOptions, setSelectedOptions] = useState([]);
    const handleLocationSelectionChange = useCallback((event, newValue) => {
        setSelectedOptions(newValue);
    }, []);

    Handler for the "Assign" button click
    const handleAssignClick = () => {
        setValue("locations", selectedOptions); // Ensure the form is updated with selected locations
        handleAddPickupLocationClose();
    };

    // Fetch Shops on Component Mount
    Update selectedOptions when selectedShop changes
    useEffect(() => {
        if (selectedShop) {
            setSelectedOptions(selectedShop.locations || []); // Set locations if available
        }
    }, [selectedShop]); // This effect runs when selectedShop changes*/

    // Add Pickup Location Modal
    const [openAddPickupLocation, setOpenAddPickupLocation] = React.useState(false);
    const handleAddPickupLocationOpen = () => setOpenAddPickupLocation(true);
    const handleAddPickupLocationClose = () => setOpenAddPickupLocation(false);

    // Add New Location Modal
    const [openAddNewLocation, setOpenAddNewLocation] = React.useState(false);
    const handleAddNewLocationOpen = () => setOpenAddNewLocation(true);
    const handleAddNewLocationClose = () => setOpenAddNewLocation(false);

    return (
        <>
            <div className="flex flex-col gap-[14px] w-full">
                <div className="flex justify-between items-center gap-[14px]">
                    <Typography variant="h5" className="capitalize"> Locations This Item Can Be Ordered From</Typography>
                    <IconButton
                        sx={{
                            width: '24px',
                            minWidth: 'unset',
                            height: '24px',
                            padding: '0 !important',
                            fontSize: '10px',
                            color: '#181818',
                            borderRadius: '50%',
                            backgroundColor: '#f6f6f6',
                            textTransform: 'unset',
                        }}
                        onClick={handleAddPickupLocationOpen}
                    >
                        <AddIcon className="" sx={{ color: '#181818', fontSize: '18px' }} />
                    </IconButton>
                </div>

                <StoreCard />
            </div>

            <React.Fragment>
                <AssignModal
                  isOpen={openAddPickupLocation}
                  onClose={handleAddPickupLocationClose}
                  addNewLocation={handleAddNewLocationOpen}
                />
            </React.Fragment>

            {/* Add New Pickup Location Modal */}
            <React.Fragment>
                <EditLocationModal
                  isOpen={openAddNewLocation}
                  onClose={handleAddNewLocationClose}
                  isEditMode={false}
                  onSaveSuccess={handleAddNewLocationClose}
                />
            </React.Fragment>
        </>
    )
}

export default LocationsItem;