import { useState, useCallback, useEffect } from 'react';

// @components
import ChooseLocation from 'src/components/choose-location-select';
import SearchField from 'src/components/search-filed';
import TabPanel from 'src/components/tab';
import Iconify from 'src/components/iconify';
import UserStatusSelect from 'src/components/user-status-select';

// Modal imports
import { useModalDispatch, useModalState } from 'src/contexts/ModalContext';
import GeneralModal from 'src/components/modal';

// Modal forms
import EditUserForm from './view/forms/edit-user-form';
import SuspendedAccessForm from './view/forms/suspended-access-form';
import ResetPasswordForm from './view/forms/reset-password';
import AddUserForm from './view/forms/add-user-form';

// assets import
import successImg from 'src/assets/images/_success-form.png';

// @mui
import {
  Table, Paper, TableContainer, TableHead, Box, styled, TableRow, TableBody, TableCell, IconButton, Pagination, Tabs, Tab, Popover, MenuItem, Typography, Grid,
} from '@mui/material';

import DefaultButton from 'src/components/button/default-button';
import { addUser, editUser, getUsers, resetPassword } from 'src/api/vendor/users';
import { toast } from 'react-toastify';
import { CLOSE_MODAL, ERROR_MODAL } from 'src/reducers/modalReducer';
import { getAllLocations } from 'src/reducers/locationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import ButtonLoader from 'src/components/button-loader/ButtonLoader';
import LoadingProgress from 'src/components/loading-screen/loading-progress';
import { StyledPagination } from 'src/utils/table-helpers';
import UserForm from "./view/forms/user-form.js";

// Define styled components for consistent styling
const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    width: 'max-content',
    '&.Mui-selected': {
      color: 'primary',
      fontWeight: '500',
    },
  })
);

const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className='MuiTabs-indicatorSpan' /> }}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'start',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    width: 'max-content',
  },
});

// Styled Table Container to handle overflow and styling
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  overflowX: 'auto',
  border: '1px solid #ccc',
  scrollBehavior: 'smooth',
  scrollbarWidth: 'thin',
  msScrollbarBaseColor: 'red',
}));

