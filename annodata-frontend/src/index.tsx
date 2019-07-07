import 'antd/dist/antd.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css';
import { Props } from './models/propModel';
import { persistor, store } from './redux/store';
import { LoadingScreen } from './screens/loading/loadingScreen';
import { LoginScreen } from './screens/login/login';
import { ProfileScreen } from './screens/profile/profile';
import { RegisterScreen } from './screens/register/register';
import { ResetScreen } from './screens/reset/reset';
import { TaskScreen } from './screens/task/task';
import { TasksListScreen } from './screens/tasksList/tasksList';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <HashRouter>
                <Switch>
                    <Route exact path='/' component={TasksListScreen}></Route>
                    <Route path='/task' component={TaskScreen}></Route>
                </Switch>
            </HashRouter>
        </PersistGate>
    </Provider>, document.getElementById('root'));
serviceWorker.unregister();
