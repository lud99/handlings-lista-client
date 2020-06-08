import history from './history';

import Utils from './Utils';

import { 
    setUserInitialState, setUser, setPin, setLoggedIn,
    setLists, addList, removeList, renameList, 
    addListItem, toggleListItemCompleted, renameListItem, removeListItem, reorderListItems, renameListItemLocal } from './redux/user';

import { setShouldLoad } from './redux/shouldLoad';
import { setShowInvalidPinSnackbar } from './redux/showInvalidPinSnackbar';
import { setOffline } from './redux/offline';
import { setResetDrag } from './redux/resetDrag';

class WebSocketConnection {
    static init = (url = this.url, app = this.app, store = this.store, connectionCallback = () => {}) => {
        window.webSocketConnection = this;

        this.socket = new WebSocket(url);

        // Connection timeout
        setTimeout(() => {
            // The server is offline
            if (this.socket.readyState !== WebSocket.OPEN) {
                connectionCallback(this.socket.readyState);
                
                // Set offline if not connecting
                if (!this.checkingConnection) {
                    history.push("/login");

                    // Only update the state if not offline
                    if (!this.getState().offline) this.dispatch(setOffline(true));
                }
            }
        }, 2000);

        this.url = url;
        this.app = app;
        this.store = store;

        this.checkingConnection = false;
        this.isLoggingIn = false;

        this.toSend = [];

        this.callbacks = new Map();
        
        this.socket.onopen = () => {
            console.log("Connected to '%s'", url);

            connectionCallback(this.socket.readyState);

            this.dispatch(setOffline(false));

            // Try to join the session if was previously logged in
            if (this.getState().loggedIn) {
                this.send({ type: "join-session", pin: this.getState().pin }, () => {
                    this.dispatch(setLoggedIn(true));
                });
            }

            this.toSend.forEach(({ message, callback }) => this.send(message, callback));

            this.toSend = [];

            const savedPin = localStorage.getItem("pin");

            // Make sure the pin is valid
            if (savedPin) { 
                if (!this.isLoggingIn)
                    this.send({ type: "valid-pin", pin: savedPin });
            } else // Otherwise create one
                this.send({ type: "create-user" });
        }

        this.socket.onerror = () => this.socket.close();

        // The onclose doesn't run if safari isn't in focus while the connection is closed. 
        // If the websocket connection closes, the onclose runs when the page is in focus again (on ios atleast)
        this.socket.onclose = () => {
            console.log("Connection closed with '%s'", url);

            this.dispatch(setShouldLoad(true));

            setTimeout(() => {
            
            // Try to reconnect
            this.reconnect(0, (readyState) => {
                // Run on reconnect

                if (readyState !== WebSocket.OPEN) return;

                const { user, shouldLoad } = this.getState();

                // If is logged in
                if (user.loggedIn) {
                    
                    // Try to join the session again, if previous was logged in
                    this.send({ type: "join-session", pin: user.pin }, () => {
                        this.dispatch(setOffline(false));
                        this.dispatch(setLoggedIn(true));
    
                        this.checkingConnection = false;
                    });

                    this.send({ type: "get-lists", pin: user.pin }, ({ data }) => {

                        // Set all the lists (and their items)
                        this.dispatch(setLists(data.lists));
                    });
                } else {
                    this.checkingConnection = false;
                }

                // Only update the state if should load
                if (shouldLoad) this.dispatch(setShouldLoad(false));
            });
        }, 3000);
        }

        this.socket.onmessage = event => {
            const data = JSON.parse(event.data);

            this.handleMessage(data);
        }

        return this;
    }

    static reconnect = (waitTime = 5000, reconnectionCallback = () => {}) => setTimeout(this.init(this.url, this.app, this.store, reconnectionCallback), waitTime)

