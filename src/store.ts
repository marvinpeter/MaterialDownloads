import { ActionCreatorsMapObject, applyMiddleware, bindActionCreators, compose, Dispatch, createStore } from "redux";
import { install as installLoop, StoreCreator } from "redux-loop";

import { ReduxAction } from "./actions";
import * as actions from "./actions";
import { reducer } from "./reducer";
import * as downloads from "./helpers/downloads";

// Allow bindActionCreators to return multiple actions
const multiActionSupport = ({ dispatch }: { dispatch: any }) => (next: any) => (action: any) =>
    Array.isArray(action)
        ? action.filter(Boolean).map(dispatch)
        : next(action);


const customCompose = (() => {
    if (process.env.NODE_ENV === "development" && typeof document !== "undefined") {
        return compose; //require("remote-redux-devtools").composeWithDevTools as typeof compose
    } else {
        return compose;
    }
})();

// Enable Redux DevTools if running in debug mode
const enhancers = customCompose(installLoop(), applyMiddleware(multiActionSupport));

// Create a Redux state store
export const store = (createStore as StoreCreator)(reducer, undefined, enhancers);

export const dispatch = <T extends ReduxAction<any>>(data: T) => store.dispatch(data);

type Actions = typeof actions;

export const bindActions = <M extends ActionCreatorsMapObject<ReduxAction | ReduxAction[]>>(actionCreators: (actions: Actions) => M) => (dispatch: Dispatch): M =>
    bindActionCreators(actionCreators(actions), dispatch);

downloads.startListening(dispatch);