import React from 'react';

import { connect } from 'react-redux'

import { Link } from "react-router-dom";

import Button from '@material-ui/core/Button';

import InvalidPinSnackbar from '../InvalidPinSnackbar';
import OfflineSnackbar from './OfflineSnackbar';
import WebSocketConnection from '../../WebSocketConnection';

import { setShowInvalidPinSnackbar } from '../../redux/showInvalidPinSnackbar'

import history from '../../history';

import './Login.css';

const LoginPage = ({ pin, isOffline }) => {
    const enterPinClick = () => {
        const pin = window.prompt("Skriv in PIN");

        if (pin) {
            WebSocketConnection.login(pin, ({ success }) => {
                if (!success) return;
    
                localStorage.setItem("pin", pin);
    
                history.push("/home");
            });
        };
    }

    const loginClick = (event) => {
        event.preventDefault();

        const toHome = (success) => {
            if (success) history.push("/home");

            setShowInvalidPinSnackbar(!success);
        }

        // If already logged in
        if (WebSocketConnection.login(pin, toHome)) // Go to home when logged in
            toHome(true); // Go to home if already logged in
    }

    return (
        <>
            <InvalidPinSnackbar />
            <OfflineSnackbar />

            <div className="loginContainer">
                <h1 className="pin-title">Kontots PIN</h1>
                <p className="pin">{pin || "Laddar PIN..."}</p>
                <p className="pin-description">
                    Denna PIN är unik till ditt konto. <br />
                    Skriv in den på dina andra enheter för att länka samman dem
                </p>

                <div id="button-container">
                    <Button
                        variant="contained"
                        className="button"
                        component={Link}
                        to="/home"
                        disabled={(!pin || isOffline) ? true : false}
                        onClick={loginClick}>
                        Fortsätt
                    </Button>
                    <Button
                        variant="contained"
                        className="button"
                        disabled={(!pin || isOffline) ? true : false}
                        onClick={enterPinClick}>
                        Skriv in annan kod
                    </Button>
                </div>
            </div>
        </>
    );
}

const mapStateToProps = state => ({ 
    showInvalidPinSnackbar: state.showInvalidPinSnackbar, 
    isOffline: state.offline,
    pin: state.user.pin 
});

const mapDispatch = { setShowInvalidPinSnackbar }

export default connect(mapStateToProps, mapDispatch)(LoginPage);