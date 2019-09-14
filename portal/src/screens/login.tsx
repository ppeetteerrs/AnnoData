
import ax, { AxiosResponse } from 'axios';
import React, { Component } from 'react';
import Particles from 'react-particles-js';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Button, Container, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import { SERVER_URL } from '../config';
import { AppDispatch, AppState } from '../models/models';
import { auth, updateToken } from '../redux/actions';
const particlesOptions = {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        }
    }
};

interface InputProps {
}

interface StateProps extends AppState {
}

interface DispatchProps {
    authenticate(): void;
    updateToken(token: string): void;
}

interface State {
    mode: 'register' | 'login';
    username: string;
    displayName: string;
    password: string;
    message?: {
        header: string,
        content: string
    };
    error?: {
        header: string,
        content: string
    };
}

class login extends Component<InputProps & StateProps & DispatchProps, State> {
    constructor(props: InputProps & StateProps & DispatchProps) {
        super(props);
        this.state = {
            mode: 'register',
            username: '',
            displayName: '',
            password: ''
        };
        this.props.authenticate();
    }

    pageContent = () => {
        return (<React.Fragment>
            <Particles style={{
                height: '100vh',
                width: '100vw',
                zIndex: -1,
                position: 'fixed',
                right: 0,
                bottom: 0,
                left: 0,
                backgroundColor: 'black'
            }}
                params={particlesOptions} />

            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color='teal' textAlign='center'>
                        <Image src='/assets/logo.png' />
                        Log-in to your account
                    </Header>
                    <Form
                        size='large'
                        onSubmit={this.state.mode == 'login' ? this.login : this.register}
                        error={this.state.error !== undefined}
                        success={this.state.message !== undefined && this.state.error === undefined}
                    >
                        <Segment raised>

                            <Form.Input
                                fluid
                                icon='user'
                                iconPosition='left'
                                placeholder='Username'
                                onChange={(event, data) => { this.setState({ username: data.value }); }}
                            />

                            {this.state.mode == 'register' ?
                                (<Form.Input
                                    fluid
                                    icon='eye'
                                    iconPosition='left'
                                    placeholder='Display Name'
                                    onChange={(event, data) => { this.setState({ displayName: data.value }); }}
                                />) : null
                            }

                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                                onChange={(event, data) => { this.setState({ password: data.value }); }}
                            />

                            {(this.state.error || this.state.message) ?
                                (
                                    <Message
                                        error={this.state.error !== undefined}
                                        success={this.state.message !== undefined && this.state.error === undefined}
                                        header={this.state.error ? this.state.error.header : this.state.message ? this.state.message.header : ''}
                                        content={this.state.error ? this.state.error.content : this.state.message ? this.state.message.content : ''}
                                    />
                                ) : null}

                            <Button color='teal' fluid size='large' disabled={this.formValidation()} type='submit'>
                                {this.state.mode == 'login' ? 'Login' : 'Sign Up'}
                            </Button>

                        </Segment>
                    </Form>
                    {this.state.mode == 'login' ? this.loginMessage() : this.registerMessage()}
                </Grid.Column>
            </Grid>
        </React.Fragment>
        );
    }

    loginMessage = () => {
        return (
            <Message>
                New to us? <a href='#' onClick={() => { this.setState({ mode: 'register' }); }}>Sign Up</a>
            </Message>
        );
    }

    registerMessage = () => {
        return (
            <Message>
                Already have an account? <a href='#' onClick={() => { this.setState({ mode: 'login' }); }}>Login</a>
            </Message>
        );
    }

    formValidation = () => {
        const { username, displayName, password, mode } = this.state;
        const disable = (username === '' || password === '' || (mode === 'register' && displayName === ''));
        return disable;
    }

    login = async () => {
        const res = await ax.post<Partial<State>, AxiosResponse<{ err?: string, token?: string }>>(`${SERVER_URL}/auth/login/employer`, { username: this.state.username, password: this.state.password })
            .catch(
                error => this.setState({
                    message: undefined,
                    error: {
                        header: 'Server Error',
                        content: JSON.stringify(error, null, 4)
                    }
                })
            );
        if (res && res.data.err) {
            this.setState({
                message: undefined,
                error: {
                    header: 'Server Error',
                    content: JSON.stringify(res.data.err, null, 4)
                }
            });
        } else if (res && res.data.token) {
            this.props.updateToken(res.data.token);
        }
    }

    register = async () => {
        const res = await ax.post(`${SERVER_URL}/auth/register/employer`, { username: this.state.username, displayName: this.state.displayName, password: this.state.password })
            .catch(
                error => this.setState({
                    message: undefined,
                    error: {
                        header: 'Server Error',
                        content: JSON.stringify(error, null, 4)
                    }
                })
            );
        if (res && res.data.err) {
            this.setState({
                message: undefined,
                error: {
                    header: 'Server Error',
                    content: JSON.stringify(res.data.err, null, 4)
                }
            });
        } else if (res) {
            this.setState({
                message: {
                    header: 'Successfully Registered!',
                    content: JSON.stringify(res.data.message, null, 4)
                },
                error: undefined,
                mode: 'login'
            });
        }
    }

    render = () => {
        if (!this.props.authToken) {
            return this.pageContent();
        } else {
            return (<Redirect to='/' />);
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
        authenticate: () => {
            dispatch(auth());
        },
        updateToken: (token: string) => {
            dispatch(updateToken(token));
        }
    };
}

const LoginScreen = connect<StateProps, DispatchProps, InputProps, AppState>(mapStateToProps, mapDispatchToProps)(login);
export { LoginScreen };


