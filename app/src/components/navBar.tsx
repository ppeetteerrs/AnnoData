import { Button, Icon } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Props } from '../models/propModel';

export interface navBarPropsInput {
    iconType?: string;
}

export interface navBarPropsState {
}

export interface navBarPropsDispatch {
}

export interface navBarState {
}

export class NavBarContent extends Component<Props<navBarPropsInput, navBarPropsState, navBarPropsDispatch>, navBarState> {

    render = () => {
        return (
            <React.Fragment>
                <Link to='/'>
                    <Button type='ghost'>
                        <Icon type={this.props.input && this.props.input.iconType ? this.props.input.iconType : 'rollback'} style={{
                            fontSize: '25px',
                            fontWeight: 'bold',
                            color: 'whitesmoke'
                        }}>
                        </Icon>
                    </Button>
                </Link>
                <span style={{
                    marginLeft: '30px',
                    fontSize: '20px',
                    color: 'whitesmoke'
                }}>
                    {this.props.children}
                </span>
            </React.Fragment >
        );
    }

}