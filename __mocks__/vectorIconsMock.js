import React from 'react';

const MockIcon = ({ name, size, color, ...props }) => {
    return <span data-testid={`mock-icon-${name}`} {...props}>Icon: {name}</span>;
};

export default MockIcon;
