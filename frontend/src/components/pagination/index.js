import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function BasicPagination({ count, page, handleChange, itemsPerPage }) {
  // Ensure count and itemsPerPage are numbers and prevent division by zero
  const validCount = Number(count) || 0;
  const validItemsPerPage = Number(itemsPerPage) || 1; // Default to 1 if itemsPerPage is not provided or is 0
  
  return (
    <Stack spacing={2}>
      <Pagination 
        count={Math.ceil(validCount / validItemsPerPage)} // Safely calculate count
        page={page}
        onChange={handleChange}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
      />
    </Stack>
  );
}
