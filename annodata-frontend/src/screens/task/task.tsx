import { Button } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import { Props } from '../../models/propModel';
import { TASK_TYPES, TaskInterface } from '../../models/tasksModel';
import { ClassificationScreen } from './classification/classification';
import { LocalizationScreen } from './localization/localization';

export interface taskPropsInput {
}

export interface taskPropsState {
    taskRecord: TaskInterface;
}

export interface taskPropsDispatch {
}

export interface taskState {
}

/**
 * @class task
 * @extends {Component<Props<taskPropsInput, taskPropsState, taskPropsDispatch>, taskState>}
 */

class task extends Component<Props<taskPropsInput, taskPropsState, taskPropsDispatch>, taskState> {
    componentDidMount() {
    }

    render() {
        switch (this.props.state.taskRecord.type) {
            case TASK_TYPES.IMAGE_CLASSIFICATION:
                return (
                    <ClassificationScreen />
                );
                break;
            case TASK_TYPES.IMAGE_LOCALIZATION:
                return (
                    <LocalizationScreen />
                );
                break;
            default:
                return (
                    <ClassificationScreen />
                );
                break;
        }
    }

}

function mapStateToProps(state): {
    state: taskPropsState
} {
    return {
        state: {
            taskRecord: state.taskHistory[0]
        },
    };
}

function mapDispatchToProps(dispatch): {
    dispatcher: taskPropsDispatch
} {
    return {
        dispatcher: {
        }

    };
}

const TaskScreen = connect(mapStateToProps, mapDispatchToProps)(task);
export { TaskScreen };