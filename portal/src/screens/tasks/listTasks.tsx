import ax from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Dimmer, Grid, Icon, Loader, Table } from 'semantic-ui-react';
import { TaskMaster } from '../../../../interfaces/tasks/taskMaster';
import { AppDispatch, AppState } from '../../models/models';
import { CreateTask } from './createTask';
import { UploadTask } from './uploadTask';

interface InputProps {
}

interface StateProps extends AppState {
}

interface DispatchProps {
}

interface State {
    view: 'list' | 'create' | 'upload';
    title?: string;
    price?: number;
    tasks?: TaskMaster[];
}

class listTasks extends Component<InputProps & StateProps & DispatchProps, State> {

    constructor(props: InputProps & StateProps & DispatchProps) {
        super(props);
        this.state = {
            view: 'list'
        };
        this.fetchTasks();
    }

    backToList = () => {
        this.fetchTasks();
        this.setState({
            view: 'list'
        });
    }

    generateTableBody = () => {
        if (this.state.tasks) {
            return this.state.tasks.map((task) => {
                return (
                    <Table.Row>
                        <Table.Cell>
                            {task.meta.title}
                        </Table.Cell>
                        <Table.Cell>
                            {task.meta.price}
                        </Table.Cell>
                        <Table.Cell>
                            <Button
                                color='teal'
                                onClick={() => {
                                    this.setState({
                                        view: 'upload'
                                    });
                                }}>
                                Upload
                            </Button>
                            <Button
                                color='red'
                                onClick={() => {
                                    this.removeTask(task._id);
                                }}>
                                Remove
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                );
            });
        } else {
            return null;
        }
    }

    taskList = () => {
        return (
            <Dimmer.Dimmable style={{
                height: '100%',
                width: '100%'
            }}>
                <Dimmer active={!this.state.tasks}>
                    <Loader content='Loading'></Loader>
                </Dimmer>
                <Grid centered verticalAlign='middle' style={{
                    height: '100%',
                    padding: '30px'
                }}>
                    <Grid.Column>
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Title</Table.HeaderCell>
                                    <Table.HeaderCell>Price</Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.generateTableBody()}
                            </Table.Body>

                            <Table.Footer fullWidth>
                                <Table.Row>
                                    <Table.HeaderCell colSpan='4'>
                                        <Button icon labelPosition='left' size='small' onClick={() => {
                                            this.setState({
                                                view: 'create'
                                            });
                                        }}>
                                            <Icon name='plus' /> Add New Task
                                        </Button>
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
                        </Table>
                    </Grid.Column>
                </Grid>
            </Dimmer.Dimmable>
        );
    }

    fetchTasks = async () => {
        const tasks = await ax.post<TaskMaster[]>('http://localhost:8088/tasks/tasks', {
        }, {
                headers: {
                    'x-access-token': this.props.authToken
                }
            }).catch(console.log);
        if (tasks) {
            this.setState({
                tasks: tasks.data
            });
        } else {
            this.setState({
                tasks: undefined
            });
        }
    }

    removeTask = async (id: string) => {

    }

    render = () => {
        switch (this.state.view) {
            case 'create':
                return (<CreateTask back={this.backToList}></CreateTask>);
            case 'upload':
                return (<UploadTask></UploadTask>);
            default:
                return this.taskList();
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

const ListTasks = connect<StateProps, DispatchProps, InputProps, AppState>(mapStateToProps, mapDispatchToProps)(listTasks);
export { ListTasks };