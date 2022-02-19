import React, { Component } from 'react';

import { Router, Switch, Route, Redirect } from "react-router-dom";

import { logout } from './redux/user';
import { setViewOnly } from './redux/viewOnly';
import { setCurrentListId } from './redux/currentList';

import history from './history';
import WebSocketConnection from './WebSocketConnection';
import Utils from './Utils';
import Container from 'react-div-100vh';

import StartPage from './components/start/StartPage';
import LoginPage from './components/login/LoginPage';
import HomePage from './components/home/HomePage';
import ListPage from './components/list/ListPage';

class App extends Component {
    constructor(props) {
        super(props);

        this.store = props.store;

        this.dev = process.env.NODE_ENV !== "production";

        const storedUrl = window.localStorage.getItem("url");

        if (storedUrl) {
            // Is mobile but opened in web browser
            if ((Utils.isMobile() && Utils.isPWA()) || (!Utils.isMobile() && Utils.isPWA()))
                history.replace(storedUrl);   
        }

        if (window.location.pathname !== "/") {
            
            this.connect();
        }

        document.addEventListener("contextmenu", event => event.preventDefault());
    }

    connect() {
        if (this.socket) return;

        this.socket = WebSocketConnection.init(this.dev ? "ws://192.168.0.2:8080/handlings-lista" : "wss://ludvigdb.tk:1234/handlingslista", this, this.props.store);

        window.socket = this.socket;
    }

    render = () => {
        return (
            <Router history={history}>
                <Container className="app">
                    <Switch>
                    <Route path="/" exact render={() => {
                        /*if (!this.store.getState().loggedIn)
                            return <Redirect to="/login" />  */
                            
                        return <StartPage />
                    }}>
                    </Route>
                    
                    <Route path="/login" exact render={() => {
                        this.connect();

                        return <LoginPage /> 
                    }} />

                    <Route path="/login/:pin" exact render={(context) => {
                        this.connect();

                        const pin = context.match.params.pin;

                        this.socket.login(pin, ({ success }) => {
                            if (success) 
                                history.push("/home")
                            else 
                                history.replace("/login");
                        });
                    }} />

                    <Route path="/home" exact render={() => {
                        this.connect();

                        return <HomePage />
                    }} />
                    
                    <Route path="/list/:displayId" exact render={(context) => {
                        this.connect();

                        const lists = this.store.getState().user.lists;

                        const displayId = context.match.params.displayId;
                        const listId = lists && Utils.findListByDisplayId(lists, displayId)._id;

                        this.store.dispatch(setViewOnly(false));
                        this.store.dispatch(setCurrentListId(listId));

                        return <ListPage listId={listId} displayId={displayId} />
                    }}>
                    </Route>

                    <Route path="/list/:displayId/view" exact render={(context) => {
                        this.connect();

                        const lists = this.store.getState().user.lists;

                        const displayId = context.match.params.displayId;
                        const listId = lists && Utils.findListByDisplayId(lists, displayId)._id;

                        this.store.dispatch(setViewOnly(true));

                        return <ListPage listId={listId} displayId={displayId} />
                    }}>
                    </Route>

                    <Route path="/logout" exact render={() => {
                        this.connect();

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

export default App;
