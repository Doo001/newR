import React from 'react';
import PropTypes from 'prop-types';
import 'react-sortable-tree/style.css'
import { Q, planIds } from 'js/quantum';
import { showAlert } from 'js/widgets/alert';
import { getSubject } from 'js/subjects';
import $ from 'jquery';
import { connect } from 'react-redux';
import { changeKtag } from 'store/actions'
import { Row, Col} from 'react-flexbox-grid';
import { browserHistory, Link } from 'react-router';
import { setNavBar, NavItem } from 'js/nav';
import { store } from "js/main_entry";
//import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import SortableTree, {
    changeNodeAtPath,
    addNodeUnderParent,
    removeNodeAtPath,
    getFlatDataFromTree
} from 'react-sortable-tree'
import {showAlertModal,Modal} from 'js/widgets/alertModal';
import {setCurrentNav} from "../item/ktag_editor";
import Select, {Option, OptGroup} from 'rc-select';

class KtagTree extends React.Component {
    constructor(props) {
        super(props)
        this.originTree = new Map();
        this.ajaxing = false;
        this.subject = getSubject();
        //this.ktTypes = this.subject.getKtTypeDescs().filter(item => planIds.indexOf(item.type) == -1);
        this.ktTypes = [];
        // this.ktTypes.sort(function(a,b){
        // 	return b.type-a.type
        // })

    }
    state = {
        treeType: '',
        permission: Global.user.role === 1,
        editAble: false,
        treeData: [],
        selected: ''
    }


    componentDidMount() {
        setCurrentNav('编辑');
        this.getRemoteKtag()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.params.type != this.props.params.type) {
            if (this.state.editAble) {
                this.state.editAble = false;
                clearInterval(this.LockHandle)
            }
            this.getRemoteData(nextProps.params.type);
        }
    }
    getRemoteKtag() {
        Q.get(`/api/root_ktags `).done(result => {
            this.ktTypes = result;
            this.state.selected = this.ktTypes[0].name;
            this.getRemoteData(this.ktTypes[0].type);
            browserHistory.push(`/ktags/${this.ktTypes[0].type}`)
            console.log(result);
        })
    }


    //获取后台数据
    getRemoteData(type) {
        Q.get(`/api/ktags`, { query: {
                type
            }}).done((results) => {
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
            if (cur.weight >=100) return total; //去掉小学
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
            Q.post(`/api/ktag/del_ktag/${node._id}`)
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

            //原
            Q.put('/api/ktags', {
                json: {
                    name: `${node.name}的子节点`,
                    treeIndex: node.children ? node.children.length ? node.children[node.children.length - 1].treeIndex + 1 : node.treeIndex + 1 : node.treeIndex + 1,
                    edu: +this.props.params.edu,
                    parent_id: node._id,
                    type: +node.type,
                    deleted: false,
                    weight: 0,
                    assess_dirs: [],
                    desc: "",
                    path: "",
                    stats: {freq: 0, avg_diff: 0},
                    teaching_objective: {desc: "", level: "", lesson_count: 0},
                    wiki: "",
                    _id: node._id
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
            Q.post(`/api/ktags`, {json: diff})
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
                        }, () => {
                            clearInterval(this.LockHandle)
                        })

                    })
            }
        }, 5000)
    }

    getNodeKey = ({node}) => node._id

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
    changeKtag = (node, path) => {
        let {treeId} = store.getState()
        if (treeId == node._id) return ;

        if (window.ktagStatus == "editing") {
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
            Q.post(`/api/ktag/rename_ktag/${node._id}`, {json: {name: node.newValue}})
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
        let { type } = this.props.params;
        Q.post(`/api/tag_lock/${type}`)
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
    changeTab = (e) => {
        let value;
        if (e && e.target) {
            value = e.target.value;
        } else {
            value = e;
        }
        let ktDesc = this.ktTypes.filter(item => item.name == value)
        this.setState({
            selected: value
        });
        browserHistory.push(`/ktags/${ktDesc[0].type}`)

    }
    addKtag = (e) => {
        let newKtag = document.querySelector('#ktag').value;
        if (newKtag) {
            Q.post(`/api/add_ktag`, {json: {ktag: newKtag}})
                .done(result => {
                    this.ktTypes = result;
                    document.querySelector('#ktag').value = '';
                    this.forceUpdate();
                })
        }
    }
    render() {
        let {edu, editAble} = this.state;
        let options = this.ktTypes.sort(function(a,b){
			return b.type-a.type
		}).map((typeDesc, index) => (
            <Option key={`${typeDesc}${index}`} value={typeDesc.name}>
                    {typeDesc.name}
            </Option>
        ));
        return (
            <div className="lesson-sider">

                <Row between="xs" middle="xs" className="edu-wrapper">
                    <Col xs={12}>
                        <Row between="xs" middle="xs">
                            <Col>
                                <input type = "text" id = "ktag" className='form-control' style={{width: '100px'}} placeholder = "添加新的知识点类型" />
                            </Col>

                            <Col/>
                            <button className="button-v2" onClick={this.addKtag}>添加</button>
                        </Row>
                    </Col>
                    <Col xs={12}>
                        <Row between="xs" middle="xs">
                            <Select className="select-edu" placeholder="选择" value={this.state.selected} animation="slide-up" showSearch={false} onChange={this.changeTab}>
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
                    </Col>
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
                                    this.changeKtag(node, path)
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
            dispatch(changeKtag(id))
        }
    }
}

function mapStateToProps(state) {
    return {
        editMode: state.editMode
    }
}

KtagTree.PropTypes = {
    selectNode: PropTypes.func.isRequired

}
export default connect(mapStateToProps, mapDispatchToProps)(KtagTree);