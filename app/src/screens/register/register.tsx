import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Props } from '../../models/propModel';
import './register.css';

export interface registerPropsInput {
}

export interface registerPropsState {
}

export interface registerPropsDispatch {
}

export interface registerState {
}

class register extends Component<Props<registerPropsInput, registerPropsState, registerPropsDispatch>, registerState> {
    componentDidMount() {
    }

    render() {
        return (<div></div>);
    }

}

function mapStateToProps(state): {
    state: registerPropsState
} {
    return {
        state: {},
    };
}

function mapDispatchToProps(dispatch): {
    dispatcher: registerPropsDispatch
} {
    return {
        dispatcher: {
        }

    };
}

const RegisterScreen = connect(mapStateToProps, mapDispatchToProps)(register);
export { RegisterScreen };