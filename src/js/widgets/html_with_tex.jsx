import React from 'react';
//import MathJax from 'mathjax';
export class HtmlWithTex extends React.Component {
    static getId() {
        if (!window._htmlWithTexId) {
            window._htmlWithTexId = 0;
        }
        return ++window._htmlWithTexId;
    }

    constructor(props) {
        super(props);
        // 使用ref时，即时切换页面，dom由于被引用，还会继续存在，MathJax会接着渲染，影响
        // 新内容的处理，所以用id，这样Component不用时dom就没了
        this.id = `hwt-${HtmlWithTex.getId()}`;
    }

    componentDidMount() {
        window.requestAnimationFrame(() => {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.id]);
        })
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.force || nextProps.html !== this.props.html
            || nextProps.className !== this.props.className
            || nextProps.tag !== this.props.tag;
    }

    componentDidUpdate() {
        window.requestAnimationFrame(() => {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.id]);
        })
        //MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.id]);
    }

    render() {
        return (
            <this.props.tag
                ref={el=>this.el=el}
                className={this.props.className} style={this.props.style}
                dangerouslySetInnerHTML={{ __html: this.props.html }}
                id={this.id}
            />
        );
    }
}

export default HtmlWithTex;

HtmlWithTex.defaultProps = {
    className: '',
    force: false,
    tag: 'div',
    style: {},
};
