import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

history.url = "/";

history.push_ = history.push;

history.push = (url, state = {}) => {
    window.localStorage.setItem("url", url);

    history.url = url;

    return history.push_(url, state);
}

window.onpushstate = () => {
    // eslint-disable-next-line
    const url = "/" + window.location.href.match(/(http[s]?:\/\/)?([^\/\s]+\/)(.*)/)[3];

    history.url = url;

    window.localStorage.setItem("url", url);
}

window.onpopstate = () => {
    // eslint-disable-next-line
    const url = "/" + window.location.href.match(/(http[s]?:\/\/)?([^\/\s]+\/)(.*)/)[3];

    history.url = url;

    window.localStorage.setItem("url", url);
}

window.h = history;

export default history;