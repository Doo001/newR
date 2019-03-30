import React from 'react';
import {setNavBar, NavItem} from 'js/nav';
import {Q, planIds} from 'js/quantum';
import KindEditor from 'kindeditor';
import {HtmlWithTex} from 'js/widgets/html_with_tex';
import {getSubject} from 'js/subjects';
import {Link} from 'react-router';
import PlanWrap from 'js/widgets/plan'
import Portal from 'js/widgets/portal'
import Preview from 'js/plan/preview'
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'js/widgets/modal';;
import ItemParsing from 'subjects/<%SUBJECT%>/parsePage';
import $ from 'jquery';
import 'react-sortable-tree/style.css'
import SortableTree, {
    changeNodeAtPath,
    addNodeUnderParent,
    removeNodeAtPath,
    getNodeAtPath
} from 'react-sortable-tree'
//import {DragDropContext as dragDropContext} from 'react-dnd';
//import HTML5Backend from 'react-dnd-html5-backend';

//const wrap = dragDropContext(HTML5Backend);

const planTips = [
    "（说明：本部分只出现在教材中，给学生用的，如当地的考频考情分析等，选填）",
    "（说明：本部分只出现在教案中，指导教师备课用，选填）",
    "（说明：本部分出现在教案和教材中，选填）"
]

const maxDepth = 5;

class TaggingPanel extends React.Component {
    constructor(props) {
        super(props);
        const renderDepthTitle = ({path}) => `Depth: ${path.length}`;

        this.state = {
            active: null,
            active_type: null,
            treeData: [],
            nodeMap: {},
            editAble: false
            //root: null
        };
        this.originTree = new Map();
        this.changed = false;
        this.subject = getSubject();
        this.ktTypes = this.subject.getKtTypeDescs().filter(item => planIds.indexOf(item.type) == -1);
        this.path = [0]
        this.setBind();
    }

    componentDidMount() {
        this.handleTypeChange(+this.props.params.type || this.ktTypes[0].type);
        setCurrentNav('编辑');
        document.addEventListener('beforeunload', () => {
            this.couldChange();
        })
    }

    /*shouldComponentUpdate(nextProps, nextState) {
         return !this.changed;

    }*/
    componentWillReceiveProps(nextProps) {
        if (nextProps.params.type != this.props.params.type) {
            this.handleTypeChange(nextProps.params.type);
        }
    }
    onClickNode(nodeId) {
        if (!this.couldChange()) {
            return;
        }
        const node = this.state.nodeMap.get(nodeId);
        Q.assert(node);
        node.collapsed = false;
        this.changed = false;
        this.setState({
            active: nodeId
        });
    }

    onChange() {
        this.changed = true;
    }
    getTreeDataById(treeData, id) {
        let data ;
       for (let i = 0; i < treeData.length; i++) {
           if (treeData[i]._id == id) {
               data = treeData[i];
               break;
           }
           if (treeData[i].children && treeData[i].children.length) {
               data = this.getTreeDataById(treeData[i].children, id)
           }
       }
       return data;
    }


    onSubmit(newNode) {
        this.changed = false;
        let path = this.path;
        let getNodeKey = ({node}) => node._id;
        if (this.state.nodeMap[newNode._id]) {
            let data = this.getTreeDataById(this.state.treeData, newNode._id);
            this.sortTree.updateNode(this.path, Object.assign({}, data, newNode, {
                title: (rowInfo) => <a style={{cursor: 'pointer'}}
                                       onClick={(e) => {
                                           this.setActiveNode(e, rowInfo)
                                       }}>{rowInfo.node.name}</a>
            }))
        } else {
            this.originTree.set(newNode._id, newNode)
            this.state.nodeMap[newNode._id] = newNode;
            this.sortTree.addNode(path[path.length - 1], {
                ...newNode,
                children: [],
                title: (rowInfo) => <a style={{cursor: 'pointer'}}
                                       onClick={(e) => {
                                           this.setActiveNode(e, rowInfo)
                                       }}>{rowInfo.node.name}</a>,
            })

        }


    }

    setBind() {
        this.onClickNode = this.onClickNode.bind(this);
        this.renderNode = this.renderNode.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.couldChange = this.couldChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
    }

    traverse(root, fn) {
        Q.assert(typeof fn === "function");

        const queue = [root];
        while (queue.length) {
            const node = queue.pop();
            fn(node);
            queue.push(...node.children);
        }
    }

    sortNodeChildren(node) {
        Q.assert(node);
        Q.assert(node.children instanceof Array);

        node.children.sort((ln, rn) => rn.weight - ln.weight);
        return node;
    }

    handleDelete = (rowInfo) => {
        const node = rowInfo.node;
        if (!window.confirm(`确认要删除节点【${node.name}】?`)) {
            return;
        }

        let handle = null;
        if (planIds.indexOf(+this.props.params.type) != -1) {
            handle = Q.patch(`/api/plan_tag/${node._id}`, {json: {deleted: true}})
        } else {
            handle = Q.patch(`/api/ktag/${node._id}`, {json: {deleted: true}})
        }
        handle.done((newNode) => {
            this.state.nodeMap[newNode._id].deleted = newNode.deleted;
            if (this.state.active == newNode._id) {
                this.state.active = null;
                this.forceUpdate(() => {
                    this.sortTree.removeNode(rowInfo)
                })
            } else {
                this.sortTree.removeNode(rowInfo)
            }


        })
            .fail((jqXHR, statusText) => {
                Q.defaultAjaxFail(jqXHR, statusText);
            })

        ;
    }

    genPath(node) {
        let current = node;
        let path = '';
        while (current.parent_id) {
            const parent = this.state.nodeMap[current.parent_id];
            path = ' > '.concat(current.name, path);
            current = parent;
        }
        return current.name + path;
    }

