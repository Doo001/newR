import React from 'react'
import PropTypes from 'prop-types';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {getSubject} from "../subjects";
import {PlanItem} from 'js/item/planItem';
import {QuestionItem} from 'js/item/questionItem';
import Q from 'js/quantum';
import deleteImg from '../../img/delete.png'
import editImg from '../../img/edit.png'
import selectedImg from '../../img/selected.png'
import Select, {Option, OptGroup} from 'rc-select';

import AddContent from './addContent'
import { connect } from 'react-redux'
import { addTarget, removeTarget, addLesson, removeLesson, moveLesson, asyncText, asyncTarget, changePlanStatus } from 'store/actions'
import {showAlertModal,Modal} from 'js/widgets/alertModal';

class LessonTarget extends React.Component{
    constructor(props) {
        super(props)
    }
    state = {
        star: this.props.target.star.toString(),
        desc: this.props.target.desc,
        editAble: true,
    }
    changeLevel = (value, option) =>{
        this.setState({
            star: value
        })
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            star: nextProps.target.star.toString(),
            desc: nextProps.target.desc
        })
    }
    edit = e => {
        e.stopPropagation();
        this.setState({
            editAble: true
        })
    }

    remove = e => {
        e.stopPropagation();
        // if (!window.confirm(`确认要删除么?`)) {
        //     return;
        // }
        //显示确认框
         showAlertModal('删除目标','确认要删除此条教学目标么?',true,()=>{
             this.props.removeTarget(this.props.index);//执行
         },()=>{
             return;
         });

    }
    saveTarget = e => {
        e.stopPropagation();
        this.setState({
            editAble: false
        }, ()=>{
            this.props.syncPlanNode(this.props.index, {desc: this.state.desc, star: +this.state.star})
        })
    }
    changeDesc = e => {
        e.stopPropagation();
        this.setState({
            desc: e.target.value
        })
    }
    render() {
        let { editAble, star, desc } = this.state;
        let options = [], level = getSubject().getLessonSliceLevel();
        for (let key in level) {
            options.push((<Option className={key == star ? 'selected': ''} key={`lessonOptions${key}`} value={key+""}>{level[key].content}</Option>))
        }
        return (
            <Row middle="xs" className="target-body">
                <Col xs={3} sm={3}  md={4} lg={4}  >
                    {
                        editAble ? <Select style={{ width: "90%" }} showSearch={false} value={star} defaultValue={star+""} optionLabelProp="children"
                                           onChange={this.changeLevel}>{options}</Select>: <span>{level[star].content}</span>
                    }

                </Col>
                <Col xs={5} sm={6} md={5} lg={7}  >
                    {
                        editAble? <input  className="form-control" type="text" value={desc} onChange={this.changeDesc}/>: <span>{desc}</span>
                    }
                </Col>
                <Col xs={4} ms={3} md={3} lg={1}>
                    {
                        editAble? <a className="target-btn save" onClick={this.saveTarget}><img src={selectedImg} alt=""/></a>: <a className="target-btn edit" onClick={this.edit}><img src={editImg} alt=""/></a>
                    }
                    <a className="target-btn del" onClick={this.remove}><img src={deleteImg} alt=""/></a>
                </Col>
            </Row>
        )
    }

}


class LessonWrapper extends React.Component {