    static handleMessage = async (message) => {
        if (message.type !== "ping") console.log("Received message '%s'", message.type, message);

        switch (message.type) {
            // Login
            case "login": { 
                this.isLoggingIn = false;

                // If the login was successfull
                if (message.success) {       
                    // Save the pin
                    localStorage.setItem("pin", message.data.pin);
                    
                    this.dispatch(setShowInvalidPinSnackbar(false));

                    // Set the user (and all their lists and items) and pin
                    this.dispatch(setUser(message.data));

                    // Don't load any more. ready
                    this.dispatch(setShouldLoad(false));
                } else {
                    this.dispatch(setShowInvalidPinSnackbar(true));
                }
                
                // Get message callback
                const callback = this.getMessageCallback(message.callbackId);

                // Run the callback
                callback(message);

                break;
            }
            case "valid-pin": { 
                // If the login was successfull
                if (!message.success) {           
                    localStorage.removeItem("pin");

                    // Remove the saved user
                    this.dispatch(setUserInitialState());

                    this.send({ type: "create-user" });

                    history.push("/login");
                }

                break;
            }
            // Users
            case "create-user": {
                // Set the user (and all their lists and items) and pin
                this.dispatch(setUser(message.data));

                this.dispatch(setShouldLoad(false));

                localStorage.setItem("pin", message.data.pin);

                break;
            }
            case "get-user": {
                // Set the user (and all their lists and items) and pin
                this.dispatch(setUser(message.data));
             
                break;
            }

            case "get-list": {
                // Get message callback
                const callback = this.getMessageCallback(message.callbackId);

                const pin = message.data.userPin;

                this.dispatch(setLists([message.data]));
                this.dispatch(setPin(pin));
                this.dispatch(setShouldLoad(false));
                this.dispatch(setLoggedIn(false));

                // Run the callback
                callback(message);

                break;
            }
            case "get-lists": {
                // Get message callback
                const callback = this.getMessageCallback(message.callbackId);

                // Set the user (and all their lists and items) and pin
                this.dispatch(setUser(message.data))

                // Run the callback
                callback(message);

                break;
            }
            case "create-list": {
                this.dispatch(addList(message.data));

                // Get message callback
                const callback = this.getMessageCallback(message.callbackId);

                // Run the callback
                callback(message);
                
                break;
            }
            case "remove-list": {
                // Remove the list by the list id
                this.dispatch(removeList({ _id: message.data.listId, localOnly: true }))

                break;
            }
            case "rename-list": {
                // Only rename the list locally to avoid sending another 'rename-list' message
                this.dispatch(renameList({ ...message.data, localOnly: true }));

                this.blurActiveElementManual(document.getElementById("list-name-input")); // Remove the focus without renaming it

                break;
            }

            // List item
            case "create-list-item": { // TODO
                const { lists } = this.getState().user;

                // Find the list that the item should be added to 
                const list = Utils.findList(lists, message.data.listId);

                const activeItemId = document.activeElement.id;
                const item = Utils.findItem(list.items, activeItemId) || {};
                const itemLocalText = item.localText;

                // Add the item to it
                this.dispatch(addListItem(message.data));

                this.resetDrag();

                const activeElement = document.getElementById(activeItemId); // Get the element that was previously active

                // Only run if an item was in focus
                if (activeElement) {
                    // Focus on the previously focused item
                    activeElement.focus();
                    
                    // Set the local text to the previous local text
                    this.dispatch(renameListItemLocal({ _id: activeItemId, listId: message.data.listId, localText: itemLocalText }))
                }
               
                break;
            }
            case "remove-list-item": {
                const { lists } = this.getState().user;

                const list = Utils.findList(lists, message.data.listId);

                const itemToRemoveId = message.data.itemId;
                const activeItemId = document.activeElement.id;

                const activeItem = Utils.findItem(list.items, activeItemId) || {};
                const itemLocalText = activeItem.localText;

                // Only remove the list item locally
                this.dispatch(removeListItem({ listId: message.data.listId, _id: message.data.itemId, localOnly: true }));

                const activeElement = document.getElementById(activeItemId);

                // Remove focus from the active element no matter which element it is
                this.blurActiveElementManual(document.activeElement);

                // Only run if an item was in focus
                if (itemToRemoveId && activeElement) {
                    // If the active input couldn't be blurred (aka the item that was removed wasn't in focus)
                    if (!this.blurActiveElementManual(document.getElementById(itemToRemoveId))) {
                        // Focus on the previously focused item
                        activeElement.focus();
                        
                        // Set the local text to the previous local text
                        this.dispatch(renameListItemLocal({ _id: activeItemId, listId: message.data.listId, localText: itemLocalText }))
                    }
                }

                this.resetDrag();

                break;
            }
            case "update-list-item-state": {
                // Only toggle the item locally
                this.dispatch(toggleListItemCompleted({ ...message.data, localOnly: true }))

                break;
            }
            case "reorder-list-items": {
                const lists = this.getState().user.lists;

                const activeItemId = document.activeElement ? document.activeElement.id : null;

                const list = Utils.findList(lists, message.data._id);
                const item = Utils.findItem(list.items, activeItemId) || {};

                // Only reorder the items locally
                this.dispatch(reorderListItems({ itemIds: message.data.items, listId: message.data._id, localOnly: true }));

                const itemLocalText = item.localText;
                const activeElement = document.getElementById(activeItemId);

                // Return if no item was in focus
                if (!activeElement || !itemLocalText) return;
                
                // Focus on the previously focused item
                activeElement.focus();
                
                // Set the local text to the previous local text
                this.dispatch(renameListItemLocal({ _id: activeItemId, listId: message.data._id, localText: itemLocalText }))
            
                break;
            }
            case "rename-list-item": {
                if (!message.success) return;

                // Only rename the item locally
                this.dispatch(renameListItem({ ...message.data, localOnly: true }))

                this.blurActiveElementManual(document.getElementById(message.data._id)); // Remove the focus without renaming it

                break;
            }

            case "ping": {
                this.send({ type: "pong" });

                break;
            }
            
            default: break;
        }
    }