    couldChange() {
        if (this.changed) {
            return confirm('是否放弃已修改的内容?可点击取消后保存');
        }
        return true;
    }

    handleTypeChange(type) {
        if (type === this.state.active_type) {
            return;
        }
        if (!this.couldChange()) {
            return;
        }
        this.changed = false;
        this.setState({
            active_type: type,
            editAble: false,
            root: null,
            active: null
        });
        if (this.LockHandle) {
            clearInterval(this.LockHandle)
        };
        this.fetchTags(type);
        return true;
    }

    setActiveNode = (e, rowInfo) => {
        if (rowInfo.node.parent_id == null) {
            Q.alert('根节点不可编辑', 'danger');
            return ;
        }
        if (!this.couldChange()) return ;
        this.path = rowInfo.path;
        let selRow = document.querySelector('.rst__row.selected')
        if (selRow) {
            selRow.classList.remove('selected')
        }
        e.target.parentNode.parentNode.parentNode.parentNode.classList.add('selected')
        this.state.active = rowInfo.node._id;
        this.changed = false;
        this.forceUpdate()
    }

    fetchTags(type) {
        var getKtag = null;
        if (planIds.indexOf(+type) != -1) {
            getKtag = Q.get('/api/plan_tags')
        } else {
            getKtag = Q.get(`/api/ktags`, {
                query: {
                    type
                },
            });
        }
        var processData = {}
        getKtag.done((results) => {
            this.originTree.clear();
            if (results.length === 0) {
                alert('当前类型没有知识点');
                return;
            }
            processData = results.reduce((total, cur, curIndex, arr) => {
                if (cur.deleted) return total;
                cur.title = (rowInfo) => <a style={{cursor: 'pointer'}}
                                            onClick={(e) => {
                                                this.setActiveNode(e, rowInfo)
                                            }}>{rowInfo.node.name}</a>;
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
                    total.nodeMap[cur.parent_id].children.sort((rn,ln) => rn.treeIndex - ln.treeIndex)
                }
                if (cur.parent_id && !total.nodeMap[cur.parent_id]) {
                    total.temp[cur.parent_id] = total.temp[cur.parent_id] || {children: []};
                    total.temp[cur.parent_id].children.push(cur);
                }
                cur.children.sort((rn,ln) => rn.treeIndex - ln.treeIndex)
                total.nodeMap[cur._id] = cur;

                return total;
            }, {treeData: [], temp: {}, nodeMap: {}, treeIndex: 0})
            this.path = [processData.treeData.length ? processData.treeData[0]._id : null];
            this.setState({
                treeData: processData.treeData,
                nodeMap: processData.nodeMap,
                active: processData.treeData.length ? processData.treeData[0]._id : null
            });
        })
            .fail((jqXHR, statusText) => {
                Q.defaultAjaxFail(jqXHR, statusText);
            })
    }


    renderNode(node_) {
        const node = this.state.nodeMap.get(node_._id);
        if (node.parent_id !== null) {
            const parent = this.state.nodeMap.get(node.parent_id);
            Q.assert(parent);
            if (parent.collapsed) {
                return null;
            }
        }
        if (node._id === this.state.active) {
            node.path = this.genPath(node);
        }
        return (
            <span
                className={node._id === this.state.active ? "node is-active" : "node"}
                onClick={this.onClickNode.bind(null, node._id)}
                key={node._id}
            >{node.name} ({node.weight})</span>
        );
    }

    renderTagTypes() {
        const tabList = this.ktTypes.map((typeDesc, index) => (
            <li
                key={`${typeDesc}${index}`}
            >
                <Link activeClassName={'active'} to={`/ktags/${typeDesc.type}`}>{typeDesc.name}</Link>
            </li>
        ));

        // es-lint 报错 expected no return value, 不清楚原因
        return ( // eslint-disable-line consistent-return
            <ul className="nav nav-tabs" role="tablist">{tabList}</ul>
        );
    }

    updateTreeCallback = treeData => {
        this.state.treeData = treeData;
    }

    syncTreeData = (treeData) => {
        this.state.treeData = treeData;
    }

    editTree = (e) => {
        let {type} = this.props.params;
        Q.post(`/api/tag_lock/${type}`)
            .done(result => {
                this.setState({editAble: true}, this.loopTreeLock)
            })
            .fail((jqXHR, statusText) => {
                Q.defaultAjaxFail(jqXHR, statusText);
            })
    }

    componentWillUnmount() {
        if (this.LockHandle) {
            clearInterval(this.LockHandle)
            this.LockHandle = null;
        }
    }

    loopTreeLock() {
        let {type} = this.props.params;
        this.LockHandle = setInterval(() => {
            if (this.state.editAble) {
                Q.get(`/api/tag_lock/${type}`)
                    .fail(() => {
                        editAble: false
                    })
            } else {
                clearInterval(this.LockHandle)
            }
        }, 5000)
    }

    asyncMoveTree = (treeData, node, nextParentNode) => {
        this.state.treeData = treeData;
        this.state.nodeMap[node._id].parent_id = nextParentNode._id;
        let treeIndex = null;
        let index = nextParentNode.children.indexOf(node);
        treeIndex = index == nextParentNode.children.length - 1 ? index == 0 ? nextParentNode.treeIndex + 1 : nextParentNode.children[index + 1].treeIndex - 1 : nextParentNode.children[index + 1].treeIndex - 1;
        this.state.nodeMap[node._id].treeIndex = treeIndex;
    }
    saveTree = () => {
        let diff = [];
        for (let [_id, obj] of this.originTree) {
            let currentNode = Object.assign({}, this.state.nodeMap[_id])
            if (obj.treeIndex != currentNode.treeIndex || obj.parent_id != currentNode.parent_id || obj.name != currentNode.name) {
                delete currentNode.children;
                delete currentNode.active;
                delete currentNode.expanded;
                diff.push(currentNode)
            }
        }
        if (diff.length) {
            $('body').append(<div class="loading-wrap"><div class="loading">'正在更新结构图谱....'</div></div>)
            Q.post(`/api/ktags`, {json: diff})
                .done(result => {
                    this.setState({
                        editAble: false
                    })
                    diff.forEach(val => {
                        this.originTree.set(val._id, val)
                    })

                })
                .fail((jqXHR, statusText) => {
                     $('.loading-wrap').remove()
                    Q.defaultAjaxFail(jqXHR, statusText);
                })

        } else {
            this.setState({
                editAble: false
            })
        }
    }

    render() {
        let node = {};
        if (this.state.active) {
            node = this.state.nodeMap[this.state.active];
            node.path = this.genPath(node);
        } else {
            node.type = this.props.params.type;
        }
        return (
            <div id="tag-panel">
                <div className="tag-view">
                    {this.renderTagTypes()}
                    <div className="handle-lock">
                        <button className="btn btn-primary" disabled={this.state.editAble} onClick={this.editTree}>编辑
                        </button>
                        <button className="btn btn-primary" disabled={!this.state.editAble} onClick={this.saveTree}>保存
                        </button>
                    </div>
                    <RelationalMap ref={(t) => this.sortTree = t} activeType={+this.state.active_type}
                                   treeData={this.state.treeData}
                                   editAble={this.state.editAble}
                                   asyncMoveTree={this.asyncMoveTree}
                                   updateTreeCallback={this.updateTreeCallback} handleDelete={this.handleDelete}
                                   handleAdd={this.handleAdd} syncTreeData={this.syncTreeData}/>
                </div>
                <div className="tag-controller row">
                    <TagUpdater
                        editAble={this.state.editAble}
                        activeType={+this.props.params.type}
                        subject={this.subject}
                        node={node}
                        onSubmit={this.onSubmit}
                        onChange={this.onChange}
                    />
                </div>

            </div>

        );
    }
}

