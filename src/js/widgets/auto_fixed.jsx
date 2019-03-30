// 可以根据自己父容器及窗口大小变化而变化的元素

import React from 'react';
import ReactDom from 'react-dom';
import $ from 'jquery';

export class AutoFixed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            top: '',
            left: '',
            width: '',
            maxHeight: '',
        };
        this.handleWindowResize = this.handleWindowResize.bind(this);
    }

    componentDidMount() {
        $(window).on('resize', this.handleWindowResize);
        this.handleWindowResize();
    }

    componentWillUnmount() {
        $(window).off('resize', this.handleWindowResize);
    }

    handleWindowResize() {
        const wrapperNode = ReactDom.findDOMNode(this.refs.outer);
        if (wrapperNode.clientWidth === 0) {
            return;
        }
        const maxHeight = Math.max(100, window.innerHeight - wrapperNode.offsetTop - 90);
        const offset = $(wrapperNode).offset();
        this.setState({
            top: offset.top,
            left: offset.left,
            width: wrapperNode.clientWidth,
            maxHeight,
        });
    }

    render() {
        return (
            <this.props.tag
                ref="outer" className={this.props.outerClassName}
                style={{ height: this.state.maxHeight }}
            >
                <this.props.tag
                    ref="inner" className={this.props.innerClassName}
                    style={{
                        position: 'fixed',
                        top: this.state.top,
                        left: this.state.left,
                        width: this.state.width,
                        maxHeight: this.state.maxHeight,
                        overflowY: 'auto',
                    }}
                >
                    {this.props.children}
                </this.props.tag>
            </this.props.tag>
        );
    }
}

export default AutoFixed;

AutoFixed.defaultProps = {
    tag: 'div',
    outerClassName: '',
    innerClassName: '',
};
