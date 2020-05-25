import history from './history';

class WebSocketConnection {
    constructor(url, app) {
        this.init(url, app);
    }

    init = (url = this.url, app = this.app, connectionCallback = () => {}) => {
        this.socket = new WebSocket(url);

        // Connection timeout
        setTimeout(() => {
            // The server is offline
            if (this.socket.readyState !== WebSocket.OPEN) {
                console.log("WebSocket connection timed out");

                connectionCallback(this.socket.readyState);
                
                if (!this.checkingConnection)
                    this.setOffline();
            }
        }, 2000);

        this.url = url;
        this.app = app;

        this.checkingConnection = false;
        this.isLoggingIn = false;

        this.toSend = null;

        this.callbacks = new Map();
        
        this.socket.onopen = () => {
            console.log("Connected to '%s'", url);

            connectionCallback(this.socket.readyState);

            this.app.state.isOffline = false;
            this.updateState();

            // Try to join the session if was previously logged in
            if (this.app.state.isLoggedIn) {
                this.send({ type: "join-session", pin: this.app.state.pin }, () => {
                    this.app.state.isLoggedIn = true;

                    this.updateState();
                });
            }

            if (this.toSend)
                this.send(this.toSend);

            const savedPin = localStorage.getItem("pin");

            // Make sure the pin is valid
            if (savedPin) { 
                if (!this.isLoggingIn)
                    this.send({ type: "valid-pin", pin: savedPin });
            } else // Otherwise create one
                this.send({ type: "create-user" });
        }

        this.socket.onerror = () => {
            console.log("Error connecting to '%s'", url);

            this.socket.close();
        }

        // The onclose doesn't run if safari isn't in focus while the connection is closed. 
        // If the websocket connection closes, the onclose runs when the page is in focus again (on ios atleast)
        this.socket.onclose = () => {
            console.log("Connection closed with '%s'", url);

            this.app.state.shouldLoad = true;

            this.updateState();

            setTimeout(() => {
            
            // Try to reconnect
            this.reconnect(0, () => {
                // Run on reconnect

                // If is logged in
                if (this.app.state.isLoggedIn) {
                    
                    // Try to join the session again, if previous was logged in
                    this.send({ type: "join-session", pin: this.app.state.pin }, () => {
                        this.app.state.isOffline = false;
                        this.app.state.isLoggedIn = true;

                        this.updateState();

                        this.checkingConnection = false;
                    });

                    this.send({ type: "get-lists", pin: this.app.state.pin }, ({ data }) => {

                        this.app.state.lists = data.lists;

                        this.updateState();
                    })
                } else {
                    this.checkingConnection = false;
                }

                this.app.state.shouldLoad = false;

                this.updateState();
            });
        }, 3000);
        }

        this.socket.onmessage = event => {
            const data = JSON.parse(event.data);

            this.handleMessage(data);
        }
    }

    setOffline = () => {
        history.push("/login");

        this.app.state.isOffline = true;
        this.updateState();
    }

    reconnect = (waitTime = 5000, reconnectionCallback = () => {}) => setTimeout(this.init(this.url, this.app, reconnectionCallback), waitTime)

