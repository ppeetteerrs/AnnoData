import ax from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Grid, Header, Image, Segment } from 'semantic-ui-react';
import { AppDispatch, AppState } from '../../models/models';

interface InputProps {
    back(): void;
}

interface StateProps extends AppState {
}

interface DispatchProps {
}

interface State {
    title: string;
    price: number;
}

class createTask extends Component<InputProps & StateProps & DispatchProps, State> {
    componentDidMount = () => {
    }

    formSubmit = () => {
        ax.post(
            'http://localhost:8088/tasks/newTask', {
                meta: {
                    title: this.state.title,
                    price: this.state.price
                }
            }, {
                headers: {
                    'x-access-token': this.props.authToken
                }
            }).then((val) => {
                console.log(val);
                this.props.back();
            });

    }

    render = () => {
        return (
            <Grid centered verticalAlign='middle' style={{
                height: '100%'
            }}>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color='grey' textAlign='center'>
                        New Task
                    </Header>
                    <Form size='large'>
                        <Segment raised>
                            <Form.Input
                                label='Title'
                                icon='star'
                                iconPosition='left'
                                placeholder='Title'
                                name='title'
                                required
                                onChange={(e, data) => {
                                    this.setState({
                                        title: data.value
                                    });
                                }}
                            />
                            <Form.Input
                                label='Price'
                                icon='dollar'
                                iconPosition='left'
                                type='number'
                                placeholder='Price per label'
                                name='price'
                                required
                                onChange={(e, data) => {
                                    this.setState({
                                        price: parseFloat(data.value)
                                    });
                                }}
                            />
                            <div style={{
                                padding: '0 10%'
                            }}>
                                <Button type='button' onClick={this.props.back}>Cancel</Button>
                                <Button floated='right' color='teal' onClick={this.formSubmit}>Submit</Button>
                            </div>
                        </Segment>
                    </Form>

                </Grid.Column>
            </Grid >
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

const CreateTask = connect<StateProps, DispatchProps, InputProps, AppState>(mapStateToProps, mapDispatchToProps)(createTask);
export { CreateTask };