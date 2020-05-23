import React, { useState, useEffect } from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const LoadingBackdrop = ({ isEnabled }) => {
    const classes = useStyles();
    const [enabled, setEnabled] = useState(true);

    useEffect(() => setEnabled(isEnabled), [isEnabled]);

    return (
        <div>
            <Backdrop className={classes.backdrop} open={enabled}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

export default LoadingBackdrop;