import React from 'react';
import { TableContainer, TableCell, Pagination } from '@mui/material';
import { styled } from '@mui/system';

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  overflowX: 'auto', // Enable vertical scrolling
  border: '1px solid #ccc', // Add a border to the container
  scrollBehavior: 'smooth',
  scrollbarWidth: 'thin',
  msScrollbarBaseColor: 'red'
}));

export const StyledPagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPaginationItem-root.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    border: 'none',
  },
  '& .MuiPaginationItem-root:hover': {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    border: 'none',
  },
}));

export const CustomTableCell = ({ children, align = "left", className = "" }) => (
  <TableCell align={align} className={`font-gilroy text-[14px] text-heading ${className}`}>
    {children}
  </TableCell>
);