
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import { Button, Container, Form, FormProps, Grid, GridColumn, Header, Image, Menu, Message, Segment } from 'semantic-ui-react';
import { ImageClassificationTask } from '../../../interfaces/tasks/imageClassificationTask';
import { AppDispatch, AppState } from '../models/models';
import { ListTasks } from './tasks/listTasks';

type Location = 'account' | 'tasks';

interface InputProps {
}

interface StateProps extends AppState {
}

interface DispatchProps {
}

interface State {
    location: Location;
}

class home extends Component<InputProps & StateProps & DispatchProps, State> {

    constructor(props: InputProps & StateProps & DispatchProps) {
        super(props);
        this.state = {
            location: 'tasks'
        };
    }

    componentDidMount = () => {
    }

    render = () => {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100vw',
                height: '100vh',
                alignItems: 'stretch',
                padding: '0'
            }}>
                <div style={{
                    width: '200px'
                }}>
                    <Menu fixed='left' vertical pointing secondary>
                        <Menu.Item
                            name='View Tasks'
                            active={this.state.location == 'tasks'}
                            onClick={this.handleMenuSelect('tasks')}
                        />
                    </Menu>
                </div>
                <div style={{
                    flex: 1
                }}>
                    {this.renderBody()}
                </div>
            </div>
        );
    }

    handleMenuSelect = (location: Location) => {
        return (e: React.MouseEvent, data: any) => {
            this.setState({
                location
            });
        };
    }

    renderBody = () => {
        switch (this.state.location) {
            case 'tasks':
                return (<ListTasks></ListTasks>);
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

const HomeScreen = connect(mapStateToProps, mapDispatchToProps)(home);
export { HomeScreen };

