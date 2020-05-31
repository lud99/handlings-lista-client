import React from 'react';

import { connect } from 'react-redux'
import { Button, Snackbar, IconButton } from '@material-ui/core';
import { setShowReadOnlySnackbar } from '../redux/showReadOnlySnackbar';
import { setShowInvalidPinSnackbar } from '../redux/showInvalidPinSnackbar';
import CloseIcon from '@material-ui/icons/Close';

import history from '../history';
import WebSocketConnection from '../WebSocketConnection';

const ReadOnlySnackbar = ({ isOpen, setOpen, setShowInvalidPinSnackbar, listId }) => {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway')
            return;

        setOpen(false);
    };

    const loginClick = (event, reason) => {
        if (reason === 'clickaway')
            return;

        const pin = prompt("Skriv in PIN");

        if (pin) 
            WebSocketConnection.login(pin, ({ success }) => {
                if (success) {
                    history.push(`/list/${listId}`)
                } else { 
                    setOpen(false);
                    setShowInvalidPinSnackbar(true);
                }
            });
    }

    return (
        <Snackbar
            className="readOnlySnackbar"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            open={isOpen}
            onClose={handleClose}
            message="Du visar denna lista i skrivskyddat läge. Den går inte att redigera om du inte loggar in"
            action={
                <>
                    <Button color="secondary" size="medium" className="offlineSnackbarRetry" onClick={loginClick}>Logga in</Button>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                </>
            }
        />
    );
}

const mapStateToProps = state => ({ 
    isOpen: state.showReadOnlySnackbar,
});

const mapDispatch = { setOpen: setShowReadOnlySnackbar, setShowInvalidPinSnackbar }

export default connect(mapStateToProps, mapDispatch)(ReadOnlySnackbar);