export default TaggingPanel;

class RelationalMap extends React.Component {
    constructor(props) {
        super(props)
        this.path = {
            update: null
        }
    }

    state = {
        treeData: this.props.treeData
    }

    updateNode(path, newNode) {
        this.setState(state => ({
            treeData: changeNodeAtPath({
                treeData: state.treeData,
                path: path,
                getNodeKey: this.getNodeKey,
                newNode: newNode,
            })
        }), () => {
            this.props.updateTreeCallback(this.state.treeData)
        })

    }

    addNode(parentKey, newNode) {
        this.setState(state => ({
            treeData: addNodeUnderParent({
                treeData: state.treeData,
                parentKey,
                expandParent: true,
                getNodeKey: this.getNodeKey,
                newNode
            }).treeData,
        }), () => {
            this.props.updateTreeCallback(this.state.treeData)
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({treeData: nextProps.treeData})
    }

    updateTreeNode = (treeData) => {
        this.setState({treeData: treeData})
        this.props.updateTreeCallback(treeData)
    }
    getNodeKey = ({node}) => node._id
    onMoveNode = ({treeData, node, treeIndex, path, nextPath, nextParentNode, nextTreeIndex, prevPath, prevTreeIndex}) => {
        if (nextTreeIndex == prevTreeIndex) return;
        this.props.asyncMoveTree(treeData, node, nextParentNode)
    }

    removeNode = (rowInfo) => {
        this.setState(state => ({
            treeData: removeNodeAtPath({
                treeData: state.treeData,
                path: rowInfo.path,
                getNodeKey: this.getNodeKey,
            }),
        }), () => {
            this.props.updateTreeCallback(this.state.treeData)
        })
    }

    render() {
        let dragAble = Global.user.role === 1 && this.props.editAble;
        return (
            <SortableTree
                treeData={this.state.treeData}
                onChange={this.updateTreeNode}
                onMoveNode={this.onMoveNode}
                searchFocusOffset={0}
                getNodeKey={this.getNodeKey}
                generateNodeProps={(rowInfo) => {
                    let val = {}
                    if (rowInfo.node.parent_id !== null) {
                        val.buttons = [
                            <button
                                className="btn btn-danger"
                                style={{
                                    verticalAlign: 'middle',
                                }}
                                disabled={!this.props.editAble}
                                onClick={() => this.props.handleDelete(rowInfo)}
                             >
                                删除
                            </button>]
                    }
                    return val;
                }}
                canDrag={dragAble}
                canDrop={({node, nextParent, nextPath }) => node.parent_id != null && nextParent}
                isVirtualized={true}
            />

        )
    }
}

class TagUpdater extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            html: {
                deep_explain: {
                    expand: '',
                    summary: ''
                },
                general_explain: {
                    guide: '',
                    knowledge: '',
                    summary: ''
                }
            },
            node: Object.assign(this._createNode('', props.node.type, null, ''), props.node),
            previewPlan: false,
            busy: false,
            previewTip: '',
        };
        this.setBind();
    }

    componentDidMount() {
        this.refresh(this.props);
    }

    previewPlan = () => {
        let requestAll = [];
        let api = `/api/ktag${this.state.node._id ? '/'+this.state.node._id : '' }`,
            general_desc_value = this.refs.general_desc.value(),
            general_guide_value = this.refs.general_guide.value(),
            general_summary_value = this.refs.general_summary.value(),
            deep_expand_value = this.refs.deep_expand.value(),
            deep_summary_value = this.refs.deep_summary.value();
        if (!general_desc_value) return Q.alert('需要填写讲解要求', 'danger');
        /*requestAll.push(Q.post(api, {json: {preview: {desc: general_desc_value}}}))
        if (!deep_expand_value) return Q.alert('需要填写深度拓展讲解', 'danger');
        if (!deep_summary_value) return Q.alert('需要填写深度拓展总结', 'danger');
        if (!general_summary_value) return Q.alert('需要填写讲解小结', 'danger');*/
        let general_desc = Q.post(api, {json: {preview: {desc: general_desc_value}}}),
            general_guide = Q.post(api, {json: {preview: {desc: general_guide_value}}}),
            general_summary = Q.post(api, {json: {preview: {desc: general_summary_value}}}),
            deep_expand = Q.post(api, {json: {preview: {desc: deep_expand_value}}}),
            deep_summary = Q.post(api, {json: {preview: {desc: deep_summary_value}}});
        $.when(general_desc, general_guide, general_summary, deep_expand, deep_summary)
            .done((general_desc, general_guide, general_summary, deep_expand, deep_summary) => {
                this.state.node.general_explain.desc = general_desc.desc;
                this.state.html.general_explain.desc = general_desc.desc_rendered;
                this.state.node.general_explain.guide = general_guide.desc;
                this.state.html.general_explain.guide = general_guide.desc_rendered;
                this.state.node.general_explain.summary = general_summary.desc;
                this.state.html.general_explain.summary = general_summary.desc_rendered;
                this.state.node.deep_explain.expand = deep_expand.desc;
                this.state.html.deep_explain.expand = deep_expand.desc_rendered;
                this.state.node.deep_explain.summary = deep_summary.desc;
                this.state.html.deep_explain.summary = deep_summary.desc_rendered;
                this.setState(preState => {
                    return {...preState, ...{previewPlan: true}}
                }, () => {
                    //this.props.onChange();
                })

            })

    }

    componentWillReceiveProps(nextProps) {
        this.refresh(nextProps);
        this.setState({node: Object.assign({}, this._createNode('', nextProps.node.type, null, ''), nextProps.node)})
    }

    onJumpWiki() {
        window.open('http://wiki.ma.photonmath.com/'.concat(this.state.node.wiki));
    }

    setBind() {
        this.handleInput = this.handleInput.bind(this);
        this.handleAssessInput = this.handleAssessInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onJumpWiki = this.onJumpWiki.bind(this);
        this.createSubNode = this.createSubNode.bind(this);
        this.couldDelete = this.couldDelete.bind(this);
    }

    refresh(props) {
        if (!props.node._id) {
            const tmpNode = Object.assign(this._createNode('', props.node.type, null, ''), props.node);
            tmpNode._tmp = true;
            this.setState({node: tmpNode, previewTip: ''});
            return;
        }
        let ktag = null;
        if (planIds.indexOf(+props.activeType) != -1) {
            ktag = Q.get(`/api/plan_tag/${props.node._id}`)
        } else {
            ktag = Q.get(`/api/ktag/${props.node._id}`)
        }
        ktag.done((node) => {
            if (!props.node || node._id !== props.node._id) {
                // ignore delayed response
                return;
            }
            // 补充本地添加的属性
            const newNode = Object.assign({}, props.node, node);
            this.setState({
                node: newNode,
                previewTip: '',
                html: {
                    deep_explain: {
                        expand: '',
                        summary: ''
                    },
                    general_explain: {
                        guide: '',
                        knowledge: '',
                        summary: ''
                    }
                }
            });
        })
        ;
    }

    handleInput(name, event) {
        const node = this.state.node;
        if (node[name] !== event.target.value) {
            this.props.onChange();
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

    handleAssessInput(event) {
        const index = Number.parseInt(event.target.value, 10);
        const node = this.state.node;
        const assess = node.assess_dirs;
        if (event.target.checked) {
            assess.push(index);
        } else {
            assess.splice(assess.indexOf(index), 1);
        }
        this.setState({
            node,
        });
        this.props.onChange();
    }

    savePlan() {
        const node = this.state.node;
        if (this.state.node._tmp) {
            Q.alert("Can't opererate on tmp node!");
            return;
        }
        let request = null;
        const name = node.name.trim();
        if (!name) {
            Q.alert('名称不能为空', 'danger');
            return;
        }
        node.weight = node.weight || 0;
        const weight = Number.parseInt(node.weight, 10);
        /*if (isNaN(weight)) {
            Q.alert('请设置权重为整数', 'danger');
            return;
        }*/
        node.name = name;
        node.weight = weight;
        node.general_explain.star = +node.general_explain.star;
        node.general_explain.desc = this.refs.general_desc.value();
        /*if (!node.general_explain.desc) {
            Q.alert('需要补充下教学要求', 'danger');
            return;
        }*/
        node.general_explain.exam = this.refs.general_exam.value();

        if (node.general_explain.exam && planTips.indexOf(node.general_explain.exam) != -1) {
            node.general_explain.exam = "";
        }
        node.general_explain.guide = this.refs.general_guide.value();
        if (node.general_explain.guide && planTips.indexOf(node.general_explain.guide) != -1) {
            node.general_explain.guide = ""
        }
        node.general_explain.knowledge = this.refs.general_knowledge.value();
        if (node.general_explain.knowledge && planTips.indexOf(node.general_explain.knowledge) != -1) {
            node.general_explain.knowledge = ""
        }
        node.general_explain.summary = this.refs.general_summary.value();
        /*if (!node.general_explain.summary) {
            Q.alert('需要补充下讲解小结', 'danger');
            return;
        }*/

        node.deep_explain.expand = this.refs.deep_expand.value();
        /*if (!node.deep_explain.expand) {
            Q.alert('需要补充下讲解小结', 'danger');
            return;
        }*/
        node.deep_explain.summary = this.refs.deep_summary.value();
        /*if (!node.deep_explain.summary) {
            Q.alert('需要补充下拓展讲解小结', 'danger');
            return;
        }*/
        this.setState({busy: true});
        let deep_question_list = node.deep_explain.question_list.map(item => {
            let qus = Object.assign({}, item);
            delete qus.html;
            delete qus.id;
            return qus
        });
        let general_question_list = node.general_explain.question_list.map(item => {
            let qus = Object.assign({}, item);
            delete qus.html;
            delete qus.id;
            return qus
        });
        request = node._id !== null ? Q.patch(`/api/plan_tag/${node._id}`, {
            json: {
                treeIndex: 12,
                name: node.name,
                deleted: node.deleted,
                weight: node.weight,
                general_explain: {...node.general_explain, ...{question_list: general_question_list}},
                deep_explain: {...node.deep_explain, ...{question_list: deep_question_list}}
            }
        }) : Q.put(`/api/plan_tags`, {
            json: {
                ...node, ...{general_explain: {...node.general_explain, ...{question_list: general_question_list}}},
                ...{deep_explain: {...node.deep_explain, ...{question_list: deep_question_list}}}
            }
        });
        request.done((newNode) => {
            this.props.onSubmit(newNode);
        })
            .always(() => this.setState({busy: false}))
        ;
    }

    saveData() {
        const node = this.state.node;
        if (this.state.node._tmp) {
            Q.alert("Can't opererate on tmp node!");
            return;
        }
        let request = null;

        const name = node.name.trim();
        if (!name) {
            Q.alert('名称不能为空', 'danger');
            return;
        }

        const weight = Number.parseInt(node.weight, 10);
        if (isNaN(weight)) {
            Q.alert('请设置权重为整数', 'danger');
            return;
        }

        const lessonCount = Number.parseFloat(node.teaching_objective.lesson_count, 10);
        if (isNaN(lessonCount)) {
            Q.alert('请设置课时数为数字', 'danger');
            return;
        }

        node.name = name;
        node.weight = weight;
        node.teaching_objective.lesson_count = lessonCount;

        this.setState({busy: true});
        request = node._id === null ? Q.put(`/api/ktags`, {json: node}) : Q.patch(`/api/ktag/${node._id}`, {
            json: {
                name: node.name,
                deleted: node.deleted,
                weight: node.weight,
                wiki: node.wiki,
                assess_dirs: node.assess_dirs,
                teaching_objective: node.teaching_objective,
                desc: node.desc,
                tagging_tip: node.tagging_tip,
            }
        })
        request.done((newNode) => {
            this.props.onSubmit(newNode);
        })
            .always(() => this.setState({busy: false}))
        ;

    }

    handleSubmit() {
        planIds.indexOf(+this.props.activeType) != -1 ? this.savePlan() : this.saveData()
    }

    syncStateNode = (name, plans) => {
        this.state.node[name].question_list = plans;
        //this.props.onChange()
    }

    createSubNode() {
        const parent = this.state.node;
        Q.assert(parent._id);

        const name = parent.name.concat('的子节点');
        const node = this._createNode(name, this.props.activeType, parent._id, parent.path.concat(" > ", name), parent.treeIndex + 1);
        this.props.onChange();
        this.setState({
            node,
        });
    }

    _createNode(name, type, parentId, path, treeIndex) {
        let tempObj = {
            _id: null,
            name,
            type,
            weight: 0,
            parent_id: parentId,
            path,
            deleted: false,
            treeIndex
        }
        if (planIds.indexOf(+type) != -1) {
            return Object.assign({}, tempObj, {
                deep_explain: {
                    expand: '',
                    question_list: [],
                    summary: ''
                },
                general_explain: {
                    desc: '',
                    exam: '',
                    guide: '',
                    knowledge: '',
                    question_list: [],
                    star: 1,
                    summary: ''
                }
            })
        } else {
            return Object.assign({}, tempObj, {
                wiki: '',
                desc: '',
                assess_dirs: [],
                teaching_objective: {
                    desc: '',
                    level: '',
                    lesson_count: 0,
                },
                stats: {
                    freq: 0,
                    avg_diff: 0
                }
            })
        }
    }

    couldDelete() {
        if (!this.state.node._id) {
            return false;
        }
        if (!this.state.node.parent_id) {
            return false;
        }
        return !this.props.node.children.some(node => !node.deleted);
    }


    _renderTeachingObjective() {
        const radios = ['A', 'B', 'C'].map(level =>
            <label className="radio-inline" key={level}>
                <input
                    type="radio"
                    value={level}
                    checked={this.state.node.teaching_objective.level === level}
                    onChange={this.handleTeachingObjectiveLevelChange.bind(this)}
                />{level}</label>
        );
        return (
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
                        <textarea
                            className="form-control" rows="5"
                            value={this.state.node.teaching_objective.desc}
                            onChange={this.handleTeachingObjectiveDescChange.bind(this)}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2 control-label">课时</label>
                    <div className="col-sm-10">
                        <input
                            type="number" min="0"
                            className="form-control"
                            value={this.state.node.teaching_objective.lesson_count}
                            onChange={this.handleTeachingObjectiveLessonCountChange.bind(this)}
                        />
                    </div>
                </div>
            </fieldset>
        );
    }

    handleTeachingObjectiveLevelChange(evt) {
        this.state.node.teaching_objective.level = evt.target.value;
        this.forceUpdate();
        this.props.onChange();
    }

    handleTeachingObjectiveDescChange(evt) {
        this.state.node.teaching_objective.desc = evt.target.value;
        this.forceUpdate();
        this.props.onChange();
    }

    handleTeachingObjectiveLessonCountChange(evt) {
        this.state.node.teaching_objective.lesson_count = evt.target.value;
        this.forceUpdate();
        this.props.onChange();
    }

    handleTipChange(evt) {
        this.state.node.tagging_tip = evt.target.value;
        this.forceUpdate();
        this.props.onChange();
    }

    _renderDesc() {
        return (
            <fieldset>
                <h3>
                    描述
                </h3>
                <div className="form-group">
                    <label className="col-sm-2 control-label"></label>
                    <div className="col-sm-10">
                        <TagEditor
                            value={this.state.node.desc}
                            ref={(ref) => {
                                this._descEditor = ref;
                            }}
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
                                onClick={this.handlePreview.bind(this)}
                            >预览
                            </button>
                        </div>
                        <HtmlWithTex html={this.state.node.desc_rendered || ''} className="preview"/>
                    </div>
                </div>


            </fieldset>
        );
    }
    seePre(){
    	let oSeePreVal=document.getElementById('seePreID').innerHTML;
    	if(!oSeePreVal.trim()){
    		document.getElementById('hwt-2').innerHTML="";
    		return;
    	}else{
    		this.setState({previewTip: this.state.node.tagging_tip})
    	}
    }

    _renderTip() {
        const tip = this.state.node.tagging_tip;
        return (
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
                            value={tip || ''}
                            onChange={this.handleTipChange.bind(this)}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2 control-label"></label>
                    <div className="col-sm-10" >
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
        );
    }

    handlePreview() {
        const desc = this._descEditor.value();
        let url = `/api/ktag${this.state.node._id ? '/'+this.state.node._id : ''}`;
        Q.post(url, {json: {preview: {desc}}})
            .done((data) => {
                Object.assign(this.state.node, data);
                this.forceUpdate();
                this.props.onChange();
            })
        ;
    }

    changeLevel = (event) => {
        this.state.node.general_explain.star = event.target.value;
        this.props.onChange();
        this.forceUpdate();
    }
    explainChange = (val) => {
        this.state.node.general_explain.desc = this.refs.general_desc.value();
        this.props.onChange();
    }
    handlePreviewPlan = (ref, obj, key) => {
        const desc = this.refs[ref].value().trim();
        if (!desc) return;
        let url = `/api/ktag${this.state.node._id ? '/'+this.state.node._id : ''}`;
        Q.post(url, {json: {preview: {desc}}})
            .done((data) => {
                this.state.node[obj][key] = data.desc;
                this.state.html[obj][key] = data.desc_rendered;
                this.forceUpdate(() => {
                    this.props.onChange()
                });

            })

    }
    saveCallback = (item) => {
        this.modal.close();
        this.props.onChange();
        this.modal = null;
        this.state.node[this.currentAddType].question_list.push({
            id: item._id,
            html: item.html,
            sort: 0,
            type: 1,
            item_id: item._id
        });
        this.setState({node: Object.assign({}, this.state.node)})

    }
    showCreateModal = (type) => {
        this.currentAddType = type;
        this.modal = Modal.show(
            <Modal
                modalDialogClass="modal-big"
            >
                <ModalHeader>
                    <h4 className="modal-title">题目新建</h4>
                </ModalHeader>
                <ModalBody>
                    <ItemParsing
                        saveCallback={this.saveCallback}
                    />
                </ModalBody>
                <ModalFooter>
                    <button
                        type="button" className="btn btn-default modal-btn"
                        data-action="close"
                    >
                        关闭
                    </button>
                </ModalFooter>
            </Modal>
        );
    }
    //新添加的模块的方法
    movePlan = (up = true, index, plan) => {
        this.state.plans.splice(index, 1)
        if (up) {
            this.state.plans.splice(index - 1, 0, plan)
        } else {
            this.state.plans.splice(index + 1, 0, plan)
        }
        this.setState({ plans: this.state.plans.slice() })
        this.props.syncStateNode(this.props.name, this.state.plans)
    }
    syncPlanNode = (item) => {
        for (let i = 0; i < this.state.plans.length; i++) {
            if (this.state.plans[i].id == item.id) {
                this.state.plans[i] = item;
                break;
            }
        }
        this.props.syncStateNode(this.props.name, this.state.plans)
    }
    removePlan = (plan) => {
        let plans = this.state.plans;
        for (let i = 0; i < plans.length; i++) {
            if (plan.item_id == plans[i].item_id) {
                plans.splice(i, 1);
                break;
            }
        }
        this.forceUpdate(() => {
            this.props.syncStateNode(this.props.name, plans)
        })
    }
    delItem = () =>{

    }
    //新添加的模块的方法

    renderLessonSlice() {
        let {node, html} = this.state;
        let options = [], level = getSubject().getLessonSliceLevel()
        for (let key in level) {
            options.push((<option value={key}>{level[key].content}</option>))
        }

        return (
            <fieldset>
                <h3>教学目标 <span className="text-danger plan-tips">本模块在教案和教材中显示</span></h3>
                <div className="form-group">
                    <label className="col-sm-2 control-label">星级</label>
                    <div className="col-sm-10">
                        <select className="form-control" name="" id="" value={node.general_explain.star}
                                onChange={this.changeLevel}>{options}</select>
                    </div>

                </div>
                <div className="form-group">
                    <label className="col-sm-2 control-label">要求</label>
                    <div className="col-sm-10">
                        <TagEditor
                            value={node.general_explain.desc}
                            onChange={this.explainChange}
                            placeholder=""
                            ref="general_desc"
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
                                onClick={() => this.handlePreviewPlan('general_desc', 'general_explain', 'desc')}
                            >预览
                            </button>
                        </div>
                        <HtmlWithTex html={html.general_explain.desc || ''} className="preview"/>
                    </div>
                </div>
                <h3>考情分析 <span className="text-danger plan-tips">本模块只在教材中显示</span></h3>
                <div className="form-group">
                    <label className="col-sm-2 control-label"></label>
                    <div className="col-sm-10">
                        <TagEditor
                            onChange={this.props.onChange}
                            value={node.general_explain.exam || "（说明：本部分只出现在教材中，给学生用的，如当地的考频考情分析等，选填）"}
                            placeholder="（说明：本部分只出现在教材中，给学生用的，如当地的考频考情分析等，选填）"
                            ref="general_exam"
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
                                onClick={() => this.handlePreviewPlan('general_exam', 'general_explain', 'exam')}
                            >预览
                            </button>
                        </div>
                        <HtmlWithTex html={html.general_explain.exam || ''} className="preview"/>
                    </div>
                </div>
                <h3>讲解指南 <span className="text-danger plan-tips">本模块只在教案中显示</span></h3>
                <div className="form-group">
                    <label className="col-sm-2 control-label"></label>
                    <div className="col-sm-10">
                        <TagEditor
                            onChange={this.props.onChange}
                            value={node.general_explain.guide || "（说明：本部分只出现在教案中，指导教师备课用，选填）"}
                            placeholder="（说明：本部分只出现在教案中，指导教师备课用，选填）"
                            ref="general_guide"
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
                                onClick={() => this.handlePreviewPlan('general_guide', 'general_explain', 'guide')}
                            >预览
                            </button>
                        </div>
                        <HtmlWithTex html={html.general_explain.guide || ''} className="preview"/>
                    </div>
                </div>
                <h3>知识点 <span className="text-danger plan-tips">本模块只在教材中显示</span></h3>
                <div className="form-group">
                    <label className="col-sm-2 control-label"></label>
                    <div className="col-sm-10">
                        <TagEditor
                            onChange={this.props.onChange}
                            value={node.general_explain.knowledge || "（说明：本部分出现在教案和教材中，选填）"}
                            placeholder="（说明：本部分出现在教案和教材中，选填）"
                            ref="general_knowledge"
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
                                onClick={() => this.handlePreviewPlan('general_knowledge', 'general_explain', 'knowledge')}
                            >预览
                            </button>
                        </div>
                        <HtmlWithTex html={html.general_explain.knowledge || ''} className="preview"/>
                    </div>
                </div>
                <h3>题目
                    <span className="text-danger plan-tips">本模块在教案和教材中显示</span>
                    <a onClick={() => {
                        this.showCreateModal('general_explain')
                    }} target='_blank' className='input-parse'>单题录入</a>
                </h3>
                <PlanWrap key='general_explain' syncStateNode={this.syncStateNode}
                          plans={node.general_explain.question_list}
                          name="general_explain" subject={this.props.subject}
                          showCreateModal={this.props.showCreateModal}/>

                <h3>讲解小结 <span className="text-danger plan-tips">本模块只在教案中显示</span></h3>
                <div className="form-group">
                    <label className="col-sm-2 control-label"> </label>
                    <div className="col-sm-10">
                        <TagEditor
                            onChange={this.props.onChange}
                            value={node.general_explain.summary}
                            ref="general_summary"
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
                                onClick={() => this.handlePreviewPlan('general_summary', 'general_explain', 'summary')}
                            >预览
                            </button>
                        </div>
                        <HtmlWithTex html={html.general_explain.summary || ''} className="preview"/>
                    </div>
                </div>
                <h3>深度拓展 <span className="text-danger plan-tips">本模块只在教案中显示</span></h3>
                <div className="form-group">
                    <label className="col-sm-2 control-label">拓展讲解</label>
                    <div className="col-sm-10">
                        <TagEditor
                            onChange={this.props.onChange}
                            value={node.deep_explain.expand}
                            ref="deep_expand"
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
                                onClick={() => this.handlePreviewPlan('deep_expand', 'deep_explain', 'expand')}
                            >预览
                            </button>
                        </div>
                        <HtmlWithTex html={html.deep_explain.expand || ''} className="preview"/>
                    </div>
                </div>
                <div className="form-group sub-title">
                    <label className="col-sm-2 control-label">题目</label>
                    <div className="col-sm-10"><a onClick={() => {
                        this.showCreateModal('deep_explain')
                    }} target='_blank' className='input-parse'>单题录入</a>
                    </div>
                </div>
                <PlanWrap key='deep_explain' syncStateNode={this.syncStateNode} onChange={this.props.onChange}
                          plans={node.deep_explain.question_list} name="deep_explain"
                          subject={this.props.subject}/>
                <div className="form-group">
                    <label className="col-sm-2 control-label">拓展小结</label>
                    <div className="col-sm-10">
                        <TagEditor
                            onChange={this.props.onChange}
                            value={node.deep_explain.summary}
                            ref="deep_summary"
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
                                onClick={() => this.handlePreviewPlan('deep_summary', 'deep_explain', 'summary')}
                            >预览
                            </button>
                        </div>
                        <HtmlWithTex html={html.deep_explain.summary || ''} className="preview"/>
                    </div>
                </div>

            </fieldset>
        )
    }

    renderLesson() {
        return (
            <div>
                <div className="form-group">
                    <label className="col-sm-2 control-label">考察方向</label>
                    <div className="col-sm-10">
                        <label className="checkbox-inline">
                            <input
                                type="checkbox"
                                value="1"
                                checked={this.state.node.assess_dirs.indexOf(1) !== -1}
                                onChange={this.handleAssessInput}
                            />概念</label>
                        <label className="checkbox-inline">
                            <input
                                type="checkbox"
                                value="2"
                                checked={this.state.node.assess_dirs.indexOf(2) !== -1}
                                onChange={this.handleAssessInput}
                            />结论
                        </label>
                        <label className="checkbox-inline">
                            <input
                                type="checkbox"
                                value="3"
                                checked={this.state.node.assess_dirs.indexOf(3) !== -1}
                                onChange={this.handleAssessInput}
                            />应用
                        </label>
                        <label className="checkbox-inline">
                            <input
                                type="checkbox"
                                value="4"
                                checked={this.state.node.assess_dirs.indexOf(4) !== -1}
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
                                value={this.state.node.wiki}
                                onChange={this.handleInput.bind(null, 'wiki')}
                            />
                            <span className="input-group-btn">
                                    <button
                                        disabled={!this.state.node.wiki}
                                        className={"btn btn-default"}
                                        onClick={this.onJumpWiki}
                                        type="button"
                                    >Go!</button>
                                </span>
                        </div>
                    </div>
                </div>
                {this._renderTeachingObjective()}
                {this._renderDesc()}
                {this._renderTip()}
            </div>
        )
    }

    closePortalCallback = () => {
        this.state.previewPlan = false;
    }

    render() {
        if (!this.state.node) {
            return null;
        }
        const node = this.state.node;
        let {editAble} = this.props;

        return (
            <div>
                {
                    planIds.indexOf(this.props.activeType) != -1 && this.state.previewPlan ?
                        <Portal previewPlan={this.state.previewPlan} closePortalCallback={this.closePortalCallback}>
                            <Preview isPlan={true} plan={this.state.node} html={this.state.html}/> </Portal> : ''
                }
                <div className="form-horizontal tag-modify-form">
                    <div className="form-group">
                        <label className="col-sm-2 control-label">操作</label>
                        <div className="col-sm-10">
                            <button
                                className="btn btn-primary"
                                disabled={editAble || this.state.busy || this.state.node._tmp}
                                onClick={this.handleSubmit}
                            >保存修改
                            </button>
                            <button
                                onClick={this.createSubNode}
                                disabled={editAble || this.state.busy || !this.state.node._id}
                                className={"btn btn-success"}
                            >添加子节点
                            </button>

                            {
                                planIds.indexOf(this.props.activeType) != -1 ? <button
                                    onClick={this.previewPlan}
                                    disabled = {editAble}
                                    className={"btn btn-primary"}
                                >预览教案</button> : ''
                            }
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">ID</label>
                        <div className="col-sm-10">
                            <p className="form-control-static">{this.state.node._id}</p>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">路径</label>
                        <div className="col-sm-10">
                            <p className="form-control-static">{this.state.node.path}</p>
                        </div>
                    </div>
                    {
                        planIds.indexOf(this.props.activeType) == -1 ? <div className="form-group">
                            <label className="col-sm-2 control-label">统计</label>
                            <div className="col-sm-10">
                                <p className="form-control-static">
                                    {`考频: ${node.stats.freq}; 平均难度: ${node.stats.avg_diff}`}
                                </p>
                            </div>
                        </div> : ""
                    }

                    <div className="form-group">
                        <label className="col-sm-2 control-label">名称</label>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                className="form-control"
                                value={this.state.node.name}
                                onChange={this.handleInput.bind(null, 'name')}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">权重</label>
                        <div className="col-sm-10">
                            <input
                                type="number"
                                className="form-control"
                                value={this.state.node.weight}
                                onChange={this.handleInput.bind(null, 'weight')}
                            />
                        </div>
                    </div>
                    {
                        planIds.indexOf(this.props.activeType) != -1 ? this.renderLessonSlice() : this.renderLesson()
                    }

                </div>
            </div>
        );
    }
}

//新加模块的部分
class TagEditor extends React.Component {
    static createEditor(element) {
        return KindEditor.create(element, {
            resizeType: 1,
            width: "100%",
            allowPreviewEmoticons: false,

            uploadJson: '/api/upload',
            allowImageRemote: false,
            filePostName: 'file',
            items: [
                'fontname', 'fontsize', '|', 'clearhtml', 'wordpaste', 'forecolor', 'hilitecolor', 'bold',
                'italic', 'underline', 'removeformat', '|', 'justifyleft', 'justifycenter',
                'justifyright', 'insertorderedlist', 'insertunorderedlist', '|', 'table',
                'image', 'link'],

            newlineTag: 'br',
            minChangeSize: '1',
            autoHeightMode: true,
        });
    }

    constructor(props) {
        super(props);
        this._editor = null;
    }

    componentDidMount() {
        this._editor = TagEditor.createEditor(this.ref);
        this.ref.parentNode.querySelector('iframe').contentWindow.addEventListener('keyup', () => {
            this.props.onChange && this.props.onChange()
        })

    }

    componentWillReceiveProps(nextProps) {
        this._editor.html(nextProps.value);
    }

    shouldComponentUpdate() {
        // 防止编辑器被重置，我们自己维护编辑器状态
        // 虽然react记住的vdom和新渲染的一样不会触发重绘
        return false;
    }

    value() {
        return this._editor.html();
    }

    render() {
        return (
            <textarea
                defaultValue={this.props.value} placeholder={this.props.placeholder}
                ref={(ref) => {
                    this.ref = ref;
                }}
            />
        );
    }
}

export function setCurrentNav(current) {
    const navItems = [
        new NavItem('编辑', '/ktags'),
        //new NavItem('题目统计', '/ktags/item_count'),
    ];
    setNavBar(navItems, current);
}