// Main component for managing users
const ManageUsers = () => {
  // Access theme
  const modalState = useModalState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null)

  const tabObj = {
    0: '',
    1: 'Active',
    2: 'Suspended',
    3: 'Inactive',
  }
  const [userPayload, setUserPayload] = useState({
    pageSize: 10,
    page: 1,
    totalPage: 0,
    searchKey: '',
    status: '',
    locations: [],
  });
  
  const [usersData, setUsersData] = useState([]);
  const [modalContent, setModalContent] = useState({
    heading: '',
    paragraph: '',
    component: null,
  });
  // Awaiting Pickup Popper Menu
  const [openUserEdit, setOpenUserEdit] = useState(null);
  const [userEdit, setUserEdit] = useState();

  const modalDispatch = useModalDispatch();
  const dispatch = useDispatch();

  const { locations } = useSelector((state) => state.locations);

  const handleUserEditOpen = (event, user) => {
    setSelectedUser(user);
    setOpenUserEdit(event.currentTarget);
    setUserEdit(user)
  };

  const handleUserEditClose = () => {
    setOpenUserEdit(null);
  };

  // Handler for search text change
  const debounce_searchKey = debounce((value) => {
    setUserPayload({
      ...userPayload,
      searchKey: value
    })
  }, 500);

  const handleSearchTextChange = useCallback((e) => {
    setSearchText(e.target.value);
    debounce_searchKey(e.target.value);
  }, []);

  // Handler for location selection change
  const debounce_locations = debounce((value) => {
    setUserPayload({
      ...userPayload,
      locations: value
    })
  }, 500);

  const handleLocationSelectionChange = useCallback((event, newValue) => {
    setSelectedOptions(newValue);
    debounce_locations(newValue.map(elem => elem._id))
  }, []);

  // Handler for tab change
  const handleTabChange = useCallback((event, newValue) => {
    setTabValue(newValue);
    setUserPayload({
      ...userPayload,
      page: 1,
      status: tabObj[newValue]
    })
  }, []);

  // Handler for location selection change for a specific user
  const debounce_edit_locations = useCallback(debounce((userId, newValue) => {
    onEditUser(userId, {
      locations: newValue.map(elem => elem._id)
    }, {
      skipCallBack: true,
      loading: false
    })
  }, 500), [])
  const handleSelectionChange = useCallback((userId, newValue) => {
    const newUsersData = [...usersData];
    const existedIndex = newUsersData.findIndex(user => user._id === userId);
    if (existedIndex > -1) {
      newUsersData[existedIndex].locations = newValue
    }
    setUsersData(newUsersData);
    debounce_edit_locations(userId, newValue)
  }, [usersData]);

  // Handler for status change for a specific user
  const handleStatusChange = async (userId, newStatus, row) => {
    if (newStatus === 'Suspended') {
      setUserEdit(row)
      handleOpenModal('suspend', userId)
    } else {
      onEditUser(userId, {
        status: newStatus
      }, {
        skipCallBack: true,
        loading: false
      })
    }
  };

  const onEditUser = async (userId, payload, options = {
    skipCallBack: false,
    loading: true,
  }) => {
    if (options.skipCallBack || modalState.callback()) {
      try {
        const response = await editUser(userId, payload);
        await getListUser(options.loading);
        modalDispatch({
          type: CLOSE_MODAL,
        })
        let toastMessage = "Edit User Successful"
        switch (response.user.status) {
          case 'Active':
            toastMessage = "User activated";
            break;
          case 'Inactive':
            toastMessage = "User deactivated";
            break;
          case 'Suspended':
            toastMessage = "User suspended";
            break;
          default:
            break;
        }
        if (payload.locations) {
          toastMessage = "Edit User Successful";
        }
        toast(toastMessage, {
          type: 'success',
          className: 'toast-custom',
        });
      } catch (error) {
        toast("Edit User Failed", {
          type: 'error',
          className: 'toast-custom',
        });
      }
    }
  }

  const onSuspendedConfirm = async (userId) => {
    await onEditUser(userId, {
      status: 'Suspended'
    }, {
      skipCallBack: true,
      loading: false
    })
  }

  const handleAddUserPrimaryClick = async (payload) => {
    if (modalState.callback()) {
      try {
        const newPayload = {
          ...payload
        }
        delete newPayload.confirmPassword
        console.log(payload);
        return
        const result = await addUser(payload);
        await getListUser(true);
        toast("Add User Successful", {
          type: 'success',
          className: 'toast-custom',
        });
        modalDispatch({
          type: CLOSE_MODAL,
        })
      } catch (error) {
        if (error.message) {
          modalDispatch({
            type: ERROR_MODAL,
            error: error.message,
          })
        } else {
          toast(error.message, {
            type: 'error',
            className: 'toast-custom',
          });
        }
      }
    }
  }

  const handleEditUserPrimaryClick = async (payload) => {
    await onEditUser(userEdit._id, payload)
  }

  const handleOpenModal = (mode) => {
    if (mode === "add") {
      setSelectedUser(null);
    }
    setIsModalOpen(true);
  }

  const onPrimaryClick = (data, type) => {
    switch (type) {
      case 'add-user':
        return handleAddUserPrimaryClick(data);
      case 'edit':
        return handleEditUserPrimaryClick(data);
      case 'suspend':
        return onSuspendedConfirm(userEdit._id);

      case 'information':
        return handleAddUserPrimaryClick(data);
      default:
        break;
    }
  }

  // Function to generate props for tabs
  const tabProps = useCallback(
    (index) => ({
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    }),
    []
  );

  const getListUser = async (loading = false) => {
    if (loading) {
      setIsLoading(true);
    }
    try {
      const data = await getUsers(userPayload);
      setUserPayload({
        ...userPayload,
        totalPage: Math.ceil(data.totalResults / userPayload.pageSize)
      })
      setUsersData(data.users);
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  const onChangePage = (_event, value) => {
    setUserPayload({
      ...userPayload,
      page: value
    })
  }

  useEffect(() => {
    getListUser(true);
  }, [userPayload.page, userPayload.searchKey, userPayload.locations, userPayload.status]);

  useEffect(() => {
    dispatch(getAllLocations());
  }, [])

  return (
    <div className='flex flex-col gap-[32px] sm:gap-[48px]'>
      <div className='flex flex-col gap-[24px] sm:gap-[32px]'>
        <Grid container rowSpacing={2}>
          <Grid item xs={12} md={12} lg={6}>
            <Typography variant='h6'>Choose Location</Typography>
          </Grid>

          <Grid item xs={12} md={12} lg={6}>
            <ChooseLocation
              options={locations}
              selectedOptions={selectedOptions}
              onSelectionChange={handleLocationSelectionChange}
            />
          </Grid>
        </Grid>

        <Grid container alignItems='flex-end' rowSpacing={2}>
          <Grid item xs={12} md={12} lg={6}>
            <Typography variant="h6">Find User</Typography>
          </Grid>
          <Grid item xs={12} md={12} lg={6}>
            <SearchField value={searchText} onChange={handleSearchTextChange} />
          </Grid>
        </Grid>
      </div>

      <Grid container>
        <Grid item xs={12} md={12} lg={12}>
          <div id='tabs' className='flex flex-col gap-[24px]'>
            <div id='tab-label' className='sm:flex justify-between items-center'>
              <Box
                sx={{ borderBottom: 1, borderColor: 'divider' }}
                className='mb-5 sm:mb-0'
              >
                <StyledTabs
                  value={tabValue}
                  onChange={handleTabChange}
                  indicatorColor='heading'
                  aria-label='Input Preference'
                  variant='scrollable'
                  scrollButtons='auto'
                >
                  <StyledTab
                    label={'All'}
                    {...tabProps(0)}
                    className='!font-gilroy !text-[14px] !normal-case'
                  />
                  <StyledTab
                    label={tabObj[1]}
                    {...tabProps(1)}
                    className='!font-gilroy !text-[14px] !normal-case'
                  />
                  <StyledTab
                    label={tabObj[2]}
                    {...tabProps(2)}
                    className='!font-gilroy !text-[14px] !normal-case'
                  />
                  <StyledTab
                    label={tabObj[3]}
                    {...tabProps(3)}
                    className='!font-gilroy !text-[14px] !normal-case'
                  />
                </StyledTabs>
              </Box>
            </div>

            <div id='tab-panel' className='relative'>
              <TabPanel>
                {isLoading ? (
                  <div className='w-full h-full relative flex items-center justify-center'>
                    <LoadingProgress sx={{width: '50px', marginTop: '80px'}} />
                  </div>
                ) : (
                  <div className='flex flex-col gap-[48px]'>
                    <StyledTableContainer
                      component={Paper}
                      className='overflow-x-auto'
                    >
                      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                        <TableHead>
                          <TableRow>
                            <TableCell align='left' className='font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase'>
                              ID
                            </TableCell>
                            <TableCell align='left' className='font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase'>
                              USER
                            </TableCell>
                            <TableCell align='left' className='font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase'>
                              STATUS
                            </TableCell>
                            <TableCell align='left' className='font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase'>
                              Location
                            </TableCell>
                            <TableCell align='left' className='font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase'></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {usersData.map((row) => (
                            <TableRow
                              key={row.pickupId}
                              sx={{
                                '&:last-child td, &:last-child th': { border: 0 },
                              }}
                            >
                              <TableCell
                                align='left'
                                className='font-gilroy text-[12px] text-heading'
                              >
                                {row.pickupId}
                              </TableCell>
                              <TableCell
                                align='left'
                                className='font-gilroy text-[12px] text-heading'
                                sx={{minWidth: 130}}
                              >
                                {row.firstName} {row.lastName}
                              </TableCell>
                              <TableCell
                                align='left'
                                className='font-gilroy text-[12px] text-heading'
                              >
                                <UserStatusSelect
                                  status={row.status}
                                  onChange={(e) => {
                                    handleStatusChange(row._id, e.target.value, row); // Update user status
                                  }}
                                />
                              </TableCell>
                              <TableCell
                                align='left'
                                className='font-gilroy text-[12px] text-heading w-full'
                              >
                                <ChooseLocation
                                  options={locations}
                                  selectedOptions={row.locations}
                                  onSelectionChange={(e, newValue) => {
                                    handleSelectionChange(row._id, newValue);
                                  }}
                                  chipClassName={'text-xs font-gilroy'}
                                  listClassName={'line-clamp-1'}
                                  limitTags={1}
                                // showButtons={true}
                                />
                              </TableCell>
                              <TableCell align='center'>
                                <div className='flex'>
                                  <IconButton
                                    size='large'
                                    color='inherit'
                                    className='p-2'
                                    onClick={(e) => handleUserEditOpen(e, row)}
                                  >
                                    <Iconify icon={'eva:more-vertical-fill'} className="text-[14px]" />
                                  </IconButton>

                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell align='center' colSpan={5}>
                              <div className='flex justify-start lg:justify-end'>
                                <StyledPagination
                                  count={userPayload.totalPage}
                                  onChange={onChangePage}
                                  showFirstButton
                                  showLastButton
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </StyledTableContainer>
                  </div>
                )}
              </TabPanel>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <div className='flex justify-end mt-10'>
            <DefaultButton value={'Add new user'} onClick={() => handleOpenModal('add')} />
          </div>
        </Grid>
      </Grid>

      {/* Awaiting Pickup Popover */}
      <Popover
        open={Boolean(openUserEdit)}
        anchorEl={openUserEdit}
        onClose={handleUserEditClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 200,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem className='!font-gilroy' onClick={() => handleOpenModal('edit')}>
          Edit user details
        </MenuItem>
      </Popover>

      <GeneralModal
        heading={modalContent.heading}
        paragraph={modalContent.paragraph}
        img={modalContent.img}
        primaryButtonValue={modalContent.primaryButtonValue}
        secondaryButtonValue={modalContent.secondaryButtonValue}
        onPrimaryClick={(data) => onPrimaryClick(data, modalContent.type)}
      >
        {modalContent.component}
      </GeneralModal>
      <UserForm
        isOpen={isModalOpen}
        selectedUser={selectedUser}
        onClose={() => setIsModalOpen(false)}
        getListUser={getListUser}
      />
    </div>
  );
};

export default ManageUsers;