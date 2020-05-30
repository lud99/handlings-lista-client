import React from 'react';

import { IconButton } from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';

const Delete = ({ style, onClick, enabled, className }) => {
    const click = (event) => {
        event.stopPropagation();

        onClick(event);
    }

    return (
        <>
            { enabled && <IconButton edge="end" className={`listItemDelete ${className}`} color="inherit" aria-label="delete" style={style} onClick={click}>
                <DeleteIcon />
            </IconButton> }     
        </>
    )
}

Delete.defaultProps = {
    enabled: true,
}

export default Delete;