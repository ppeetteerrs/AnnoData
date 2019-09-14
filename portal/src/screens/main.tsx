import ax from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import { Button, Dimmer, Form, FormProps, Grid, Header, Image, Loader, Message, Segment } from 'semantic-ui-react';
import { ImageClassificationTask } from '../../../interfaces/tasks/imageClassificationTask';
import { AppDispatch, AppState } from '../models/models';
import { HomeScreen } from './home';
import { LoginScreen } from './login';

interface InputProps {
}

interface StateProps extends AppState {
}

interface DispatchProps {
}

interface State {
}

class main extends Component<InputProps & StateProps & DispatchProps, State> {
    render = () => {
        if (this.props.authToken) {
            return (
                <Segment style={{
                    padding: '0',
                    margin: '0'
                }}>
                    <Dimmer active={this.props.loading}><Loader content='loading'></Loader></Dimmer>
                    <HomeScreen />
                </Segment>
            );
        } else {
            return (
                <LoginScreen></LoginScreen>
            );
        }
    }
}

function mapStateToProps(state: AppState, input: InputProps): StateProps {
    return {
        ...state
    };
}

function mapDispatchToProps(dispatch: AppDispatch, input: InputProps): DispatchProps {
    return {
    };
}

const MainScreen = connect(mapStateToProps, mapDispatchToProps)(main);
export { MainScreen };

