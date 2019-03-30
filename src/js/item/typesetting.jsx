import React from 'react';
import ReactDom from 'react-dom';
import Immutable from 'immutable';
import MathJax from 'mathjax';
import Q from 'js/quantum';
import $ from 'jquery';
import { Movable } from 'js/widgets/movable';
import { AutoFixed } from 'js/widgets/auto_fixed';
import { showAlert } from 'js/widgets/alert';
import { ItemTypeDesc, getSubject } from 'js/subjects';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'js/widgets/modal';
import "css/main.scss";

import { createEditor, replacePaste } from '../kcode/editor';
import { setCurrentNav, makeWikiLink } from './common';
import { ReviewProgress } from './tagging';


let gGoodToLeave = true;


export default class ItemTypesetting extends React.Component {
    static highlightTex(text) {
        let ret = text;
        const repl1 = '<span class="tex tex-open">$1</span><span class="tex tex-text">$2</span><span class="tex tex-close">$3</span>';
        ret = ret.replace(/(\\[([])((?!<\/span>)(?:.|\n)*?)(\\[)\]])(?!<\/span>)/g, repl1);
        ret = ret.replace(/(\$\$?)((?:.|\n)*?)(\1)/g, repl1);
        const repl2 = '<span class="tex tex-open">$1</span><span class="tex tex-text">$3</span><span class="tex tex-close">$4</span>';
        // 为防止重复处理，\begin \end 前后不能有 span(公式替换后标记), 由于 js 限制，只看 end
        ret = ret.replace(/(\\begin\{(.*?)\})(.*?)(\\end\{\2\})(?!<\/span>)/g, repl2);
        return ret;
    }

    static highlightTexInItem(item) {
        /* eslint no-param-reassign: 0 */
        item.data.ts_stem = ItemTypesetting.highlightTex(item.data.ts_stem);
        for (let i = 0; i < item.data.qs.length; i++) {
            const q = item.data.qs[i];
            ['ans', 'step', 'exp'].forEach((key) => {
                q[key] = ItemTypesetting.highlightTex(q[key]);
            });
        }
        return item;
    }

    constructor(props) {
        super(props);
        this.state = {
            item: null,
            ajaxing: true,
            inReview: props.location.pathname.substr(props.location.pathname.lastIndexOf('/') + 1) === props.location.query.review,
        };
    }

    componentDidMount() {
        setCurrentNav('排版', this.props.params.id, this.props.location.search);

        // $(window).on('beforeunload.parsing-page', () => {
        //     if (!gGoodToLeave) {
        //         return "题目尚未保存，确认离开此页面？";
        //     } else {
        //         return undefined;
        //     }
        // });

        Q.get(`/api/item/${this.props.params.id}/typeset`)
        .done((item) => {
            this.setState({ item: Immutable.fromJS(ItemTypesetting.highlightTexInItem(item)) });
        })
        .fail((err)=>{
//      	alert('报错：'+JSON.stringify(err))
        })
        .always(() => { this.setState({ ajaxing: false }); })
        ;
    }

    componentWillUnmount() {
        //$(window).off('beforeunload.parsing-page');
    }

    handleTypeset(shouldSave, inReview) {
        const json = this.refs.editors.getEditedItemData();
        json.save = shouldSave;
        json.review = inReview;
        json.in_flow = !!this.props.location.query.review;

        this.setState({ ajaxing: true });
        Q.post(`/api/item/${this.props.params.id}/typeset`, { json })
        .done((item) => {
            this.setState({ item: Immutable.fromJS(ItemTypesetting.highlightTexInItem(item)) });
            if (shouldSave) {
                gGoodToLeave = true;
                showAlert("保存成功");
                if (inReview) {
                    window.location.href = `/item/review${this.props.location.search}`;
                } else if (this.props.location.query.review === 'tag') {
                    window.location.href = `/item/${this.props.params.id}/tag${this.props.location.search}`;
                }

                /*if (inReview) {
                	Q.get(`/item/review${this.props.location.search}`).done(data => {
				        if (data) {
				            window.location.href = data;
				        }
				    })
                } else if (this.props.location.query.review === 'tag') {
                	Q.get(`/item/${this.props.params.id}/tag${this.props.location.search}`).done(data => {
				        if (data) {
				            window.location.href = data;
				        }
				    })
                }*/
            }
        })
        .fail((jqXHR, ...rest) => {
            if (jqXHR.status === 409 && inReview) {
                const message = Q.jsonedError(jqXHR, ...rest).message;
                if (window.confirm(`${message}，重新分配题目？`)) {
                    window.location.href = `/item/review${this.props.location.search}`;
                }
            } else {
                Q.defaultAjaxFail(jqXHR, ...rest);
            }
        })
        .always(() => { this.setState({ ajaxing: false }); })
        ;
    }

