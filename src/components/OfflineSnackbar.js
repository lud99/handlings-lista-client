import React, { useState, useEffect } from 'react';

import { Button, Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const OfflineSnackbar = ({ isOpen, retryConnect }) => {
    const [open, setOpen] = useState(isOpen);

    useEffect(() => setOpen(isOpen), [isOpen]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway')
            return;

        setOpen(false);
    };

    const retry = (event, reason) => {
        if (reason === 'clickaway')
            return;
            
        retryConnect();
    }

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={open}
            onClose={handleClose}
            message="Kan inte ansluta till servern. Försök senare"
            action={
                <>
                    <Button color="secondary" size="small" className="offlineSnackbarRetry" onClick={retry}>Försök att återansluta</Button>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </>
            }
        />
    );
}

export default OfflineSnackbar;
