import { useEffect, useState } from "react";
import { getModifiers } from "src/api/vendor/modifier";
// @mui
import { Typography, IconButton } from '@mui/material';
// Icons
import AddIcon from '@mui/icons-material/Add';
// Components
import ModifierItem from './modifier-item';
import Pagination from "src/components/pagination";
import LoadingProgress from "../loading-screen/loading-progress";

// --------------------------------------------------------------------------------------------------

const Modifiers = () => {
    const [isLoading, setIsLoading] = useState(false);
    // State to keep track of modifier items
    const [modifiers, setModifiers] = useState([]); // Start with an empty array
    
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    const handleChange = (event, value) => {
        setPage(value);
    };

    // Function to add a new modifier item
    const handleAddModifier = () => {
        setModifiers((prevModifiers) => [
            ...prevModifiers,
            { id: prevModifiers.length, modifierItems: [
                { number: 0, item_name: "", price: "" }
            ], isCreate: true },
        ]);
        setPage(Math.floor(((modifiers.length + 1) / itemsPerPage)) + 1);
        setTimeout(() => {
            window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
        }, 300)
    };

    const fetchModifiersData = async () => {
        setIsLoading(true);
        try {
            const res = await getModifiers();
            setModifiers(res.modifiers || []);
        } catch (error) {
            toast.error("Failed to fetch modifiers", { className: 'toast-custom' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchModifiersData()
    }, [])

    const displayedModifiers = modifiers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="w-full flex flex-col gap-[48px]">
            <div className="w-full flex flex-col gap-[20px]">
                <div className="flex justify-between items-center">
                    <Typography variant="h5" className="capitalize">Modifier Groups</Typography>
                    <IconButton sx={{ backgroundColor: '#f6f6f6' }} onClick={handleAddModifier}>
                        <AddIcon sx={{ color: '#181818', fontSize: '18px' }} />
                    </IconButton>
                </div>
                <div className="w-full flex flex-col gap-[20px]">
                    {isLoading ? (
                        <div className="w-full h-full flex justify-center items-center relative">
                            <LoadingProgress sx={{ width: '50px', marginTop: '100px' }} />
                        </div>
                    ) : (
                        <>
                            {displayedModifiers.length === 0 ? (
                                <Typography variant="subtitle1" className="text-center my-10">
                                    No modifier groups created yet
                                </Typography>
                            ) : (
                                displayedModifiers.map((modifier) => (
                                    <ModifierItem key={modifier.id} modifier={modifier} setModifiers={setModifiers} />
                                ))
                            )}
                            {displayedModifiers.length > 0 && !isLoading && (
                                <div className="flex justify-center mt-[32px]">
                                    <Pagination
                                        count={modifiers.length}
                                        page={page}
                                        handleChange={handleChange}
                                        itemsPerPage={itemsPerPage}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Modifiers;