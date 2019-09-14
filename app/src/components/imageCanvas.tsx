import { Spin } from 'antd';
import ax from 'axios';
import React, { Component, MouseEvent, TouchEvent } from 'react';
import { connect } from 'react-redux';
import { Props } from '../models/propModel';
import { TaskInterface } from '../models/tasksModel';

export interface imageCanvasPropsInput {
    image: string;
    maxWidth: number;
    maxHeight: number;
    imageAspectRatio: number;
    drawable: boolean;
}

export interface imageCanvasPropsState {
}

export interface imageCanvasPropsDispatch {
}

export interface imageCanvasState {
    canvasWidth: number;
    canvasHeight: number;
    imageLoaded: boolean;
}

export class ImageCanvas extends Component<Props<imageCanvasPropsInput, imageCanvasPropsState, imageCanvasPropsDispatch>, imageCanvasState> {

    imageRef: HTMLImageElement;
    canvasRef: HTMLCanvasElement;
    imageLoaded: boolean = false;
    drawing: boolean;
    box: {
        x: number,
        y: number,
        w: number,
        h: number
    };
    imageDrawInfo: {
        sx: number,
        sy: number,
        sw: number,
        sh: number,
        w: number,
        h: number
    };

    constructor(props: Props<imageCanvasPropsInput, imageCanvasPropsState, imageCanvasPropsDispatch>) {
        super(props);
        this.state = {
            canvasWidth: props.input.maxWidth,
            canvasHeight: props.input.maxHeight,
            imageLoaded: false
        };
    }

    onImageLoaded = (options: {
        render: boolean,
        nextprops?: Props<imageCanvasPropsInput, imageCanvasPropsState, imageCanvasPropsDispatch>
    } = {
            render: true
        }) => {
        let props = options.nextprops ? options.nextprops : this.props;
        this.imageDrawInfo = this.calculateImageDimensions(props);
        const newState: imageCanvasState = {
            ...this.state,
            imageLoaded: true,
            canvasWidth: this.imageDrawInfo.w,
            canvasHeight: this.imageDrawInfo.h
        };
        this.setState(newState);
    }

    calculateImageDimensions(props: Props<imageCanvasPropsInput, imageCanvasPropsState, imageCanvasPropsDispatch>) {
        let { maxWidth, maxHeight, imageAspectRatio } = props.input;
        maxWidth = Math.floor(maxWidth);
        maxHeight = Math.floor(maxHeight);
        const targetAspectRatio = maxWidth / maxHeight;
        const { naturalWidth, naturalHeight } = this.imageRef;
        let { sx, sy, sw, sh, w, h } = {
            sx: 0,
            sy: 0,
            sw: naturalWidth,
            sh: naturalHeight,
            w: maxWidth,
            h: maxHeight
        };
        if (!imageAspectRatio) {
            // Image Aspect Ratio not given, show full image
            console.log(`Image Dimensions: ${naturalWidth} x ${naturalHeight}`);
            imageAspectRatio = naturalWidth / naturalHeight;
        } else {
            // Image Aspect Ratio given, crop image
            if (naturalWidth / naturalHeight > imageAspectRatio) {
                // Image longer than needed, crop width retain height
                const targetWidth = naturalHeight * imageAspectRatio;
                sx = (naturalWidth - targetWidth) / 2;
                sw = naturalWidth - sx;
            } else {
                // Image shorter than needed, crop height retain width
                const targetHeight = naturalWidth / imageAspectRatio;
                sy = (naturalHeight - targetHeight) / 2;
                sh = naturalHeight - sy;

            }
        }
        if (imageAspectRatio > targetAspectRatio) {
            // Image longer than container, fit width reduce height
            h = maxWidth / imageAspectRatio;
        } else {
            // Image shorter than container, fit height reduce width
            w = maxHeight * imageAspectRatio;
        }
        console.log(JSON.stringify({ sx, sy, sw, sh, w, h, maxWidth, maxHeight }, null, 4));
        return { sx, sy, sw, sh, w, h };
    }

    componentDidMount = () => {
        this.imageRef.onload = () => this.onImageLoaded();
    }

    componentDidUpdate = () => {
        this.drawBox();
    }

    handleMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
        const { clientX, clientY } = event.nativeEvent;
        const { left, top } = event.currentTarget.getBoundingClientRect();
        this.updateBox(clientX - left, clientY - top, true);
    }

    handleMouseUp = (event: MouseEvent<HTMLCanvasElement>) => {
        this.drawBox();
        this.drawing = false;
    }

    handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
        const { clientX, clientY } = event.nativeEvent;
        const { left, top } = event.currentTarget.getBoundingClientRect();
        this.updateBox(clientX - left, clientY - top);
    }

    handleTouchDown = (event: TouchEvent<HTMLCanvasElement>) => {
        const { clientX, clientY } = event.touches[0];
        const { left, top } = event.currentTarget.getBoundingClientRect();
        this.updateBox(clientX - left, clientY - top, true);
    }

    handleTouchMove = (event: TouchEvent<HTMLCanvasElement>) => {
        const { clientX, clientY } = event.touches[0];
        const { left, top } = event.currentTarget.getBoundingClientRect();
        this.updateBox(clientX - left, clientY - top);
    }

    handleTouchUp = (event: TouchEvent<HTMLCanvasElement>) => {
        this.drawBox();
        this.drawing = false;
    }

    updateBox = (newX: number, newY: number, create: boolean = false) => {
        if (newX < 0) {
            newX = 0;
        }
        if (newY < 0) {
            newY = 0;
        }
        if (newX > this.state.canvasWidth) {
            newX = this.state.canvasWidth;
        }
        if (newY > this.state.canvasHeight) {
            newY = this.state.canvasHeight;
        }
        if (this.drawing && this.box && this.box.x && this.box.y) {
            const newBox = {
                ...this.box,
                w: newX - this.box.x,
                h: newY - this.box.y,
            };
            // console.log(`Updating Box... x: ${newBox.x}, y: ${newBox.y}, w: ${newBox.w}, h: ${newBox.h}`);
            this.box = newBox;
            this.drawBox();
        } else if (!this.drawing && create) {
            // Not yet drawing
            this.drawing = true;
            this.box = {
                x: newX,
                y: newY,
                w: 0,
                h: 0
            };
            this.drawBox();
            // console.log(`Creating Box... x: ${this.box.x}, y: ${this.box.y}, w: ${this.box.w}, h: ${this.box.h}`);
        }
    }

    drawBox = () => {
        // If already started drawing
        if (this.canvasRef) {
            const { sx, sy, sw, sh, w, h } = this.imageDrawInfo;
            const ctx = this.canvasRef.getContext('2d');
            ctx.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
            ctx.drawImage(this.imageRef, sx, sy, sw, sh, 0, 0, w, h);
            if (this.drawing && this.box && this.box.x && this.box.y && this.box.w && this.box.h) {
                ctx.strokeStyle = '#FF0000';
                ctx.lineWidth = 5;
                ctx.strokeRect(this.box.x, this.box.y, this.box.w, this.box.h);
            }
        }
    }

    clearCanvas = () => {
        if (this.canvasRef) {
            const ctx = this.canvasRef.getContext('2d');
            ctx.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
        }
    }

    componentWillReceiveProps = (props: Props<imageCanvasPropsInput, imageCanvasPropsState, imageCanvasPropsDispatch>) => {
        // Check if new image or dimensions is provided
        if (props.input.image != this.props.input.image || props.input.maxHeight != this.props.input.maxHeight || props.input.maxWidth != this.props.input.maxWidth) {
            this.imageLoaded = props.input.image == this.props.input.image;
            this.onImageLoaded({ render: false, nextprops: props });
        }
    }

    canvasComponent = () => {
        if (this.props.input.drawable) {
            if (this.state.imageLoaded) {
                return (
                    <canvas width={this.state.canvasWidth}
                        height={this.state.canvasHeight}
                        ref={ref => this.canvasRef = ref}
                        onMouseDown={this.handleMouseDown}
                        onMouseUp={this.handleMouseUp}
                        onMouseMove={this.handleMouseMove}
                        onTouchStart={this.handleTouchDown}
                        onTouchEnd={this.handleTouchUp}
                        onTouchMove={this.handleTouchMove}
                    >
                    </canvas>
                );
            } else {
                return (
                    <Spin></Spin>
                );
            }
        } else {
            return null;
        }
    }

    render = () => {
        console.log(this.state);
        return (
            <React.Fragment>
                <img src={this.props.input.image} ref={ref => this.imageRef = ref} style={{
                    display: this.props.input.drawable ? 'none' : 'inline',
                    maxWidth: '100%'
                }}>
                </img>
                <this.canvasComponent></this.canvasComponent>
            </React.Fragment>
        );
    }

}