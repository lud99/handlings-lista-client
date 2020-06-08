import React from 'react';

import { IconButton } from '@material-ui/core';

import DoneIcon from '@material-ui/icons/Done';

const ListCompletedButton = ({ onClick, style }) => {
    return (
        <IconButton className="listCompleted" color="inherit" aria-label="complete" onClick={onClick} style={style}>
            <DoneIcon />
        </IconButton>
    )
};

export default ListCompletedButton;