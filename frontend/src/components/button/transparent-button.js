import React from 'react';
import PropTypes from 'prop-types';

// @mui
import { Button } from '@mui/material';

export default function TransparentButton({ value, size = '14px', color = '#181818', component = null, ...props }) {
    return (
        <Button
            {...props}
            className="flex items-center"
            sx={{
                padding: '5px 5px',
                fontFamily: 'Gilroy',
                fontSize: size,
                color: color,
                borderRadius: '8px',
                backgroundColor: 'transparent',
                textTransform: 'unset',
            }}
        >
            {value}
            {component && (
                <span className="ml-1">{component}</span> 
            )}
        </Button>
    );
}


TransparentButton.propTypes = {
    value: PropTypes.string.isRequired,
    size: PropTypes.string,
    component: PropTypes.node
};

TransparentButton.defaultProps = {
    size: '14px',
    component: null,
};
