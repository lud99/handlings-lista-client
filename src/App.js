import React, { Component } from 'react';

import { Router, Switch, Route, Redirect } from "react-router-dom";

import { logout } from './redux/user';
import { setViewOnly } from './redux/viewOnly';
import { setCurrentListId } from './redux/currentList';

import history from './history';
import WebSocketConnection from './WebSocketConnection';
import Utils from './Utils';
import Container from 'react-div-100vh';

import LoginPage from './components/login/LoginPage';
import HomePage from './components/home/HomePage';
import ListPage from './components/list/ListPage';

class App extends Component {
    constructor(props) {
        super(props);

        this.store = props.store;

        this.dev =true// process.env.NODE_ENV !== "production";

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

                        this.socket.login(pin, ({ success }) => success && history.push("/home"));
                    }} />

                    <Route path="/home" exact render={() => (
                        <HomePage />
                    )} />
                    
                    <Route path="/list/:id" exact render={(context) => {
                        const listId = context.match.params.id;

                        this.store.dispatch(setViewOnly(false));
                        this.store.dispatch(setCurrentListId(listId));

                        return <ListPage listId={listId} />
                    }}>
                    </Route>

                    <Route path="/view/:id" exact render={(context) => {
                        const listId = context.match.params.id;

                        this.store.dispatch(setViewOnly(true));

                        return <ListPage listId={listId} />
                    }}>
                    </Route>

                    <Route path="/logout" exact render={() => {
                        this.store.dispatch(logout());

                        return <Redirect to="/login" />
                    }}>
                    </Route>
                    <Route>
                        <Redirect to="/login" />
                    </Route>
                </Switch>
                </Container>
            </Router>
        );
    }
}


const findList = (lists, listId) => lists.find(list => list._id === listId);
const findItem = (items, itemId) => items.find(item => item._id === itemId);

export default App;
