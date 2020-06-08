import React, { useState, useEffect } from 'react';

import { IconButton } from '@material-ui/core'

import EditIcon from '@material-ui/icons/Edit';

const EditButton = ({ isOn }) => { 
    const [on, setOn] = useState(false);

    useEffect(() => setOn(isOn), [isOn]);

    return (
        <IconButton color="inherit" style={{ color: on ? "rgb(195, 33, 96)" : "#fff" }} onClick={() => setOn(!on)}>
            <EditIcon />
        </IconButton> 
    )
}

export default EditButton;