    handleMessage = async (message) => {
        if (message.type !== "ping") console.log("Received message '%s'", message.type, message);

        switch (message.type) {
            // Login
            case "login": { 
                this.isLoggingIn = false;

                // If the login was successfull
                if (message.success) {           
                    this.app.state.pin = message.data.pin;    
                    this.app.state.lists = message.data.lists;
                    this.app.state.isLoggedIn = true;
                    this.app.state.showInvalidPinSnackbar = false;

                    localStorage.setItem("pin", message.data.pin);
                } else {
                    /*if (localStorage.getItem("pin")) {
                        this.app.state.showInvalidPinSnackbar = true;
                        localStorage.removeItem("pin");

                        this.app.state.pin = null;
    
                        this.send({ type: "create-user" });
    
                        history.push("/login");*/
                    /* } else {
                        
                    }*/

                    this.app.state.showInvalidPinSnackbar = true;
                }

                this.updateState();
                
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

                    this.app.state.pin = null;

                    this.send({ type: "create-user" });

                    history.push("/login");
                }

                break;
            }
            // Users
            case "create-user": { // Create a user 
                this.app.state.pin = message.data.pin;    

                localStorage.setItem("pin", this.app.state.pin);

                this.updateState();

                break;
            }
            case "get-user": { // Get a user
                this.app.state.user = message.data;

                this.updateState();
                
                break;
            }

            // Lists
            case "get-lists": { // Get lists
                // Get message callback
                const callback = this.getMessageCallback(message.callbackId);

                // Don't update the lists if they haven't changed
                if (JSON.stringify(message.data.lists) === JSON.stringify(this.app.state.lists))
                    return;

                this.app.state.lists = message.data.lists;

                this.updateState();
                
                // Run the callback
                callback(message);

                break;
            }
            case "create-list": { // Create list
                this.app.state.lists.unshift(message.data);

                this.updateState();

                // Get message callback
                const callback = this.getMessageCallback(message.callbackId);

                // Run the callback
                callback(message);
                
                break;
            }
            case "remove-list": { // Remove list
                const lists = this.app.state.lists;

                // Find the list that should be removed 
                for (let i = 0; i < lists.length; i++) {
                    if (lists[i]._id === message.data.listId)
                        lists.splice(i, 1);
                }

                this.updateState();

                break;
            }
            case "rename-list": {
                // Find the list that the item should be added to 
                const list = this.app.state.lists.find(list => list._id === message.data._id);

                list.name = message.data.name;

                this.updateState();

                await window.Utils.setTimeout(); // Wait for the DOM to update

                this.blurActiveElementManual(document.getElementById("list-name-input")); // Remove the focus without renaming it

                break;
            }

            // List item
            case "create-list-item": {
                // Find the list that the item should be added to 
                const list = this.app.state.lists.find(list => list._id === message.data.listId);

                // Add the item to it
                if (list) {
                    list.items.unshift(message.data);

                    const activeItemId = document.activeElement.id;
                    const item = window.Utils.findItem(list.items, activeItemId) || {};
                    const itemLocalText = item.localText;

                    this.updateState();
                    this.resetDrag();

                    const activeElement = document.getElementById(activeItemId); // Get the element that was previously active

                    if (!activeElement) return; // Return if no element was previously focused
            
                    activeElement.focus();
                    item.text = itemLocalText;

                    this.updateState();
                }
            
                break;
            }
            case "remove-list-item": { // Remove list item
                // Find the list that the item should be added to 
                const items = this.app.state.lists.find(list => list._id === message.data.listId).items;

                const activeItemId = document.activeElement.id;

                const activeItem = window.Utils.findItem(items, activeItemId) || {};
                const itemLocalText = activeItem.localText;

                // Find the item and remove it
                var itemToRemove;
                for (let i = 0; i < items.length; i++) {
                    if (items[i]._id === message.data.itemId) {
                        var itemToRemove = items[i];
                        
                        items.splice(i, 1);
                    }
                }

                this.updateState();

                // Wait for the initial state change before setting the local text, because for some reason it is overwritten otherwise

                const activeElement = document.getElementById(activeItemId);

                // Remove focus from the active element no matter which element it is
                this.blurActiveElementManual(document.activeElement);

                if (itemToRemove && activeElement) {
                    // If the active input couldn't be blurred (aka the item that was removed wasn't in focus)
                    if (!this.blurActiveElementManual(document.getElementById(itemToRemove._id))) {
                        activeElement.focus();

                        // Set the local text to the local text
                        activeItem.localText = itemLocalText;

                        this.updateState();
                    }
                }

                this.resetDrag();

                break;
            }
            case "update-list-item-state": { // Update list item state
                const list = this.app.state.lists.find(list => list._id === message.data.listId);

                for (let i = 0; i < list.items.length; i++) {
                    if (list.items[i]._id === message.data._id) 
                        list.items[i].completed = message.data.completed;
                }

                this.updateState();

                break;
            }
            case "reorder-list-items": { // Reorder the list items
                const list = window.Utils.findList(this.app.state.lists, message.data._id);

                const currentItems = list.items.slice();
                const activeItemId = document.activeElement.id;

                const item = window.Utils.findItem(list.items, activeItemId) || {};

                const itemLocalText = item.localText;

                // All the ids for the list items are received, not item objects.
                // So it maps over all item ids, where it returns the found object with the same id

                list.items = message.data.items.map(itemId => window.Utils.findItem(currentItems, itemId));

                this.updateState();

                // Wait for the initial state change before setting the local text, because for some reason it is overwritten otherwise

                const activeElement = document.getElementById(activeItemId);

                // Focus on the previously focused element if it exists
                if (activeElement && itemLocalText) {
                    activeElement.focus();

                    // Set the local text to the local text
                    item.localText = itemLocalText;

                    this.updateState();
                }
            
                break;
            }
            case "rename-list-item": { // Reorder the list items
                const list = this.app.state.lists.find(list => list._id === message.listId);

                const item = list.items.find(item => item._id === message.itemId);
                
                item.text = message.data.text;

                this.updateState();

                await window.Utils.setTimeout(); // Wait for the DOM to update

                this.blurActiveElementManual(document.getElementById(item._id)); // Remove the focus without renaming it

                break;
            }
            case "set-list-items": { // Update the list items
                const list = this.app.state.lists.filter(list => list._id === message.data._id)[0];

                for (let i = 0; i < list.items.length; i++) {
                    // Only update the item if something changed
                    if (JSON.stringify(list.items[i]) !== JSON.stringify(message.data.items[i])) // Something changed
                        list.items[i] = message.data.items[i];
                }

                this.updateState();

                break;
            }

            // Ping Pong
            case "ping": {
                this.send({
                    type: "pong"
                });
            }
            
            // Default
            default: {

                break 
            }
        }
    }

    send = (data, callback) => {
        // Only send the data if the socket is connected to the server
        if (this.socket.readyState === this.socket.OPEN) {
            data.callbackId = window.Utils.createId(20); // Generate an id for the message to be able to keep track of callbacks

            if (data.type !=="pong") console.log("Sending message '%s'", data.type, data);

            // Save the callback
            this.callbacks.set(data.callbackId, callback);

            // Send it
            this.socket.send(JSON.stringify(data));
        } else { 
            this.toSend = data; // Queue the data
        }
    }

    getMessageCallback = (callbackId) => {
        // Get the stored callback for this message
        return this.callbacks.get(callbackId) || (() => {});
    } 

    updateState = () => this.app.setState(this.app.state);

    resetDrag = () => {
        this.app.state.resetDrag = true;
        this.updateState();

        this.app.state.resetDrag = false;
        this.updateState();
    }

    blurActiveElementManual = (targetElement) => {
        // Remove focus from the active input element

        // Dispatch a custom 'blur' event manually so the rename list / list item function isn't triggered
        // A custom event listener is added at the list item to listen for this event

        if (document.activeElement === targetElement) {
            targetElement.dispatchEvent(new Event("manualblur", { bubbles: false }));

            return true;
        }

        return false;
    }
}

export default WebSocketConnection;