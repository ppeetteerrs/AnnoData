import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Table, Tag, Button } from "antd";
import axios from "axios";
import { ColumnProps } from 'antd/lib/table';
import { TaskInterface, TASK_TYPES } from "../../models/tasksModel";
import { dummyTasks } from "../../assets/dummyTasks";
import "./tasksList.css";
import { Identification } from '../taskPage/identification/identification';

export class TasksListPage extends Component<{}, { view: string }> {

  constructor(props) {
    super(props);
    this.state = {
      view: null
    }
  }

  selectTask = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        view: "identify"
      }
    });
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
      render: (text: TaskInterface["status"]) => {
        return <span>{text.completed} / {text.total}</span>
      }
    }, {
      title: 'Rate',
      dataIndex: 'rate',
      render: (text: TaskInterface["rate"]) => {
        return <span>${text.price.toFixed(2)} per {text.quantity}</span>
      }
    }, {
      title: 'Type',
      dataIndex: 'type'
    }, {
      title: 'Action',
      key: 'action',
      render: () => <Button onClick={this.selectTask}>Hi</Button>
    }];
    if (this.state.view && this.state.view == "identify") {
      return <Identification></Identification>
    } else {
      return <Table dataSource={dummyTasks} columns={columns} />;
    }
  }
}