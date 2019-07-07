import { Button, Icon, Row, Select } from 'antd';
import { Cancelable, debounce } from 'lodash';
import React, { DragEvent, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ImageCanvas } from '../../../components/imageCanvas';
import { NavBarContent } from '../../../components/navBar';
import { Props } from '../../../models/propModel';
import { TaskInterface } from '../../../models/tasksModel';
import { TaskScreen } from '../task';
import { TaskScreenInterface } from '../taskInterface';

export interface recognitionPropsInput {
}

export interface recognitionPropsState {
    taskRecord: TaskInterface;
}

export interface recognitionPropsDispatch {
}

export interface recognitionState {
    imageIndex: number;
    imageMaxIndex: number;
    imageLabel: string;
    filteredLabels: string[];
    currentSearch: (() => void) & Cancelable;
}

class recognition extends TaskScreenInterface<Props<recognitionPropsInput, recognitionPropsState, recognitionPropsDispatch>, recognitionState> {

    forceStack = true;
    searchInput: string = '';
    imageRef: HTMLImageElement;
    canvasRef: HTMLCanvasElement;

    constructor(props: Props<recognitionPropsInput, recognitionPropsState, recognitionPropsDispatch>) {
        super(props);
        this.state = {
            ...this.state,
            imageIndex: 0,
            imageMaxIndex: props.state.taskRecord.images.length - 1,
            imageLabel: null,
            filteredLabels: [],
            currentSearch: null,
        };
    }

    // Triggered when user selects option
    handleSelectChange = (value: string) => {
        this.setState({ imageLabel: value });
    }

    // Triggered when user types search value into input box
    handleSelectSearch = (value: string) => {
        if (value.length > 1) {
            this.searchInput = value;
            this.filterLabels();
        } else {
            this.setState({ filteredLabels: [] });
        }
    }

    // Filter image labels
    filterLabels = debounce(() => {
        const filteredLabels = this.props.state.taskRecord.labels.filter((val) => val.toLowerCase().includes(this.searchInput.toLowerCase()));
        this.setState({ filteredLabels });
    }, 200, {
            leading: false,
            trailing: true
        }
    );

    // Update component to display next image
    getNextImage = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                imageLabel: null,
                filteredLabels: [],
                currentSearch: null,
                imageIndex: (prevState.imageIndex + 1) % (prevState.imageMaxIndex + 1)
            };
        });
    }

    // Returns navbar content
    navComponent = () => {
        return (
            <NavBarContent>
                {this.props.state.taskRecord.title} (recognition)
            </NavBarContent>
        );
    }

    // Returns the display info container (image canvas here)
    displayComponent = () => {
        const { taskInfo } = this.props.state.taskRecord;
        return (
            <ImageCanvas input={
                {
                    image: this.props.state.taskRecord.images[this.state.imageIndex],
                    maxWidth: this.state.screenInfo.displayInfo.width,
                    maxHeight: this.state.screenInfo.displayInfo.height,
                    imageAspectRatio: taskInfo && taskInfo.imageHeight && taskInfo.imageWidth ? taskInfo.imageWidth / taskInfo.imageHeight : null,
                    drawable: true
                }
            }>
            </ImageCanvas>
        );
    }

    // Returns the option menu
    optionsComponent = () => {
        return (
            <React.Fragment>
                <Row type='flex' align='middle' justify='center' style={{
                    margin: '20px'
                }}>
                    <Select<string>
                        size='large'
                        style={{
                            width: '100%'
                        }}
                        placeholder='Select a class'
                        onChange={this.handleSelectChange}
                        onSearch={this.handleSelectSearch}
                        value={this.state.imageLabel}
                        filterOption={false}
                        showSearch
                        autoClearSearchValue={true}
                    >
                        {
                            this.state.filteredLabels.map((val) => {
                                return <Select.Option key={val} value={val}>{val}</Select.Option>;
                            })
                        }
                    </Select>
                </Row>
                <Row type='flex' align='middle' justify='space-around' style={{
                    margin: '20px'
                }}>
                    <Button style={{
                        fontWeight: 'bold'
                    }} type='danger' shape='round' onClick={this.getNextImage} >
                        <Icon type='close'></Icon>
                        Not Sure
                </Button>
                    <Button style={{
                        fontWeight: 'bold'
                    }} type='primary' shape='round' disabled={!this.state.imageLabel} onClick={this.getNextImage} >
                        Confirm&nbsp;{`${this.state.imageLabel ? this.state.imageLabel.length > 20 ? this.state.imageLabel.substr(0, 20) + '...' : this.state.imageLabel : ''}`}
                        <Icon type='arrow-right'></Icon>
                    </Button>
                </Row>
            </React.Fragment>
        );
    }

}

function mapStateToProps(state): {
    state: recognitionPropsState
} {
    return {
        state: {
            taskRecord: (state.taskHistory && state.taskHistory[0]) ? state.taskHistory[0] : null
        }
    };
}

function mapDispatchToProps(dispatch): {
    dispatcher: recognitionPropsDispatch
} {
    return {
        dispatcher: {

        }
    };
}

const RecognitionScreen = connect(mapStateToProps, mapDispatchToProps)(recognition);
export { RecognitionScreen };