    static send = async (data, callback) => {
        // Only send the data if the socket is connected to the server
        if (this.socket.readyState === this.socket.OPEN) {
            data.callbackId = Utils.createId(20); // Generate an id for the message to be able to keep track of callbacks

            if (data.type !== "pong") console.log("Sending message '%s'", data.type, data);

            // Save the callback
            this.callbacks.set(data.callbackId, callback);

            // Send it
            this.socket.send(JSON.stringify(data));
        } else { 
            this.toSend.push({ message: data, callback: callback }); // Queue the data
        }
    }

    static getMessageCallback = (callbackId) => {
        // Get the stored callback for this message
        return this.callbacks.get(callbackId) || (() => {});
    } 

    static getState = () => this.store.getState();

    static dispatch = (state) => this.store.dispatch(state);

    static resetDrag = async () => {
        this.dispatch(setResetDrag(true));

        this.dispatch(setResetDrag(false));
    }

    static blurActiveElementManual = (targetElement) => {
        // Remove focus from the active input element

        // Dispatch a custom 'blur' event manually so the rename list / list item function isn't triggered
        // A custom event listener is added at the list item to listen for this event

        if (document.activeElement === targetElement) {
            targetElement.dispatchEvent(new Event("manualblur", { bubbles: false }));

            return true;
        }

        return false;
    }

    static login = (pin = localStorage.getItem("pin"), callback) => {
        const state = this.getState();

        // Don't send multiple login messages at the same time
        if (this.isLoggingIn) return false;

        // Don't login again
        if (state.user.loggedIn && parseInt(pin) === state.user.pin)
            return true;

        this.isLoggingIn = true;

        this.send({ type: "login", pin: pin }, callback);
    }
}

export default window.webSocketConnection || WebSocketConnection;