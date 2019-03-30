import React from 'react'
import {connect} from 'react-redux'
import {Q} from 'js/quantum'
import {changeKtagStatus, saveKtag} from '../../store/actions'
import {HtmlWithTex} from 'js/widgets/html_with_tex';
import {Row} from 'react-flexbox-grid';

import {TagEditor} from 'js/item/planItem'
import {showAlertModal,Modal} from 'js/widgets/alertModal';

class Content extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            desc_rendered: '',
            ktag: this.props.ktag,
            previewTip: ''
        }

    }

    checkDataVersion = (lessonId) => {
        if(this.checkHandle){
            clearInterval(this.checkHandle);
        }
        this.checkHandle  = setInterval(()=>{//轮询服务器
             if (lessonId) {
                 Q.get(`/api/ktag/get_ktag_version/${lessonId}`)
                  .done(version => {
                     if(version){
                         //如果版本号不同
                         if (lessonId == window.planTagManage.id) {
                             if (version != window.planTagManage.version) {
                                 //提示
                                 showAlertModal('提示','你的小伙伴刚刚更新了该教案内容，需要你点击“确定”前往最新页面重新修改。',false,()=>{
                                     //执行更新切片
                                     window.open(window.location.href);
                                 window.planTagManage.version = version;

                             },()=>{//不更新
                                     return;
                                 });
                             }
                         }

                     }
                 });
             }

         },2000);
    }

    componentDidUpdate() {
        this.checkDataVersion(this.state.ktag._id);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            desc_rendered: '',
            ktag: nextProps.ktag,
            previewTip: nextProps.ktag.tagging_tip
        },() =>{
            if (nextProps.ktag && nextProps.ktag._id && nextProps.ktag._id != this.props.ktag._id) {

                this.checkDataVersion(nextProps.ktag._id);
            }
        })

    }

    handlePreview = ()=> {
        const desc = this._descEditor.value();
        let url = `/api/ktag/${this.state.ktag._id}`;
        Q.post(url, {json: {preview: {desc}}})
            .done((data) => {
                this.setState({
                    desc_rendered: data.desc_rendered
                })
            });
    }

    handleTeachingObjectiveLevelChange = (evt) => {
        this.state.ktag.teaching_objective.level = evt.target.value;
        this.forceUpdate();
        window.ktagStatus = 'editing'
    }

    handleTeachingObjectiveDescChange = (evt) => {
        this.state.ktag.teaching_objective.desc = evt.target.value;
        this.forceUpdate();
        window.ktagStatus = 'editing'
    }

    handleTeachingObjectiveLessonCountChange = (evt) => {
        this.state.ktag.teaching_objective.lesson_count = evt.target.value;
        this.forceUpdate();
        window.ktagStatus = 'editing'
    }

    handleTipChange = (evt) => {
        this.state.ktag.tagging_tip = evt.target.value;
        this.forceUpdate();
        window.ktagStatus = 'editing'
    }
    handleAssessInput = (event) => {
        const index = Number.parseInt(event.target.value, 10);
        const ktag = this.state.ktag;
        const assess = ktag.assess_dirs;
        if (event.target.checked) {
            assess.push(index);
        } else {
            assess.splice(assess.indexOf(index), 1);
        }
        this.setState({
            ktag
        }, ()=> {
            window.ktagStatus = 'editing'
        });

    }
    handleInput = (name, event) => {
        const node = this.state.ktag;
        if (node[name] !== event.target.value) {
            window.ktagStatus = 'editing'
        }
        let value = event.target.value.trim();
        if (name === 'wiki' && value.startsWith('\\')) {
            value = value.substring(1);
        }
        node[name] = value;
        this.setState({
            node,
        });
    }
    onChange = (data) => {
        this.state.ktag.desc = data;
        window.ktagStatus = 'editing'
    }

    seePre(){
        let oSeePreVal=document.getElementById('seePreID').innerHTML;
        if(!oSeePreVal.trim()){
            document.getElementById('hwt-2').innerHTML="";
            return;
        }else{
            this.setState({previewTip: this.state.ktag.tagging_tip})
        }
    }

    render() {
        let {ktag, desc_rendered} = this.state;
        if (!ktag || !ktag._id ) {
            return (
                <Row className="content-wrapper">

                </Row>
            )
        }
        let radios = ['A', 'B', 'C'].map(level =>
            <label className="radio-inline" key={level}>
                <input
                    type="radio"
                    value={level}
                    checked={ktag.teaching_objective.level === level}
                    onChange={this.handleTeachingObjectiveLevelChange.bind(this)}
                />{level}</label>
        );

        return (
            <Row className="content-wrapper">
                <div className="lessonContent">
                    <div className="header">
                        <button className="saveBtn" onClick={e => {
                            this.props.saveKtag(ktag)
                        }}>
                            保存
                        </button>
                    </div>
                    <div className="ktags-wrapper">
                        <div className="lesson-body">
                            <div className="form-horizontal tag-modify-form">
                                <div className="form-group">
                                    <label className="col-sm-2 control-label">ID</label>
                                    <div className="col-sm-10">
                                        <p className="form-control-static">{ktag._id}</p>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-2 control-label">统计</label>
                                    <div className="col-sm-10">
                                        <p className="form-control-static">
                                            {`考频: ${ktag.stats.freq}; 平均难度: ${ktag.stats.avg_diff}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-2 control-label">名称</label>
                                    <div className="col-sm-10">
                                        {ktag.name}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-2 control-label">权重</label>
                                    <div className="col-sm-10">
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={ktag.weight}
                                            onChange={e => {
                                                e.stopPropagation();
                                                this.handleInput('weight', e)
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-2 control-label">考察方向</label>
                                    <div className="col-sm-10">
                                        <label className="checkbox-inline">
                                            <input
                                                type="checkbox"
                                                value="1"
                                                checked={ktag.assess_dirs.indexOf(1) !== -1}
                                                onChange={this.handleAssessInput}
                                            />概念</label>
                                        <label className="checkbox-inline">
                                            <input
                                                type="checkbox"
                                                value="2"
                                                checked={ktag.assess_dirs.indexOf(2) !== -1}
                                                onChange={this.handleAssessInput}
                                            />结论
                                        </label>
                                        <label className="checkbox-inline">
                                            <input
                                                type="checkbox"
                                                value="3"
                                                checked={ktag.assess_dirs.indexOf(3) !== -1}
                                                onChange={this.handleAssessInput}
                                            />应用
                                        </label>
                                        <label className="checkbox-inline">
                                            <input
                                                type="checkbox"
                                                value="4"
                                                checked={ktag.assess_dirs.indexOf(4) !== -1}
                                                onChange={this.handleAssessInput}
                                            />超纲
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-2 control-label">关联WIKI</label>
                                    <div className="col-sm-10">
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={ktag.wiki}
                                                onChange={e => {
                                                    e.stopPropagation();
                                                    this.handleInput.bind('wiki')
                                                }}
                                            />
                                            <span className="input-group-btn">
                                    <button
                                        disabled={!ktag.wiki}
                                        className={"btn btn-default"}
                                        onClick={this.onJumpWiki}
                                        type="button"
                                    >Go!</button>
                                </span>
                                        </div>
                                    </div>
                                </div>
                                <fieldset>
                                    <h3>教学目标</h3>
                                    <div className="form-group">
                                        <label className="col-sm-2 control-label">要求层次</label>
                                        <div className="col-sm-10">
                                            {radios}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-2 control-label">具体要求</label>
                                        <div className="col-sm-10">
                                            <textarea className="form-control" rows="5" value={ktag.teaching_objective.desc} onChange={this.handleTeachingObjectiveDescChange}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-2 control-label">课时</label>
                                        <div className="col-sm-10">
                                            <input
                                                type="number" min="0"
                                                className="form-control"
                                                value={ktag.teaching_objective.lesson_count}
                                                onChange={this.handleTeachingObjectiveLessonCountChange}
                                            />
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset>
                                    <h3>
                                        描述
                                    </h3>
                                    <div className="form-group">
                                        <label className="col-sm-2 control-label"></label>
                                        <div className="col-sm-10">
                                            <TagEditor
                                                onChange={this.onChange}
                                                value={ktag.desc}
                                                ref={(ref) => {
                                                    this._descEditor = ref;
                                                }}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-2 control-label"></label>
                                        <div className="col-sm-10">
                                            <div>
                                                <button
                                                    className="btn btn-default"
                                                    style={{
                                                        margin: "1em 0 1em .5em",
                                                    }}
                                                    onClick={this.handlePreview}
                                                >预览
                                                </button>
                                            </div>
                                            <HtmlWithTex html={desc_rendered} className="preview"/>
                                        </div>
                                    </div>


                                </fieldset>
                                <fieldset>
                                    <h3>
                                        Tip
                                    </h3>
                                    <div className="form-group">
                                        <label className="col-sm-2 control-label"></label>
                                        <div className="col-sm-10">
                                            <textarea
                                                className="form-control" rows="5"
                                                id="seePreID"
                                                value={ktag.tagging_tip}
                                                onChange={this.handleTipChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-2 control-label"></label>
                                        <div className="col-sm-10">
                                            <div>
                                                <button
                                                    className="btn btn-default"
                                                    style={{
                                                        margin: "1em 0 1em .5em",
                                                    }}
                                                    onClick={this.seePre.bind(this)}
                                                >预览
                                                </button>
                                            </div>
                                            <HtmlWithTex
                                                html={Q.htmlEscape(this.state.previewTip).replace(/\n/g, '<br />')}
                                                className="preview"
                                            />
                                        </div>
                                    </div>

                                </fieldset>
                            </div>
                        </div>
                    </div>


                </div>
            </Row>

        )
    }
}

function stateToProps(state) {
    return {
        ktag: state.ktag
    }
}

function mapDispatchToProps(dispatch) {
    return {
        saveKtag: (ktag) => {
            dispatch(saveKtag(ktag))
        }
    }
}

export default connect(stateToProps, mapDispatchToProps)(Content)