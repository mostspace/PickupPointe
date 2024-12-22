import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// @mui
import Link from '@mui/material/Link';
import { ListItemText } from '@mui/material';

// routes
import { RouterLink } from 'src/routes/components';
import { StyledNavItemIcon } from 'src/components/nav-section/styles';

// Components
import CustomListItem from './list-item';

// ----------------------------------------------------------------------

export const NavItem = forwardRef(
  ({ item, open, offsetTop, active, subItem, externalLink, ...other }, ref) => {
    const { title, path, children, icon } = item;

    const renderContent = (
      <CustomListItem
        ref={ref}
        disableRipple
        offsetTop={offsetTop}
        subItem={subItem}
        active={active}
        open={open}
        {...other}
      >
        {icon && <StyledNavItemIcon><img src={icon} className="w-[28px] h-[28px]" /></StyledNavItemIcon>}
        <ListItemText disableTypography primary={title} />

      </CustomListItem>
    );

    // External link
    if (externalLink) {
      return (
        <Link href={path} target="_blank" rel="noopener" underline="none">
          {renderContent}
        </Link>
      );
    }

    // Default
    return (
      <Link component={RouterLink} href={path} underline="none">
        {renderContent}
      </Link>
    );
  }
);

NavItem.propTypes = {
  active: PropTypes.bool,
  externalLink: PropTypes.bool,
  item: PropTypes.object,
  offsetTop: PropTypes.bool,
  open: PropTypes.bool,
  subItem: PropTypes.bool,
};