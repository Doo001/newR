import React from 'react'
import HtmlWithTex from 'js/widgets/html_with_tex'
import {Q, server} from 'js/quantum'
import {Grid, Row, Col} from 'react-flexbox-grid';
import PropTypes from 'prop-types';
import Alert from 'js/widgets/alert.jsx';

export class PlanItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            node: this.props.node,
            html: '',
            colors: this.props.colors,
            index: this.props.index,
            upAble: this.props.upAble,
            downAble: this.props.downAble
        };
    }

    componentDidMount() {
        if (this.props.node.data.content && this.props.node.data.content != '') {
            this.handlePreviewPlan('rich_text');
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            node: nextProps.node,
            colors: nextProps.colors,
            index: nextProps.index,
            html: '',
            upAble: nextProps.upAble,
            downAble: nextProps.downAble
        });
    }

    onChange = (data) => {
        this.changed = true;
        this.state.node.data.content = data;
        this.props.syncPlanNode(this.props.index, this.state.node);
    }

    handlePreviewPlan = () => {
        const desc = this.ref.value().trim();
        if (!desc) {
            this.setState({html: ''});
            return;
        }
        let url = `/api/ktag${this.state.node._id ? '/' + this.state.node._id : ''}`;
        Q.post(url, {json: {preview: {desc}}})
            .done((data) => {
                this.state.node.data.content = data.desc;
                this.state.html = data.desc_rendered;
                this.forceUpdate(() => {
                    /*this.onChange()*/
                });
            })
    }

    unFoldPreview = () => {
        this.setState({html: ''});
    }

    render() {
        // let {index} = this.props;
        let title = (this.state.node.data.title == '无须标题') ? "" : this.state.node.data.title;
        this.state.node.data.title = title;
        let colorNone = (title == "考情分析" ? 'none' : 'inline-block');
        let tips = (this.state.node.data.type > 100) ? "(本模块只在教材中显示)" : "(本模块只在教案中显示)";
        let preview = this.state.html == '' ? 'previewNone' : 'preview';
        // let previewBtn = this.state.html==''?'btnb':'previewNone';
        let unfoldBtn = this.state.html == '' ? 'previewNone' : "unFoldPreview";

        let defaultPlacehoder = '请输入文本内容';
        if (title == "考情分析") {
            defaultPlacehoder = '此部分为对某知识点在考试中情况的描述。';
        } else if (title == "知识笔记") {
            defaultPlacehoder = '此部分为授课过程中对重点知识的讲解内容，如果内容为空需要添加占位符。';
        } else if (title == "讲解指南") {
            defaultPlacehoder = '此部分为授课逻辑的梳理，目的是为了指导教师如何进行授课。';
        } else if (title == "讲解小结") {
            defaultPlacehoder = '此部分为讲解的小结部分，需要呈现本切片提炼总结的重点内容。';
        }


        return (
            <div className="itemContainer">
                <div className="itemTitle">
                    <span className="ItemName">{title}</span>
                    {
                        this.state.colors.map((i, index) => {
                            return <span key={`colors${index}`} className="clolors"
                                         style={{background: `#${i}`, display: `${colorNone}`}}></span>
                        })
                    }
                    <span className="text-danger plan-tips">{tips}</span>
                    <span
                        className={`delItem ${(this.state.node.data.type == 1 || this.state.node.data.type == 2 || this.state.node.data.type == 102 || this.state.node.data.type == 101) ? 'hidebtn' : ''}`}
                        onClick={() => this.props.removePlan(this.state.index, this.state.node)}>+</span>
                </div>
                <div className="itemText ">
                    <TagEditor
                        {...this.props}
                        onChange={this.onChange}
                        value={this.state.node.data.content || ""}
                        placeholder={defaultPlacehoder}
                        ref={(ref) => {
                            this.ref = ref;
                        }}
                    />
                </div>
                <div className="itemBtns">
                    <div className="btns">
                        <button
                            className='btnb'
                            onClick={this.handlePreviewPlan}
                        >预览
                        </button>
                        <button
                            className={`btnb up ${(this.state.node.data.type == 1 || this.state.node.data.type == 2 || this.state.node.data.type == 102 || this.state.node.data.type == 101 || this.state.upAble == false) ? 'hidebtn' : ''}`}
                            onClick={() => {
                                this.props.movePlan(true, this.state.index, this.state.node);
                            }}>上移
                        </button>
                        <button
                            className={`btnb down ${(this.state.node.data.type == 1 || this.state.node.data.type == 2 || this.state.node.data.type == 102 || this.state.node.data.type == 101 || this.state.downAble == false) ? 'hidebtn' : ''}`}
                            onClick={() => {
                                this.props.movePlan(false, this.state.index, this.state.node);
                            }}>下移
                        </button>
                    </div>
                    <div style={{position: "relative"}}>
                        <HtmlWithTex html={this.state.html || ''} className={preview}/>
                        <div className={unfoldBtn} onClick={this.unFoldPreview}><span
                            className="glyphicon glyphicon-triangle-top" aria-hidden="true"></span>收起预览
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export class TagEditor extends React.Component {

    constructor(props) {
        super(props);
        this._editor = null;
        this.changeStatus = false;
        this.data = this.props.value;
    }

    watchEdit = () => {
        let data = this.value().trim();
        if (data != this.data) {
            this.data = data;
            this.props.onChange && this.props.onChange(data)
        }
    }


    componentDidMount() {
        this._editor = CKEDITOR.replace(this.ref);

        this._editor.on('change', this.watchEdit)

        this._editor.on('focus', () => {
            this.changeStatus = true
        });
        this._editor.on('blur', () => {
            this.changeStatus = false;
        })
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.value !== nextProps.value) {
            this.data = nextProps.value;
            this._editor.removeListener('change', this.watchEdit)
            this._editor.setData(nextProps.value, () => {
                this._editor.on('change', this.watchEdit)
            });
        }

    }


    componentWillUnMount() {
        this._editor.removeAllListeners()
        this._editor.destroy()
    }

    shouldComponentUpdate() {
        // 防止编辑器被重置，我们自己维护编辑器状态
        // 虽然react记住的vdom和新渲染的一样不会触发重绘
        return false;
    }

    value() {
        return this._editor.getData();
    }

    render() {
        return (
            <textarea
                defaultValue={this.props.value} placeholder={this.props.placeholder}
                ref={(ref) => {
                    this.ref = ref;
                }}
            ></textarea>
        );
    }
}

PlanItem.propTypes = {
    downAble: PropTypes.bool,
    upAble: PropTypes.bool,
    colors: PropTypes.array,
    index: PropTypes.number,
    node: PropTypes.object,
    movePlan: PropTypes.func,
    syncPlanNode: PropTypes.func,
    removePlan: PropTypes.func
}