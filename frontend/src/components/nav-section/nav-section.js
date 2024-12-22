import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, List, ListItemText } from '@mui/material';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
  return (
    <Box {...other}>
      <List className='flex flex-col gap-[16px]'>
        {data.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
};

function NavItem({ item }) {
  const { title, path, icon, info } = item;

  return (
    <StyledNavItem
      component={RouterLink}
      to={path}
    >
      {icon && (
        <div className='flex items-center justify-center pr-[12px]'>
          <img src={icon} className="w-[24px] h-[24px] object-contain" />
        </div>
      )}
      <ListItemText disableTypography primary={title} className='text-[16px]' />
      <ArrowForwardIosIcon className="text-[15px]" />
      {info && info}
    </StyledNavItem>
  );
}