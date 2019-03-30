import React from 'react';
import PropTypes from 'prop-types';
import 'react-sortable-tree/style.css'
import {Q} from 'js/quantum';
import {showAlert} from 'js/widgets/alert';
import $ from 'jquery';
import {connect} from 'react-redux';
import {changeLesson} from 'store/actions'
import {Grid, Row, Col} from 'react-flexbox-grid';
import {browserHistory} from 'react-router';
import Select, {Option, OptGroup} from 'rc-select';

import { store } from "../js/main_entry";
//import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import SortableTree, {
    changeNodeAtPath,
    addNodeUnderParent,
    removeNodeAtPath,
    getFlatDataFromTree,
    getNodeAtPath
} from 'react-sortable-tree'
import {showAlertModal,Modal} from 'js/widgets/alertModal';

class RelationTree extends React.Component {
    constructor(props) {
        super(props)
        this.originTree = new Map();
        this.ajaxing = false;
    }

    state = {
        treeType: '',
        permission: Global.user.role === 1,
        editAble: false,
        treeData: [],
        selected: this.props.params.edu,
        edu: {
            3: {
                value: 3,
                text: '初中'
            },
            4: {
                value: 4,
                text: '高中'
            }
        },

    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.params.edu != this.props.params.edu) {
            if (this.state.editAble) {
                this.state.editAble = false;
                clearInterval(this.LockHandle)
            }
            this.getRemoteData(nextProps.params.edu);
        }
    }

    /*shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.edu != this.props.edu) {
            this.getRemoteData(nextProps.edu);
            return false;
        }
    }*/
    componentWillMount() {
        this.getRemoteData(this.props.params.edu);
    }

    //获取后台数据
    getRemoteData(edu) {
        Q.get(`/api/plan_tags/v1?edu=${edu}`).done((results) => {
            if (results.length === 0) {
                showAlert('当前类型没有知识点', 'danger');
                return;
            } else {
                this.originTree.clear()
                this.setState({
                    treeType: results[0].type,
                    treeData: this.productTreeData(results).treeData
                }, () => {
                    this.props.selectNode(this.state.treeData[0]._id)
                })

            }
        })
    }

    getNodeDetail = (rowInfo) => {
        console.log(rowInfo)
    }

    //生成树
    productTreeData(results) {
        var processData = results.reduce((total, cur, curIndex, arr) => {
            if (cur.deleted) return total;
            //if (rootTypes.indexOf(cur.type) == -1) return total;

            /*if (edu === Edu.kSenior && cur.weight > 0) return total;
            if (edu === Edu.kJunior && cur.weight < 0 && cur.weight >= 100) return total;
            if (edu === Edu.kElementary && cur.weight < 100 && cur.weight !== 0) return total;*/
            cur.children = [];
            this.originTree.set(cur._id, Object.assign({}, cur))
            cur.treeIndex = cur.treeIndex || parseInt(total.treeIndex * 100);
            total.treeIndex++;
            if (cur.parent_id === null) {
                cur.expanded = true;
                cur.active = true;
                total.treeData.unshift(cur);
            }
            if (total.temp[cur._id]) {
                cur.children = total.temp[cur._id].children;
                delete total.temp[cur._id]
            }
            if (total.nodeMap[cur.parent_id]) {
                total.nodeMap[cur.parent_id].children.push(cur)
                total.nodeMap[cur.parent_id].children.sort((rn, ln) => rn.treeIndex - ln.treeIndex)
            }
            if (cur.parent_id && !total.nodeMap[cur.parent_id]) {
                total.temp[cur.parent_id] = total.temp[cur.parent_id] || {children: []};
                total.temp[cur.parent_id].children.push(cur);
            }
            cur.children.sort((rn, ln) => rn.treeIndex - ln.treeIndex)
            total.nodeMap[cur._id] = cur;

            return total;
        }, {treeData: [], temp: {}, nodeMap: {}, treeIndex: 0})
        return processData;
    }

    //删除节点
    removeNode = (path, node) => {
        let tip = '删除节点';
        let contentt = `确认要删除节点【${node.name}】?`;
        //显示确认框
        showAlertModal(tip,contentt,true,()=>{
            //执行
            Q.post(`/api/plan_tag/del_plan_tag/${node._id}`)
             .done(data => {
                this.setState(state => ({
                treeData: removeNodeAtPath({
                    treeData: state.treeData,
                    path,
                    getNodeKey: this.getNodeKey
                })
                }))
            });
        },()=>{
            return;
        });

    }

    //添加子节点
    addNode = (path, node) => {
        if (!this.ajaxing) {
            this.ajaxing = true;
            Q.put('/api/plan_tags/v1', {
                json: {
                    name: `${node.name}的子节点`,
                    treeIndex: node.children ? node.children.length ? node.children[node.children.length - 1].treeIndex + 1 : node.treeIndex + 1 : node.treeIndex + 1,
                    edu: +this.props.params.edu,
                    parent_id: node._id,
                    type: +node.type
                }

            }).done(data => {
                this.ajaxing = false;
                this.setState(state => ({
                    treeData: addNodeUnderParent({
                        treeData: state.treeData,
                        parentKey: path[path.length - 1],
                        expandParent: true,
                        getNodeKey: this.getNodeKey,
                        newNode: Object.assign({}, data)
                    }).treeData,
                }), () => {
                    this.originTree.set(data._id, data)
                })
            }).fail((xhr) => {
                this.ajaxing = false;
                showAlert('新增节点失败', 'danger')
            })
        } else {
            showAlert('系统正在添加节点中。。。', 'danger')
        }


    }
    //保存新图谱
    saveTreeData = () => {

        let newData = getFlatDataFromTree({
            treeData: this.state.treeData,
            getNodeKey: this.getNodeKey,
            ignoreCollapsed: false
        })
        let diff = [];
        for (let i = 0; i < newData.length; i++) {
            let node = Object.assign({}, newData[i].node);
            if (node.treeIndex != this.originTree.get(node._id).treeIndex || node.parent_id != this.originTree.get(node._id).parent_id) {
                diff.push({
                    deleted: node.deleted,
                    name: node.name,
                    parent_id: node.parent_id,
                    treeIndex: node.treeIndex,
                    type: node.type,
                    _id: node._id
                })
            }
        }

        if (diff.length) {
            $('body').append(<div class="loading-wrap">
                <div class="loading">'正在更新结构图谱....'</div>
            </div>)
            Q.post(`/api/plan_tags/v1`, {json: diff})
                .done(result => {
                    diff.forEach(val => {
                        this.originTree.set(val._id, val)
                    })
                    this.setState({
                        editAble: false
                    })
                    clearInterval(this.LockHandle)
                })
                .fail(() => {
                    $('.loading-wrap').remove()
                    this.setState({
                        editAble: false
                    })
                    clearInterval(this.LockHandle)
                })

        } else {
            this.setState({
                editAble: false
            })
            clearInterval(this.LockHandle)
        }
    }
    //移动节点
    onMoveNode = ({treeData, node, treeIndex, path, nextPath, nextParentNode, nextTreeIndex, prevPath, prevTreeIndex}) => {
        //if (nextTreeIndex == prevTreeIndex) return;
        //判断是否移除界外了
        if (nextParentNode) {

            let index = nextParentNode.children.indexOf(node);

            treeIndex = index == 0 ? nextParentNode.treeIndex + 1 : nextParentNode.children[index - 1].treeIndex + 1;
            // treeIndex = index == nextParentNode.children.length - 1 ? (index == 0 ? nextParentNode.treeIndex + 1 : nextParentNode.children[index - 1].treeIndex + 1) : nextParentNode.children[index + 1].treeIndex - 1;
            let newNode = {...node, parent_id: nextParentNode._id, treeIndex}

            //节点下面的都加1
            for(let i = index + 1; i < nextParentNode.children.length; i++){
                nextParentNode.children[i].treeIndex = ++treeIndex;
            }
            this.setState(state => ({
                treeData: changeNodeAtPath({
                    treeData: this.state.treeData,
                    path,
                    getNodeKey: this.getNodeKey,
                    newNode,
                })
            }))

        } else {
            return ;
        }

        //this.props.asyncMoveTree(treeData, node, nextParentNode)
    }

    //续期
    loopTreeLock() {
        this.LockHandle = setInterval(() => {
            if (this.state.editAble) {
                Q.get(`/api/tag_lock/${this.state.treeType}`)
                    .done(result => {
                        console.log(result)
                    })
                    .fail(() => {
                        this.setState({
                            editAble: false
                        })
                        clearInterval(this.LockHandle)
                    })
            }
        }, 5000)
    }

    getNodeKey = ({node}) => node._id

    updateLesson = (name, node, path) => {
        $.post(`/api/plan_tag/rename_plan_tag/${node._id}`, {name})
            .done(data => {
                this.setState(state => (
                    {
                        treeData: changeNodeAtPath({
                            treeData: state.treeData,
                            path,
                            getNodeKey: this.getNodeKey,
                            newNode: {...node, name},
                        })
                    }
                ))
            })
    }
    changeEdu = (val, option) => {
        browserHistory.push(`/lesson/${val}`)
    }
    changeNode = (node, path) => {
        this.activeId = node._id;
        this.setState(state => ({
            treeData: changeNodeAtPath({
                treeData: state.treeData,
                path,
                getNodeKey: this.getNodeKey,
                newNode: Object.assign({}, node),
            }),
        }))
        this.props.selectNode(node._id);
    }
    changeLesson = (node, path) => {
        let {treeId, planStatus} = store.getState()
        if (treeId == node._id) return ;

        if (planStatus == "editing") {
            let tip = '提示';
            let content = "有内容没有保存，是否放弃编辑?";
            //显示确认框
            showAlertModal(tip,content,true,()=>{
                this.changeNode(node, path)
            },()=>{
                return;
            });

        }else{//没编辑的状态直接切换节点
            this.changeNode(node, path)
        }
    }

    editNode = (path, node) => {
        this.setState(state => ({
            treeData: changeNodeAtPath({
                treeData: state.treeData,
                path,
                getNodeKey: this.getNodeKey,
                newNode: {...node, editAble: true, newValue: node.name},
            })
        }))
    }
    saveNode = (path, node) => {
        if (node.newValue.trim()){
            Q.post(`/api/plan_tag/rename_plan_tag/${node._id}`, {json: {name: node.newValue}})
                .done(data => {
                    this.setState(state => ({
                        treeData: changeNodeAtPath({
                            treeData: state.treeData,
                            path,
                            getNodeKey: this.getNodeKey,
                            newNode: {...node, editAble: false, name: node.newValue},
                        })
                    }))
                })
        } else {
            showAlert('没有教案切片的名称呢！', 'danger');
            this.setState(state => ({
                treeData: changeNodeAtPath({
                    treeData: state.treeData,
                    path,
                    getNodeKey: this.getNodeKey,
                    newNode: {...node, newValue: node.name},
                })
            }))
        }

    }
    editTree = (e) => {

        Q.post(`/api/tag_lock/${this.state.treeType}`)
            .done(result => {
                this.setState({editAble: true}, this.loopTreeLock)
            })
            .fail(() => {
                this.setState({editAble: false})
            })
    }

    componentWillUnmount() {
        clearInterval(this.LockHandle)
    }

    render() {
        let {edu, editAble} = this.state;
        let options = []
        for (let key in edu) {
            options.push(<Option key={`edu${key}`} value={edu[key].value}>{edu[key].text}</Option>)
        }
        return (
            <div className="lesson-sider">
                <Row between="xs" middle="xs" className="edu-wrapper">
                    <Select
                        className="select-edu"
                        placeholder="版本"
                        value={edu[this.props.params.edu].text}
                        animation="slide-up"
                        showSearch={false}
                        onChange={this.changeEdu}
                    >
                        {
                            options
                        }
                    </Select>
                    <Col/>
                    {
                        !editAble ? <button disabled={!this.state.permission} className="button-v2"
                                            onClick={this.editTree}>编辑</button> :
                            <button disabled={!this.state.permission} className="button-v2"
                                    onClick={this.saveTreeData}>保存</button>
                    }

                </Row>
                <div className="lesson-tree-wrapper">
                    <SortableTree
                        onChange={treeData => this.setState({treeData})}
                        treeData={this.state.treeData}
                        onMoveNode={this.onMoveNode}
                        searchFocusOffset={0}
                        getNodeKey={this.getNodeKey}
                        generateNodeProps={({node, path}) => {
                            let val = {
                                title: node.parent_id ? node.editAble ?
                                    <input id={node._id} value={node.newValue} onChange={event => {
                                        event.stopPropagation();
                                        const name = event.target.value;
                                        this.setState(state => ({
                                            treeData: changeNodeAtPath({
                                                treeData: state.treeData,
                                                path,
                                                getNodeKey: this.getNodeKey,
                                                newNode: {...node, newValue: name},
                                            }),
                                        }))
                                    }}></input> : node.name : node.name,
                                style: {
                                    "backgroundColor": node._id == this.activeId ? "RGBA(237, 237, 237, 1)" : "transparent",
                                    "color": "#787878",
                                    "fontSize": "12px"
                                },
                                onDoubleClick: e => {
                                    e.stopPropagation();
                                    this.changeLesson(node, path)
                                },
                                buttons: []
                            }
                            if (node.parent_id != null) {
                                val.buttons.push(!node.editAble ? <button disabled={!this.state.permission || !editAble} className="btn" onClick={(e) => {
                                        e.stopPropagation();
                                        this.editNode(path, node)
                                    }}>编辑</button> :
                                    <button className="btn" disabled={!this.state.permission || !editAble} onClick={(e) => {
                                        e.stopPropagation();
                                        this.saveNode(path, node)
                                    }}>保存</button>)
                                val.buttons.push(<button disabled={!this.state.permission || !editAble} className="btn glyphicon glyphicon-trash" onClick={(e) => {
                                    e.stopPropagation();
                                    this.removeNode(path, node)
                                }}>
                                </button>)
                            }
                            val.buttons.splice(1, 0, <button disabled={!this.state.permission || !editAble} className="btn glyphicon glyphicon-plus" onClick={(e) => {
                                e.stopPropagation();
                                this.addNode(path, node)
                            }}>
                            </button>)

                            return val;
                        }}
                        canDrag={editAble}
                        //theme={FileExplorerTheme}
                        canDrop={({node, nextParent, nextPath }) => node.parent_id != null && nextParent}
                        isVirtualized={true}
                    />
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectNode: (id) => {
            dispatch(changeLesson(id))
        }
    }
}

function mapStateToProps(state) {
    return {
        editMode: state.editMode
    }
}

RelationTree.PropTypes = {
    selectNode: PropTypes.func.isRequired,
    editMode: PropTypes.bool.isRequired,
    edu: PropTypes.string.isRequired
}
export default connect(mapStateToProps, mapDispatchToProps)(RelationTree);