    async handleAdapt() {
        Modal.show(
            <AdaptModal
                type={this.state.item.getIn(['data', 'type'])}
                onOk={state => this.requestAdaptItem(state.type)}
            />
        );
    }

    async requestAdaptItem(itemType) {
        try {
            this.setState({ ajaxing: true });
            const json = {
                action: 'adapt',
                data: {
                    item_id: this.props.params.id,
                    item_type: itemType,
                },
            };
            const item = await Q.post('/api/item', { json });
            window.open(`/item/${item._id}/typeset`);
        } finally {
            this.setState({ ajaxing: false });
        }
    }

    render() {
        return (
            <div id="item-typesetting">
                <AutoFixed outerClassName="item-preview-pane">
                    {this.state.inReview &&
                    <div className="review-info">
                        <ReviewProgress
                            review='typeset'
                            subreview={this.props.location.query.subreview}
                            caption='已审核'
                            paperId={this.props.location.query.paper_id}
                            volumeId={this.props.location.query.volume_id}
                            edu={this.props.location.query.edu}
                        />
                    </div>
                    }
                    <ItemPreview
                        html={this.state.item ? this.state.item.get('html') : ''}
                        ref="preview"
                    />
                </AutoFixed>
                <div className="item-typeset-pane">
                    <div className="item-meta-zone">
                        <ItemMeta item={this.state.item} />
                    </div>
                    <div className="typesetting-zone">
                        <ItemPartEditors
                            itemData={this.state.item ? this.state.item.get('data') : null}
                            ref='editors'
                        />
                    </div>
                    <div className="typesetting-note">
                        <div>
                            <span className="nn">_____</span> 表示编辑添加的下划线。
                        </div>
                    </div>
                    <Movable className="op-zone typesetting-op-zone panel panel-default">
                        <button
                            className="btn btn-default" data-action="preview"
                            onClick={this.handleTypeset.bind(this, false, false)}
                            disabled={this.state.ajaxing}
                        >预览</button>
                        <button
                            className="btn btn-default"
                            onClick={this.handleTypeset.bind(this, true, false)}
                            disabled={this.state.ajaxing}
                        >保存</button>
                        <button
                            className="btn btn-warning"
                            onClick={this.handleAdapt.bind(this)}
                            disabled={this.state.ajaxing}
                            style={{display:"none"}}
                        >改编</button>
                        {this.state.inReview &&
                            <button
                                className="btn btn-danger"
                                onClick={this.handleTypeset.bind(this, true, true)}
                                disabled={this.state.ajaxing}
                            >下一题</button>
                        }
                    </Movable>
                </div>
            </div>
        );
    }
}

function ItemMeta(props) {
    if (!props.item) {
        return null;
    }
    return (
        <div>
            <span className="label label-info item-meta" data-name="type">
                {ItemTypeDesc.get(props.item.get('data').get('type')).name}
            </span>
            <span className="label label-default item-meta" data-name="id">
                {props.item.get('_id')}
            </span>
        </div>
    );
}

class ItemPartEditors extends React.Component {
    shouldComponentUpdate(nextProps) {
        return nextProps.itemData !== this.props.itemData;
    }

    getEditedItemData() {
        return {
            ts_stem: this.refs.tsStem.html(),
            qs: Immutable.Range(0, this.props.itemData.get('qs').size).map(
                i => this.refs[`q-${i}`].getEditedQ()).toJS(),
        };
    }

    render() {
        if (this.props.itemData === null) {
            return null;
        }
        return (
            <div>
                <div className='stem-editor' key='-1'>
                    <Editor
                        className='stem-editor' value={this.props.itemData.get('ts_stem')}
                        ref="tsStem"
                    />
                </div>
                <ol className='qs-editors-list'>
                    { this.props.itemData.get('qs').map(
                        (q, no) =>
                            <li value={no + 1} key={no + 1}>
                                <QEditors q={q} ref={`q-${no}`} />
                            </li>)
                    }
                </ol>
            </div>
        );
    }
}

