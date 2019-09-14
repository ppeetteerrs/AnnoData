import { Button, Icon, Layout, Table, Tag } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { dummyTasks } from '../../assets/dummyTasks';
import { NavBarContent } from '../../components/navBar';
import { Props } from '../../models/propModel';
import { TaskInterface } from '../../models/tasksModel';
import { selectTask } from '../../redux/actions';
import './tasksList.css';

export interface tasksListPropsInput {
}

export interface tasksListPropsState {
}

export interface tasksListPropsDispatch {
    select: (task: TaskInterface) => void;
}

export interface tasksListState {
}

class tasksList extends Component<Props<tasksListPropsInput, tasksListPropsState, tasksListPropsDispatch>, tasksListState> {
    componentDidMount() {
    }

    render() {
        const columns: ColumnProps<TaskInterface>[] = [{
            title: 'Title',
            dataIndex: 'title',
        }, {
            title: 'Client',
            dataIndex: 'client'
        }, {
            title: 'Status',
            dataIndex: 'status',
            render: (text: TaskInterface['status']) => {
                return <span>{text.completed} / {text.total}</span>;
            }
        }, {
            title: 'Rate',
            dataIndex: 'rate',
            render: (text: TaskInterface['rate']) => {
                return <span>${text.price.toFixed(2)} per {text.quantity}</span>;
            }
        }, {
            title: 'Type',
            dataIndex: 'type'
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => <Link to='/task'><Button onClick={() => { this.props.dispatcher.select(record); }}>Select</Button></Link>
        }];
        return (
            <Layout>
                <Layout.Header>
                    <NavBarContent input={{
                        iconType: 'menu'
                    }}>
                        Tasks List
                    </NavBarContent>
                </Layout.Header>
                <Layout.Content>
                    <div className='container'>
                        <Table dataSource={dummyTasks} columns={columns} className='table' />
                    </div>);
                </Layout.Content>
            </Layout>);
    }

}

function mapStateToProps(state): {
    state: tasksListPropsState
} {
    return {
        state: {},
    };
}

function mapDispatchToProps(dispatch): {
    dispatcher: tasksListPropsDispatch
} {
    return {
        dispatcher: {
            select: (task: TaskInterface) => {
                dispatch(selectTask(task));
            }
        }

    };
}

const TasksListScreen = connect(mapStateToProps, mapDispatchToProps)(tasksList);
export { TasksListScreen };