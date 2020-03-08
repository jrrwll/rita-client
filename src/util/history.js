import {createBrowserHistory} from 'history';

// A singleton history object for easy API navigation
export const history = createBrowserHistory(
    // {
    //     basename: '/',
    //     forceRefresh: true,
    // }
);

export const refresh = () => {
    history.go(0);
};

export const push = (path, state) => {
    history.push(path, state)
};

export const pushForcibly = (path, state) => {
    history.push(path, state);
    refresh();
};

export const replace = (path, state) => {
    history.replace(path, state)
};

export const replaceForcibly = (path, state) => {
    history.replace(path, state);
    refresh();
};
