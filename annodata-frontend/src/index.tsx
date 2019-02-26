import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';
import { RouteComponent } from './routes/routes';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<RouteComponent />, document.getElementById('root'));
serviceWorker.unregister();
