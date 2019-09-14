import { Col, Layout, Row } from 'antd';
import React, { Component, FunctionComponent, PureComponent, StatelessComponent } from 'react';

interface TaskScreenInfo {
    type?: 'big' | 'small';
    orientation?: 'portrait' | 'landscape';
    displayInfo?: SizingInfo;
    optionsInfo?: SizingInfo;
    windowInfo?: SizingInfo;
}

interface SizingInfo {
    span?: number; // Width Span from 0 - 24
    width?: number; // Width Pixels based on Span
    height?: number; // Container Height
}

interface TaskScreenInterfaceState {
    screenInfo?: TaskScreenInfo;
}

export abstract class TaskScreenInterface<A, B> extends Component<A, B & TaskScreenInterfaceState> {

    displaySpan = 16;
    optionsSpan = 24 - this.displaySpan;
    abstract forceStack: boolean;

    abstract navComponent: FunctionComponent;
    abstract displayComponent: FunctionComponent;
    abstract optionsComponent: FunctionComponent;

    constructor(props: A, displaySpan?: number) {
        super(props);
        if (displaySpan) {
            this.displaySpan = displaySpan;
            this.optionsSpan = 24 - this.displaySpan;
        }
        window.addEventListener('resize', this.rerenderUpdatedDimensions);
        this.state = {
            ...this.state,
            screenInfo: this.updateDimensions()
        };
    }

    componentWillUnmount = () => {
        window.removeEventListener('resize', this.rerenderUpdatedDimensions);
    }

    updateDimensions = (): TaskScreenInfo => {
        const { innerWidth, innerHeight } = window;
        const screenInfo: TaskScreenInfo = {
            windowInfo: {},
            displayInfo: {},
            optionsInfo: {}
        };
        // Check screen type, change threshold if necessary
        screenInfo.type = innerWidth > 600 ? 'big' : 'small';
        // Check orientation
        screenInfo.orientation = innerHeight > innerWidth ? 'portrait' : 'landscape';
        // Update window size info
        screenInfo.windowInfo = {
            span: 24,
            width: innerWidth,
            height: innerHeight - 64
        };
        // console.log(`Window size: ${screenInfo.windowInfo.width}, ${screenInfo.windowInfo.height}`);
        // Update content size infos

        // Display session has full width if device is in portrait mode or small device is forced to stack content
        const isFullWidth = screenInfo.orientation == 'portrait' || (this.forceStack && screenInfo.type == 'small');
        // Else Display session will have default span
        screenInfo.displayInfo.span = isFullWidth ? 24 : this.displaySpan;
        screenInfo.displayInfo.width = screenInfo.displayInfo.span * screenInfo.windowInfo.width / 24;
        screenInfo.displayInfo.height = screenInfo.windowInfo.height;

        screenInfo.optionsInfo.span = isFullWidth ? 24 : this.optionsSpan;
        screenInfo.optionsInfo.width = screenInfo.optionsInfo.span * screenInfo.windowInfo.width / 24;
        screenInfo.optionsInfo.height = screenInfo.windowInfo.height;
        return screenInfo;
    }

    rerenderUpdatedDimensions = () => {
        const screenInfo = this.updateDimensions();
        this.setState((prevState) => {
            const newState = {
                ...prevState,
                screenInfo
            };
            return newState;
        });
    }

    render = () => {
        return (
            <Layout style={{
                backgroundColor: 'transparent',
                height: '100vh',
                width: '100vw'
            }}>
                <Layout.Header>
                    <this.navComponent />
                </Layout.Header>
                <Layout.Content>
                    <Row type='flex'
                        justify='space-between'
                        style={{
                            height: '100%',
                            width: '100vw'
                        }}
                        align={this.state.screenInfo.displayInfo.span == 24 ? 'top' : 'middle'}
                    >
                        <Col span={this.state.screenInfo.displayInfo.span}
                            style={{
                                lineHeight: 0
                            }}>
                            <this.displayComponent />
                        </Col>
                        <Col span={this.state.screenInfo.optionsInfo.span}
                            style={{
                                lineHeight: 0
                            }}>
                            <this.optionsComponent />
                        </Col>
                    </Row>
                </Layout.Content>
            </Layout>

        );
    }
}