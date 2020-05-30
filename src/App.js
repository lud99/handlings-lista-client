import React, { Component } from 'react';

import { Router, Switch, Route, Redirect } from "react-router-dom";

import history from './history';

import WebSocketConnection from './WebSocketConnection';

import LoginPage from './components/login/LoginPage';
import HomePage from './components/home/HomePage';
import ListPage from './components/list/ListPage';

import OfflineSnackbar from './components/login/OfflineSnackbar';

import Utils from './Utils';

import Container from 'react-div-100vh';

class App extends Component {
    constructor(props) {
        super(props);

        this.store = props.store;

        /*this.state = {
            user: null,
            pin: localStorage.getItem("pin") || "",
            lists: null,
            isLoggedIn: false,
            isOffline: false,
            shouldLoad: false,
            resetDrag: false,
            viewOnly: false,
            showReadOnlySnackbar: false,
            showInvalidPinSnackbar: false
        }  */

        this.dev = process.env.NODE_ENV !== "production";

        const storedUrl = window.localStorage.getItem("url");

        if (storedUrl) {
            // Is mobile but opened in web browser
            if ((Utils.isMobile() && Utils.isPWA()) || (!Utils.isMobile() && Utils.isPWA()))
                history.replace(storedUrl);   
        }

        this.socket = WebSocketConnection.init(this.dev ? "ws://192.168.0.2:8080/handlings-lista" : "wss://ludvig.cloudno.de/handlings-lista", this, props.store);

        window.socket = this.socket;

        document.addEventListener("contextmenu", event => event.preventDefault())
    }

    getList = (listId) => {
        this.socket.send({ type: "get-list", listId: listId, joinSession: true });
    }

    logout = (updateState = true) => {
        // Remove the stored pin
        localStorage.removeItem("pin");

        this.state.isLoggedIn = false;

        this.state = {
            user: null,
            pin: "",
            lists: []
        }

        if (updateState) this.setState(this.state);
    }

    setShowReadOnlySnackbar = (flag) => {
        this.state.showReadOnlySnackbar = flag;
        this.setState(this.state);
    }

    setIsViewOnly = (flag) => {
        this.state.isViewOnly = flag;
        this.setState(this.state);
    }

    setShowInvalidPinSnackbar = (flag) => {
        this.state.showInvalidPinSnackbar = flag;
        this.setState(this.state);
    }

    render = () => {
        return (
            <Router history={history}>
                <Container className="app">
                    <Switch>
                    <Route path="/" exact render={() => {
                        if (!this.store.getState().loggedIn)
                            return <Redirect to="/login" />                        
                    }}>
                    </Route>

                    <Route path="/login" exact render={() => (
                        <LoginPage /> 
                    )} />

                    <Route path="/login/:pin" exact render={(context) => {
                        const pin = context.match.params.pin;

                        this.enterPin(pin);
                    }} />

                    <Route path="/home" exact render={() => (
                        <HomePage />
                    )} />
                    
                    <Route path="/list/:id" exact render={(context) => {
                        const listId = context.match.params.id;

                        return <ListPage 
                            listId={listId}
                            resetDrag={false /* TODO */} />
                    }}>
                    </Route>

                    <Route path="/view/:id" exact render={(context) => {
                        const listId = context.match.params.id;

                        this.state.viewOnly = true;

                        const currentList = this.state.lists ? findList(this.state.lists, listId) : {};
                        if (!currentList) return <Redirect to="/login" />

                        return <ListPage 
                            list={currentList}
                            listIdUrl={listId} 
                            isViewOnly={this.state.viewOnly} 
                            shouldLoad={this.state.shouldLoad}
                            showInvalidPinSnackbar={this.state.showInvalidPinSnackbar}
                            showReadOnlySnackbar={this.state.showReadOnlySnackbar} 
                            resetDrag={this.state.resetDrag} 
                            {...this} />
                    }}>
                    </Route>

                    <Route path="/logout" exact>
                        <Logout logout={this.logout} />
                    </Route>
                </Switch>
                </Container>
            </Router>
        );
    }
}

const Logout = ({ logout }) => {
    logout();

    return <Redirect to="/login" />;
}

const findList = (lists, listId) => lists.find(list => list._id === listId);
const findItem = (items, itemId) => items.find(item => item._id === itemId);

export default App;
