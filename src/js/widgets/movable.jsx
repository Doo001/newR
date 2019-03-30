// 可随鼠标拖动而移动的元素

import React from 'react';
import clamp from 'lodash/clamp';
import $ from 'jquery';

export class Movable extends React.Component {
    constructor(props) {
        super(props);
        this._element = null;
    }

    componentDidMount() {
        $(this._element).mousedown((e) => {
            if (e.target !== this._element) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            const bb = event.target.getBoundingClientRect();
            const dragData = {
                offsetX: event.clientX - (bb.left - window.scrollX),
                offsetY: event.clientY - (bb.top - window.scrollY),
            };

            // 当鼠标进入到iframe上方时，可能会导致获取的坐标是相对于iframe
            // 解决办法是拖动时禁用iframe对鼠标事件的处理
            // 参见http://stackoverflow.com/questions/5645485/detect-mousemove-when-over-an-iframe
            $('iframe').each((index, iframe) => {
                $(iframe).css('pointer-events', 'none');
            });

            $(document).mousemove((mme) => {
                e.preventDefault();
                mme.stopPropagation();
                let [left, top] =
                    [mme.clientX - dragData.offsetX, mme.clientY - dragData.offsetY];
                left = clamp(left, 0, window.innerWidth - bb.width);
                top = clamp(top, 0, window.innerHeight - bb.height);
                $(this._element).css({
                    left: `${left}px`,
                    top: `${top}px`,
                    right: 'initial',
                    bottom: 'initial',
                });
            });

            $(document).mouseup((mue) => {
                e.preventDefault();
                mue.stopPropagation();
                $(document).off('mousemove').off('mouseup');
                $('iframe').each((index, iframe) => {
                    $(iframe).css('pointer-events', '');
                });
            });
        });
    }

    render() {
        return (
            <this.props.tag
                {...this.props}
                ref={(ref) => { this._element = ref; }}
                style={{
                    position: 'fixed',
                    zIndex: '999',
                }}
            >
                {this.props.children}
            </this.props.tag>
        );
    }
}

export default Movable;

Movable.defaultProps = {
    tag: 'div',
};
