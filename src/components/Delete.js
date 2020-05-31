import React from 'react';

import { IconButton } from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import Grow from '@material-ui/core/Grow';

const Delete = ({ style, onClick, enabled, className }) => {
    const click = (event) => {
        event.stopPropagation();

        onClick(event);
    }

    return (
        <Grow in={enabled}>
            <IconButton edge="end" className={className} color="inherit" aria-label="delete" style={style} onClick={click}>
                <DeleteIcon />
            </IconButton> 
        </Grow>    
    )
}

Delete.defaultProps = {
    enabled: true,
}

export default Delete;