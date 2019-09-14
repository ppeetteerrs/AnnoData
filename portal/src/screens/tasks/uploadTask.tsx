import ax from 'axios';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Button, Dimmer, Form, Grid, Header, Image, Loader, Segment, Table } from 'semantic-ui-react';
import { TaskMaster } from '../../../../interfaces/tasks/taskMaster';
import { AppDispatch, AppState } from '../../models/models';

interface InputProps {
}

interface StateProps extends AppState {
}

interface DispatchProps {
}

interface State {
}

class uploadTask extends Component<InputProps & StateProps & DispatchProps, State> {

    constructor(props: InputProps & StateProps & DispatchProps) {
        super(props);
        this.state = {

        };
    }

    componentDidMount = () => {
    }

    render = () => {
        return (
            <div>

            </div>
        );
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

const UploadTask = connect<StateProps, DispatchProps, InputProps, AppState>(mapStateToProps, mapDispatchToProps)(uploadTask);
export { UploadTask };