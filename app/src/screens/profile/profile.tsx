import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Props } from '../../models/propModel';
import './profile.css';

export interface profilePropsInput {
}

export interface profilePropsState {
}

export interface profilePropsDispatch {
}

export interface profileState {
}

class profile extends Component<Props<profilePropsInput, profilePropsState, profilePropsDispatch>, profileState> {
    componentDidMount = () => {
    }

    render = () => {
        return (<div></div>);
    }

}

function mapStateToProps(state): {
    state: profilePropsState
} {
    return {
        state: {
        }
    };
}

function mapDispatchToProps(dispatch): {
    dispatcher: profilePropsDispatch
} {
    return {
        dispatcher: {
        }
    };
}

const ProfileScreen = connect(mapStateToProps, mapDispatchToProps)(profile);
export { ProfileScreen };