class QEditors extends React.Component {
    getEditedQ() {
        return {
            ans: this.refs.ans.html(),
            step: this.refs.step.html(),
            exp: this.refs.exp.html(),
        };
    }

    render() {
        return (
            <div className='qs-editors' >
                <h4 className='editor-title'>答案:</h4>
                <Editor value={this.props.q.get('ans')} ref="ans" />
                <h4 className='editor-title'>解析:</h4>
                <Editor value={this.props.q.get('exp')} ref="exp" />
                <h4 className='editor-title'>备注:</h4>
                <Editor value={this.props.q.get('step')} ref="step" />
            </div>
        );
    }
}

export class Editor extends React.Component {
    constructor(props) {
        super(props);
        this._editor = null;
    }

    componentDidMount() {
        this._editor = createEditor(ReactDom.findDOMNode(this.refs.editor));
        this._editor.edit.afterChange(() => { gGoodToLeave = false; });
        replacePaste(this._editor);
    }

    componentWillReceiveProps(nextProps) {
        this._editor.html(nextProps.value);
    }

    shouldComponentUpdate() {
        // 防止编辑器被重置，我们自己维护编辑器状态
        // 虽然react记住的vdom和新渲染的一样不会触发重绘
        return false;
    }

    html() {
        return this._editor.html();
    }

    render() {
        return (
            <div>
                <textarea ref='editor' defaultValue={this.props.value} />
            </div>
        );
    }
}

export class ItemPreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            curWidthIndex: 0,
        };
    }

    componentDidMount() {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, ReactDom.findDOMNode(this)]);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.html !== this.props.html ||
            nextState.curWidthIndex !== this.state.curWidthIndex;
    }

    componentDidUpdate() {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, ReactDom.findDOMNode(this)]);

        // 初始时渲染loading，不需要绑定
        $(ReactDom.findDOMNode(this)).on('click', 'wiki', (event) => {
            window.open(makeWikiLink($(event.target).attr('data-name')));
        });
    }

    render() {
        const widthDescs = [
            ['', '默认'],
            ['320', '5S宽'],
            ['375', '6S宽'],
            ['414', '6SPlus宽'],
        ];
        const widthBtns = widthDescs.map(([width, name], index) => {
            return (
                <button
                    type="button"
                    className={`btn btn-default ${this.state.curWidthIndex === index ? 'active' : ''}`}  /* eslint max-len: 0 */
                    key={`btn-${index}`}
                    onClick={() => this.setState({ curWidthIndex: index })}
                >{name}</button>
            );
        });
        const wrapperStyle = {};
        if (this.state.curWidthIndex !== 0) {
            wrapperStyle.width = `${widthDescs[this.state.curWidthIndex][0]}px`;
        }
        return (
            <div className="item-wrapper" style={wrapperStyle} >
                <div className="item-width-switcher btn-group"> {widthBtns} </div>
                <div dangerouslySetInnerHTML={{ __html: this.props.html }} />
            </div>
        );
    }
}


class AdaptModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 1001,
        };
    }

    handleChange(evt) {
        this.setState({ type: Number(evt.target.value) });
    }

    handleSubmit(evt) {
        evt.preventDefault();
        this.props.onOk(this.state);
        this.modal.close();
    }

    render() {
        return (
            <Modal ref={(ref) => { this.modal = ref; }}>
                <ModalHeader>
                    <h4 className="modal-title">题目改编</h4>
                </ModalHeader>
                <ModalBody>
                    <form className="form form-horizontal" onSubmit={this.handleSubmit.bind(this)}>
                        <div className="form-group">
                            <label className="col-sm-2 control-label">题型</label>
                            <div className="col-sm-10">
                                {
                                getSubject().getItemTypeDescs().map((t) => {
                                    return (
                                        <label className="radio-inline" key={t.type}>
                                            <input
                                                type="radio" name="item-type"
                                                value={t.type}
                                                checked={t.type === this.state.type}
                                                onChange={this.handleChange.bind(this)}
                                            />
                                            {t.name}
                                        </label>
                                    );
                                })
                                }
                            </div>
                        </div>
                        <ModalFooter>
                            <button type="submit" className="btn btn-primary">确定</button>
                        </ModalFooter>
                    </form>
                </ModalBody>
            </Modal>
        );
    }
}



// WEBPACK FOOTER //
// ./js/item/typesetting.jsx