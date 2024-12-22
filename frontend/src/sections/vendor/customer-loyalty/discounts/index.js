import React, {useEffect, useState, useRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import {toast} from "react-toastify";
// Constant
import {BASE_URL} from "src/config-global";
// @mui
import {
  Table,
  TableSortLabel,
  TablePagination,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  IconButton,
  TextField,
  Autocomplete
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
// Components
import LoadingProgress from "src/components/loading-screen/loading-progress";
import DefaultButton from 'src/components/button/default-button';
import Scrollbar from "src/components/scrollbar";
import {getLocationAddress} from "src/components/choose-location-select";
import DiscountEditModal from "src/components/modal/discount-edit/index.js";
// Sections
import {AddDiscountItem} from "./add-discount";
import {DiscountItem} from "./discount-item";
// Utilites
import axiosInstance from "src/utils/axios";
import {StyledTableContainer} from "src/utils/table-helpers";
// Reducers
import {fetchShops} from "src/reducers/shopSlice";

// --------------------------------------------------------------------------------------------------

const tableHeaderColumns = [
  {key: "discountCode", label: "Code", align: "left", sortable: true},
  {key: "discountAmount", label: "Amount", align: "center", sortable: true},
  {key: "method", label: "Method", align: "left", sortable: true},
  {key: "title", label: "Title", align: "left", sortable: false},
  {key: "description", label: "Description", align: "left", sortable: false},
  {key: "shop", label: "Shop", align: "left", sortable: false},
  {key: "location", label: "Location", align: "left", sortable: false},
  {key: "status", label: "Status", align: "left", sortable: false},
  {key: "actions", label: "Actions", align: "left", sortable: false},
];

// --------------------------------------------------------------------------------------------------

const Discounts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [discounts, setDiscounts] = useState({});
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('discountCode');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const discountItemTargetRef = useRef(null);
  const [discountChanges, setDiscountChanges] = useState([]);
  const [discountErrors, setDiscountErrors] = useState({});
  const [filteredDiscounts, setFilteredDiscounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter
  const dispatch = useDispatch();
  const {shops} = useSelector((state) => state.shops);
  const [selectedShop, setSelectedShop] = useState({});
  const [selectedLocation, setSelectedLocation] = useState({});

  useEffect(() => {
    dispatch(fetchShops());
  }, [dispatch]);

  // Handle sorting logic
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Sort function for comparing rows
  const stableSort = (array, comparator) => {
    const stabilizedArray = array.map((el, index) => [el, index]);
    stabilizedArray.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedArray.map((el) => el[0]);
  };

  // Comparator for sorting
  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
  };

  // Function to validate input fields and set errors
  const validateDiscounts = (discountChanges) => {
    const errors = {};

    discountChanges.forEach((discount, index) => {
      if (discount.type === "create") {
        let discountErrors = {};

        // Check if discountCode is empty
        if (!discount.discountCode || discount.discountCode.trim() === "") {
          discountErrors.discountCode = "Discount code is required";
        }

        // Check if title is empty
        if (!discount.title) {
          discountErrors.title = "Discount title is required";
        }

        // Check if description is empty
        if (!discount.description) {
          discountErrors.description = "Discount description is required";
        }

        // Check if discountAmount is a valid number
        if (
          !discount.discountAmount ||
          isNaN(discount.discountAmount) ||
          Number(discount.discountAmount) < 0
        ) {
          discountErrors.discountAmount = "Valid discount amount is required";
        }

        // Check if shop is selected
        if (!discount.shop || discount.shop.trim() === "") {
          discountErrors.shop = "Shop selection is required";
        }

        // Check if locations are selected
        if (!discount.locations || discount.locations.length === 0) {
          discountErrors.locations = "At least one location must be selected";
        }

        // If there are any errors for this discount, add them to the errors object
        if (Object.keys(discountErrors).length > 0) {
          errors[index] = discountErrors;
        }
      }
    });

    return errors;
  };

  const handleDiscountFieldChange = (index, field, value) => {
    let sanitizedValue = value;

    // Sanitize the input for fields other than "locations", "title", and "description"
    if (field !== "locations" && field !== "title" && field !== "description") {
      sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "");
    }

    // Update the state with the sanitized or unmodified value
    setDiscountChanges((prevChanges) =>
      prevChanges.map((discount, i) =>
        i === index ? {...discount, [field]: sanitizedValue} : discount
      )
    );
  };

  // Add a new discount
  const handleAddDiscount = () => {
    const newDiscount = {
      discountCode: "",
      discountAmount: "",
      method: "dollars",
      title: "",
      description: "",
      shop: "",
      locations: [],
      type: "create",
    };

    setDiscountChanges((prevChanges) => [...prevChanges, newDiscount]);
    setIsModalOpen(true);
  };

  // Save a new discount
  const saveDiscounts = async () => {
    const validationErrors = validateDiscounts(discountChanges);

    if (Object.keys(validationErrors).length > 0) {
      setDiscountErrors(validationErrors);
      return;
    }

    const existingDiscountCodes = discounts.discounts.map(
      (discount) => discount.discountCode
    );
    const duplicateCode = discountChanges.find((discount) =>
      existingDiscountCodes.includes(discount.discountCode)
    );

    if (duplicateCode) {
      toast(`Discount code "${duplicateCode.discountCode}" already exists!`, {
        type: "error",
        className: 'toast-custom'
      });
      return;
    }

    setDiscountErrors({});
    setLoading(true);

    try {
      const response = await axiosInstance.post(`${BASE_URL}/api/v1/vendor/update-discounts`, {discounts: discountChanges});

      if (response.status === 200) {
        setDiscountChanges([]);
        setDiscounts((prev) => ({
          ...prev,
          discounts: response.data.discounts,
        }));
        toast("Discount created successfully!", {type: "success", className: 'toast-custom'});
      }
    } catch (err) {
      toast(err.message, {type: "error", className: 'toast-custom'});
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  // Removing a discount item
  const handleRemoveDiscount = async (id, index) => {
    const discountExistsInGlobal = discounts.discounts.some(
      (discount) => discount._id === id
    );

    if (discountExistsInGlobal) {
      setDiscounts((prevSettings) => ({
        ...prevSettings,
        discounts: prevSettings.discounts.filter((discount) => discount._id !== id),
      }));

      try {
        const response = await axiosInstance.post(
          `${BASE_URL}/api/v1/vendor/update-discounts`,
          {discounts: [{type: "delete", id}]}
        );

        if (response.status === 200) {
          setDiscounts((prev) => ({
            ...prev,
            discounts: response.data.discounts,
          }));
          toast("Discount deleted successfully!", {type: "success", className: 'toast-custom'});
        }
      } catch (err) {
        toast(err.message, {type: "error", className: 'toast-custom'});
      }
    } else {
      setDiscountChanges((prevChanges) =>
        prevChanges.filter((_, i) => i !== index)
      );
    }
  };

  // Update add or delete discount item status
  const updateActiveStatus = async (id, isSwitchActive) => {
    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/api/v1/vendor/change-discount-status/${id}`,
        {}
      );

      if (response.status === 200) {
        const updatedDiscount = response.data.discount;

        setDiscounts((prevSettings) => {
          return {
            ...prevSettings,
            discounts: prevSettings.discounts.map((discount) =>
              discount._id === updatedDiscount._id ? updatedDiscount : discount
            ),
          };
        });
        toast(`Discount code has been ${isSwitchActive ? 'activated' : 'deactivated'}!`, {
          theme: "light",
          className: 'toast-custom',
          style: {
            backgroundColor: "white",
            color: "primary",
          },
        });
      }
    } catch (err) {
      toast(err.message, {type: "error", className: 'toast-custom'})
    }
  };

  // Get all discounts
  const getDiscounts = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`${BASE_URL}/api/v1/vendor/get-discounts`);
      const discountsData = response.data;

      // Apply shop and location filters
      let filtered = discountsData.discounts;

      if (selectedShop?._id) {
        filtered = filtered.filter(discount => discount.shop?._id === selectedShop._id);
      }

      if (selectedLocation?._id) {
        filtered = filtered.filter(discount =>
          discount.locations?.some(loc => loc._id === selectedLocation._id)
        );
      }

      setDiscounts(discountsData);
      setFilteredDiscounts(filtered);
    } catch (err) {
      toast(err.message, {type: "error", className: 'toast-custom'});
    } finally {
      setIsLoading(false);
    }
  };

  const resetLocationFilter = () => {
    setSelectedLocation({});
    setFilteredDiscounts(discounts.discounts || []);
  };

  useEffect(() => {
    if (selectedShop?._id || selectedLocation?._id) {
      let filtered = discounts.discounts;

      if (selectedShop?._id) {
        filtered = filtered.filter(discount => discount.shop?._id === selectedShop._id);
      }

      if (selectedLocation?._id) {
        filtered = filtered.filter(discount =>
          discount.locations?.some(loc => loc._id === selectedLocation._id)
        );
      }

      setFilteredDiscounts(filtered || []);
    } else {
      setFilteredDiscounts(discounts.discounts || []);
    }
  }, [selectedShop, selectedLocation, discounts]);

  useEffect(() => {
    getDiscounts();
  }, []);

  const paginatedDiscounts = stableSort(filteredDiscounts || [], getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="relative flex flex-col gap-[14px]">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-[5px]">
          <Typography variant="h5" className="capitalize">My Saved Discounts</Typography>
          <Typography variant="subtitle3">Create unlimited discount codes.</Typography>
        </div>

        <IconButton className="bg-[#F5F5F5] p-[5px]" onClick={handleAddDiscount}>
          <AddIcon className="text-[20px] text-heading"/>
        </IconButton>
      </div>

      {/*<div className="flex flex-col gap-[20px] mb-2" ref={discountItemTargetRef}>
        {discountChanges?.map((discount, index) =>
            discount.type === "create" && (
              <AddDiscountItem
                key={index}
                discount={discount}
                discountTextError={discountErrors[index]?.error}
                index={index}
                handleDiscountChange={handleDiscountFieldChange}
                handleRemoveDiscount={handleRemoveDiscount}
                discountErrors={discountErrors[index] || {}}
              />
            )
        )}

        <div className="flex justify-end">
          {discountChanges.length > 0 && (
            <DefaultButton
              value="Save discount"
              onClick={saveDiscounts}
              loading={loading}
            />
          )}
        </div>
      </div>*/}

      <div className="w-full flex justify-between gap-[16px]">
        <Autocomplete
          fullWidth
          disablePortal
          options={shops || []}
          getOptionLabel={(option) => option.name || ''}
          value={selectedShop}
          onChange={(e, newValue) => {
            setSelectedShop(newValue || {});
            resetLocationFilter();
          }}
          popupIcon={<KeyboardArrowDownOutlinedIcon/>}
          noOptionsText="No shops"
          renderInput={(params) => (
            <TextField {...params} variant="outlined" placeholder="Choose shop" className="line-clamp-1"/>
          )}
        />
        <Autocomplete
          fullWidth
          disablePortal
          disabled={!selectedShop?._id}
          options={selectedShop?.locations || []}
          getOptionLabel={(option) => getLocationAddress(option) || ''}
          value={selectedLocation}
          onChange={(e, newValue) => setSelectedLocation(newValue || {})}
          popupIcon={<KeyboardArrowDownOutlinedIcon/>}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" placeholder="Choose locations" className="line-clamp-1"/>
          )}
        />
      </div>

      {isLoading ? (
        <div className="w-full h-full relative flex items-center justify-center">
          <LoadingProgress sx={{width: '50px', marginTop: '80px'}}/>
        </div>
      ) : (
        <StyledTableContainer component={Paper} className="overflow-x-auto">
          <Table sx={{minWidth: 650}} aria-label="discount table">
            <TableHead>
              <TableRow>
                {tableHeaderColumns.map(({key, label, align, sortable}) => (
                  <TableCell
                    key={key}
                    sortDirection={sortable && orderBy === key ? order : false}
                    align={align}
                    className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase"
                  >
                    {sortable ? (
                      <TableSortLabel
                        active={orderBy === key}
                        direction={orderBy === key ? order : "asc"}
                        onClick={() => handleRequestSort(key)}
                      >
                        {label}
                      </TableSortLabel>
                    ) : (
                      label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedDiscounts.length > 0 ? (
                paginatedDiscounts.map((discount, index) => (
                  <DiscountItem
                    key={discount._id}
                    discount={discount}
                    index={index}
                    handleRemoveDiscount={handleRemoveDiscount}
                    id={discount._id}
                    isActive={discount.isActive}
                    updateActiveStatus={updateActiveStatus}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center" className="font-gilroy text-gray-500">
                    No discounts
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination
            className="!font-gilroy w-full flex justify-end"
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={discounts.discounts?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              fontFamily: 'Gilroy, sans-serif',
              '.MuiTablePagination-displayedRows': {
                fontFamily: 'Gilroy, sans-serif',
              },
              '.MuiTablePagination-input': {
                fontFamily: 'Gilroy, sans-serif',
              },
              '.MuiTablePagination-selectIcon': {
                fontFamily: 'Gilroy, sans-serif',
                marginTop: '1px',
              },
              '.MuiTablePagination-select': {
                border: '1px solid #ffffff',
                borderRadius: '4px',
                fontFamily: 'Gilroy, sans-serif',
                marginRight: '10px',
                marginTop: '4px',
              },
            }}
          />
        </StyledTableContainer>
      )}

      <DiscountEditModal
        isOpen={isModalOpen}
        discount={discountChanges[0] || {}}
        discountErrors={discountErrors}
        handleDiscountChange={handleDiscountFieldChange}
        handleRemoveDiscount={handleRemoveDiscount}
        closeModal={() => setIsModalOpen(false)}
        saveDiscount={saveDiscounts}
        loading={loading}
      />
    </div>
  );
};

export default Discounts;