    constructor(props) {
        super(props)
        this.checkHandle = null;
        window.planTagVersion = '';
    }
    componentWillMount() {
        Q.get('/api/plan_tag/find_type ').done(typeDict => {
            this.setState({
                typeDict
            })
        })
    }
    checkDataVersion(lessonId) {
        if(this.checkHandle){
            clearInterval(this.checkHandle);
        }
        this.checkHandle  = setInterval(()=>{//轮询服务器
            if (lessonId) {
                Q.get(`/api/plan_tag/get_plantag_version/${lessonId}`)
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
    componentDidMount() {

        this.checkDataVersion(this.props.lesson._id)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.lesson && nextProps.lesson._id && nextProps.lesson._id != this.props.lesson._id) {

            this.checkDataVersion(nextProps.lesson._id);
        }
    }
    componentWillUnmount() {
        clearInterval(this.checkHandle);
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.typeDict && Object.keys(nextState.typeDict).length && Object.keys(nextProps.lesson).length) {
            if (!nextProps.lesson.content_list.length) {
                this.appendContent(nextProps.lesson.content_list, nextState.typeDict)
            }
            return true;
        }else {
            return false;
        }
    }
    appendContent(content, typeDict) {
        let templateType = [101, 102, 1, 2]
        templateType.forEach(type => {
            content.push({
                type: 1,
                data: {
                    content: "",
                    title: typeDict.text[type].title,
                    type
                }
            })
        })
    }

    state = {
        typeDict: {},
        targetStatus: false,
        typeTarget: "",
        typeStar: 1,
        lesson: this.props.lesson || {
            content_list: [],

        },

    }
    addTarget = e => {
        e.stopPropagation();
        this.props.addTarget({
            star: 1,
            desc: ""
        })
    }
    typeTarget = e => {
        this.setState({
            typeTarget: e.target.value
        })
    }
    selectStar = value => {
        this.setState({
            typeStar: value
        })
    }
    movePlan = (up = true, index, plan) => {
        this.props.moveLesson({
            up,
            index,
            plan
        })
    }
    // showAlertModal = (tip,cont,showCancelBtn) => {
    //     this.modal = Modal.show(
    //      <Modal title={tip} content={cont} showCancelBtn={showCancelBtn} confirm={confirm} cancel={cancel}>
    //      </Modal>
    //     );
    // }

    removePlan = (index,node) => {
        //提示文案
        let tip = '删除模块';
        let contentt = '确认要删除次块内容？';
        if(node.type == 1){
            tip = '删除文本';
            if(node.data.title == ''){
                if(node.data.type > 100){
                    contentt = '确定要删除此教材文本?';
                }else{
                    contentt = '确定要删除此教案文本?';
                }
            }else{
                contentt = '确定要删除此'+node.data.title+'?';
            }

        }else if(node.type == 2){
            tip = '删除题目';
            contentt = '确定要删除此'+node.data.title+'?';
        }
        //显示确认框
        showAlertModal(tip,contentt,true,()=>{
                this.props.removeLesson(index);//执行
        },()=>{
            return;
        });
    }

    /**
     *
     * @param type  插入的题型，拓展/常规的 文案 (3, 103,)
     */
    addTextContent = (type = 3) => {
        let {typeDict} = this.state;
        this.props.addLesson( [{
            type: 1,
            data: Object.assign({},typeDict.text[type], {
                content: ""
            })
        }])
        this.setState({change:false});
    }
    /**
     *
     * @param item  题目ID数组
     * @param type  插入的题型，拓展/常规的 题型
     */
    addItemContent = (type = 1, item) => {
    	console.log(item)
        let {typeDict} = this.state;
        let ary = item.map(id => ({"type": 2, data: {type, content: id, title: typeDict.item[type].title}}))
        this.props.addLesson(ary)
    }
    /**
     *
     * @param index 位置索引
     * @param data  更新的数据
     */
    syncPlanNode = (index, plan) => {
        /*this.state.lesson.content_list.splice(index, 1, data)
        this.forceUpdate()*/
        this.props.asyncText(index,plan)
    }

    changePlanStatus = (status) => {
        this.props.changePlanStatus(status);

    }
    syncTargetNode = (index, target) => {
        this.props.asyncTarget(index, target)
    }
    render() {
        let { targetStatus, typeTarget, typeStar, typeDict} = this.state;
        let { lesson } = this.props;

        return (
            <div className="lesson-body">
               <div className="lesson-body1">
                <h4 className="planTitle">
                    {lesson.name}
                </h4>
                <p className="planId">
                    {lesson._id}
                </p>
                <h4 className='targt'>教学目标</h4>
                <div>
                    <div className="targetTable">
                    <Row className='target-head' >
                        <Col xs={3} lg={5} md={4} sm={3}>
                            <b>星级</b>
                        </Col>
                        <Col xs={9} lg={7} md={8} sm={9}>
                            <b>要求</b>
                        </Col>
                    </Row>
                    {
                        lesson.target_list && lesson.target_list.map((list, index) => {
                            return (
                                <LessonTarget key={`target${index}`} target={list} index={index} {...this.props} syncPlanNode={this.syncTargetNode}/>
                            )
                        })
                    }
                    <Row center="xs" middle="xs" className='target-body'>
                        <a className="addTarget" onClick={this.addTarget}></a>
                    </Row>
                    </div>
                    {
                        lesson.content_list && lesson.content_list.map((content, index) => {

                            if (index == lesson.content_list.length-1) {
                                return (
                                    <div key={"add"}>
                                        <AddContent id={lesson._id} edu={lesson.edu} addItemContent={this.addItemContent} addTextContent={this.addTextContent}/>
                                        <PlanItem changePlanStatus={this.changePlanStatus} downAble={false} upAble={true} key={`content${index}`} index={index} node={content} colors={typeDict.text[content.data.type].color} movePlan={this.movePlan}
                                                  removePlan={this.removePlan} syncPlanNode={this.syncPlanNode}/>
                                    </div>
                                )
                            }else {
                                if (content.type == 1) {
                                    return (<PlanItem changePlanStatus={this.changePlanStatus} downAble={index < 3 || index>= lesson.content_list.length-2? false: true} upAble={index <= 3? false: true} key={`content${index}`} index={index} node={content} colors={typeDict.text[content.data.type].color} movePlan={this.movePlan}
                                                      removePlan={this.removePlan} syncPlanNode={this.syncPlanNode}/>)

                                }else if(content.type == 2){
                                    return (<QuestionItem  downAble={index < 3 || index>= lesson.content_list.length-2? false: true} upAble={index <= 3? false: true} key={`content${index}`} index={index} node={content}  movePlan={this.movePlan} removePlan={this.removePlan}
                                                          syncPlanNode={this.syncPlanNode}/>)
                                }
                            }


                        })

                    }


                </div>
                </div>
            </div>)
    }
}

LessonWrapper.propTypes = {
    lesson: PropTypes.object.isRequired,
    removeTarget: PropTypes.func.isRequired,
    addTarget: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        lesson: state.lesson
    }
}


function mapDispatchToProps(dispatch) {
    return {
        addTarget: (node) => {
            dispatch(addTarget(node))
        },
        removeTarget: (index) => {
            dispatch(removeTarget(index))
        },
        addLesson: (data) => {
            dispatch(addLesson(data))
        },
        removeLesson: (index) => dispatch(removeLesson(index)),
        moveLesson: data => dispatch(moveLesson(data)),
        asyncText: (index, plan) => dispatch(asyncText(index, plan)),
        asyncTarget: (index, target) => dispatch(asyncTarget(index, target)),
        changePlanStatus: () => dispatch(changePlanStatus('editing'))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonWrapper)