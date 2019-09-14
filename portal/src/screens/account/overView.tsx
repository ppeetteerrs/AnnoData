import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppDispatch, AppState } from '../../models/models';

interface InputProps {
}

interface StateProps {
}

interface DispatchProps {
}

interface State {
}

class overView extends Component<InputProps & StateProps & DispatchProps, State> {
    componentDidMount = () => {
    }

    render = () => {
        return (<div></div>);
    }

}

function mapStateToProps(state: AppState, input: InputProps): StateProps {
    return {
    };
}

function mapDispatchToProps(dispatch: AppDispatch, input: InputProps): DispatchProps {
    return {
    };
}

const OverViewScreen = connect<StateProps, DispatchProps, InputProps, AppState>(mapStateToProps, mapDispatchToProps)(overView);
export { OverViewScreen };