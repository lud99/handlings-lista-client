import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { Button, Snackbar, IconButton } from '@material-ui/core';
import WebSocketConnection from '../../WebSocketConnection'; 
import CloseIcon from '@material-ui/icons/Close';

const OfflineSnackbar = ({ isOpen }) => {
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
            
        WebSocketConnection.reconnect(0);
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

const mapStateToProps = state => ({
    isOpen: state.offline
});

const mapDispatch = { };

export default connect(mapStateToProps, mapDispatch)(OfflineSnackbar)