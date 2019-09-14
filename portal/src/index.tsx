import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css';
import { persistor, store } from './redux/store';
import { MainScreen } from './screens/main';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <MainScreen></MainScreen>
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();
