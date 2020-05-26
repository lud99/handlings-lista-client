import React, { Component } from 'react';

import { Router, Switch, Route, Redirect } from "react-router-dom";

import history from './history';

import WebSocketConnection from './WebSocketConnection';

import LoginPage from './components/pages/LoginPage';
import HomePage from './components/pages/HomePage';
import ListPage from './components/pages/ListPage';

import OfflineSnackbar from './components/OfflineSnackbar';

import Utils from './Utils';

import Container from 'react-div-100vh';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
        }  

        window.Utils = new Utils();

        this.dev = process.env.NODE_ENV !== "production";

        const storedUrl = window.localStorage.getItem("url");

        if (storedUrl) {
            // Is mobile but opened in web browser
            if ((window.Utils.isMobile() && window.Utils.isPWA()) || (!window.Utils.isMobile() && window.Utils.isPWA()))
                history.replace(storedUrl);   
        }

        this.socket = new WebSocketConnection(this.dev ? "ws://192.168.0.2:8080/handlings-lista" : "wss://ludvig.cloudno.de/handlings-lista", this);

        window.socket = this.socket;
    }

    componentDidMount = () => {
        document.addEventListener("contextmenu", event => event.preventDefault())
    }

    addList = name => {
        this.socket.send({
            type: "create-list", 
            pin: this.state.pin,
            name: name
        });
    }

    removeList = (listId) => {
        // Remove the item on the server
        this.socket.send({
            type: "remove-list",
            pin: this.state.pin,
            listId: listId
        });
    }

    renameList = (listId, newName) => {
        const list = findList(this.state.lists, listId);

        if (list.name === newName)
            return;

        this.socket.send({
            type: "rename-list",
            pin: this.state.pin,
            listId: listId,
            newName: newName
        });
    }

    addListItem = (listId, text) => {
        this.socket.send({
            type: "create-list-item",
            pin: this.state.pin,
            listId: listId,
            text: text
        });
    }

    removeListItem = (listId, itemId) => {
        // Remove the item locally
        const items = this.state.lists.find(list => list._id === listId).items;
        
        for (let i = 0; i < items.length; i++) {
            if (items[i]._id === itemId)
                items.splice(i, 1);
        }

        this.setState(this.state);

        // Remove the item on the server
        this.socket.send({
            type: "remove-list-item",
            pin: this.state.pin,
            itemId: itemId,
            listId: listId
        });
    }

    toggleListItemCompleted = (listId, itemId) => {
        // Toggle the item locally
        const list = this.state.lists.find(list => list._id === listId);
        const item = list.items.find(item => item._id === itemId);
        item.completed = !item.completed;

        this.setState(this.state);

        // Toggle the item on the server
        this.socket.send({
            type: "update-list-item-state",
            pin: this.state.pin,
            itemId: itemId
        })
    }

    reorderListItems = (listId, itemSourceIndex, itemDestinationIndex, reorderedItems) => {
        // Find the list
        const list = this.state.lists.find(list => list._id === listId);

        // Only reorder the list if something changed
        for (let i = 0; i < list.items.length; i++) {
            if (JSON.stringify(list.items[i]) !== JSON.stringify(reorderedItems[i])) { // Something changed
                // Update the state locally
                list.items = reorderedItems;
                this.setState(this.state);
        
                this.socket.send({
                    type: "reorder-list-items",
                    pin: this.state.pin,
                    listId: listId,
                    itemOldPositionIndex: itemSourceIndex,
                    itemNewPositionIndex: itemDestinationIndex,
                });

                return;
            }
        }
    }

    renameListItem = (listId, itemId, newText) => {
        const item = findItem(findList(this.state.lists, listId).items, itemId);

        if (item.text === newText || newText === "")
            return;

        this.socket.send({
            type: "rename-list-item",
            pin: this.state.pin,
            listId: listId,
            itemId: itemId,
            newText: newText
        });
    }

    renameListItemLocal = (listId, itemId, localText) => {
        const item = findItem(findList(this.state.lists, listId).items, itemId);

        item.localText = localText;

        this.setState(this.state);
    }

    getList = (listId) => {
        this.socket.send({ type: "get-list", listId: listId, joinSession: true });
    }

    login = (pin = this.state.pin, callback) => {
        if (this.state.isLoggedIn && pin === this.state.pin)
            return true;

        this.socket.isLoggingIn = true;

        this.socket.send({
            type: "login",
            pin: pin
        }, callback)
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

    enterPin = pin => {
        this.login(pin, ({ success }) => {
            if (!success) return;

            localStorage.setItem("pin", pin);

            history.push("/home");
        });
    }

    openList = (listId) => history.push(`/list/${listId}`);

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

    retryConnect = () => this.socket.init();

    render = () => {
        return (
            <Router history={history}>
                <Container className="app">
                    <OfflineSnackbar isOpen={this.state.isOffline} retryConnect={this.retryConnect}/>

                    <Switch>
                    <Route path="/" exact render={() => {
                        if (!this.state.isLoggedIn)
                            return <Redirect to="/login" />                        
                    }}>
                    </Route>

                    <Route path="/login" exact render={() => (
                        <LoginPage 
                            pin={this.state.pin} 
                            isOffline={this.state.isOffline}
                            showInvalidPinSnackbar={this.state.showInvalidPinSnackbar}
                            {...this} /> 
                    )} />

                    <Route path="/login/:pin" exact render={(context) => {
                        const pin = context.match.params.pin;

                        this.enterPin(pin);
                    }} />

                    <Route path="/home" exact render={() => (
                        <HomePage 
                            lists={this.state.lists} 
                            isLoggedIn={this.isLoggedIn} 
                            shouldLoad={this.state.shouldLoad}
                            showInvalidPinSnackbar={this.state.showInvalidPinSnackbar}
                            {...this} />
                    )} />
                    
                    <Route path="/list/:id" exact render={(context) => {
                        const listId = context.match.params.id;

                        const currentList = this.state.lists ? findList(this.state.lists, listId) : {};
                        if (!currentList) return <Redirect to="/home" />

                        return <ListPage 
                            list={currentList} 
                            shouldLoad={this.state.shouldLoad} 
                            resetDrag={this.state.resetDrag} 
                            showInvalidPinSnackbar={this.state.showInvalidPinSnackbar}
                            {...this} />
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
