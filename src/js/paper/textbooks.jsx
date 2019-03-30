import React from 'react';
import Tree from 'react-ui-tree';
import { KtagModal } from 'js/widgets/ktag_modal';
import { KtItems } from 'js/widgets/kt_items';
import { Q, EduDesc } from 'js/quantum';
import cloneDeep from 'lodash/cloneDeep';
import { Modal, ModalBody } from 'js/widgets/modal';


class NoDragTree extends Tree {
    constructor(props) {
        super(props);
        this.dragStart = null;
    }
}

export class TextBookPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            grade: 4,
            textbookVer: null,
            filters: null,
            tagIds: null,
            activeNode: null,
        };
        this.setBind();
    }

    componentDidMount() {
        this.getTextBookDatas();
    }

    onTextBookVerChange(gradeVal, textbookVerVal) {
        this.setState({ grade: gradeVal, textbookVer: textbookVerVal, activeNode: null });
    }

    onNodeSelected(node) {
        this.setState({ activeNode: node });
    }

    onSubmit(newNode) {
        this.textBookTree.onSubmit(newNode);
    }

    onChange() {
        this.textBookTree.onChange();
    }

    setBind() {
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onNodeSelected = this.onNodeSelected.bind(this);
        this.onTextBookVerChange = this.onTextBookVerChange.bind(this);
        this.openAddTextBookVerModal = this.openAddTextBookVerModal.bind(this);
    }

    getTextBookDatas() {
        Q.get('/api/textbooks/filters')
            .done(({ results }) => {
                this.state.filters = {};
                results.forEach((filter) => { this.state.filters[filter.name] = filter.values; });
                this.state.grade = this.state.filters.grade[0];
                // 若没有已设置的教材版本，则使用第一个教材版本
                if (!this.state.textbookVer) {
                    this.state.textbookVer = this.state.filters.textbook_ver[0];
                }
                this.forceUpdate();
            });
    }

    openAddTextBookVerModal() {
        Modal.show(
            <NewTitleModal
                handleSubmit={this.handleNewTextBookVer.bind(this)}
                title="教材版本"
            />
        );
    }

    // 添加教材版本 如：人教版、苏教版
    handleNewTextBookVer(newVerTitle) {
        const newBookVer = {
            title: newVerTitle,
            grade: this.state.grade,
            textbook_ver: newVerTitle,
        };
        Q.put(`/api/textbooks/node`, { json: newBookVer })
            .done((result) => {
                // 设置教材版本为新添加的教材版本
                this.setState({ textbookVer: result.textbook_ver }, () => {
                    this.getTextBookDatas();
                });
            })
            .fail((jqXHR, statusText) => {
                Q.defaultAjaxFail(jqXHR, statusText);
            });
    }

    render() {
        if (!this.state.filters) {
            return null;
        }
        return (
            <div id="textbooks-page">
                <ProgressSelect
                    {...this.state}
                    selectChange={this.onTextBookVerChange}
                    handleAddTextBookVer={this.openAddTextBookVerModal}
                />
                <TextBookTree
                    ref={(ref) => { this.textBookTree = ref; }}
                    grade={this.state.grade}
                    textbookVer={this.state.textbookVer}
                    node={this.state.activeNode}
                    onNodeSelected={this.onNodeSelected}
                />
                <div className="textbook-node-controller">
                    <TagUpdater
                        grade={this.state.grade}
                        textbookVer={this.state.textbookVer}
                        node={this.state.activeNode}
                        onSubmit={this.onSubmit}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        );
    }
}


export default class TextBookTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodeMap: null,
            tree: null,
            showTree: null,
            activeNodeId: null,
            changed: false,
        };
        this.setBind();
    }

    componentDidMount() {
        this.mark = this.props.grade + this.props.textbookVer;
        this.getDataByGradeAndVer(this.props.grade, this.props.textbookVer);
    }

    componentWillReceiveProps(nextProps) {
        if (this.mark !== nextProps.grade + nextProps.textbookVer) {
            this.mark = nextProps.grade + nextProps.textbookVer;
            this.getDataByGradeAndVer(nextProps.grade, nextProps.textbookVer);
        }
        this.setState({ activeNodeId: nextProps.node ? nextProps.node._id : null });
    }

    onNodeShowChange(showTree) {
        this.setState({ showTree });
        if (this.props.onNodeSelected) {
            this.props.onNodeSelected(showTree);
        }
    }

    onClickNode(node) {
        if (!this.couldChange()) {
            return;
        }
        Q.assert(node);
        node.collapsed = false;   // eslint-disable-line no-param-reassign
        if (this.props.onNodeSelected) {
            this.props.onNodeSelected(node);
        }
        this.setState({
            activeNodeId: node._id,
            changed: false,
        });
    }

    onChange() {
        this.setState({
            changed: true,
        });
    }

    onSubmit(newNode) {
        const nodeMap = this.state.nodeMap;
        const oldNode = nodeMap.get(newNode._id);

        let node = null;
        // 删除、更新的知识节点
        if (oldNode) {
            node = oldNode;
            node.tags = newNode.tags;
            node.tag_ids = newNode.tag_ids;
            node.title = newNode.title;
            node.collapsed = newNode.collapsed;
            node.deleted = newNode.deleted;

            // 重新设置newNode的children
            if (newNode.children && newNode.children.length && !newNode.children[0]._id) {
                node.children = newNode.children.map(child => nodeMap.get(child));
            }
            nodeMap.delete(node._id);
        // 新建的知识节点
        } else {
            node = Object.assign({
                children: [],
                collapsed: true,
                tags: [],
                tag_ids: [],
            }, newNode);
            node.parent = nodeMap.get(newNode.parent);
        }

        if (!node.deleted) {
            nodeMap.set(node._id, node);
        }

        const tree = this.state.tree;
        let activeNodeId = this.state.activeNodeId;
        let showTree = this.state.showTree;
        // 子节点的操作。
        if (node.parent) {
            const index = node.parent.children.map(c => c._id).indexOf(node._id);
            // 更新的节点，替换掉原来的。
            if (index !== -1 && !node.deleted) {
                node.parent.children[index] = node;
            // 新添加的节点，插入。
            } else if (!node.deleted) {
                node.parent.children.push(node);
                node.parent.collapsed = false;
                activeNodeId = node._id;
            // 删除的节点，移除。
            } else {
                node.parent.children.splice(index, 1);
                const siblingSize = node.parent.children.length;
                if (siblingSize > index) {      // 删除的node为中间的
                    activeNodeId = node.parent.children[index]._id;
                } else if (siblingSize > 0) {   // 删除的node为最后一个, 且删除后还有sibling
                    activeNodeId = node.parent.children[index - 1]._id;
                } else {    // 删除唯一的node，且删除后sibling空
                    activeNodeId = node.parent._id;
                }
            }
        // 教材节点的操作
        } else {
            const index = tree.map(t => t._id).indexOf(node._id);
            // 删除节点，移除
            if (index !== -1 && node.deleted) {
                tree.splice(index, 1);
                if (tree.length > index) {
                    showTree = tree[index];
                } else if (tree.length > 0) {
                    showTree = tree[index - 1];
                }
                activeNodeId = showTree._id;
            // 更新的节点，替换掉原来的。
            } else if (index !== -1) {
                tree[index] = node;
            // 插入新节点
            } else {
                tree.push(node);
                activeNodeId = node._id;
                showTree = node;
            }
        }

        this.setState({
            nodeMap,
            tree,
            showTree,
            activeNodeId,
            changed: false,
        }, () => {
            if (this.props.onNodeSelected) {
                this.props.onNodeSelected(this.state.nodeMap.get(activeNodeId));
            }
        });
    }

    setBind() {
        this.onClickNode = this.onClickNode.bind(this);
        this.renderNode = this.renderNode.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.couldChange = this.couldChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.openAddTextBookModal = this.openAddTextBookModal.bind(this);
    }

    getDataByGradeAndVer(gradeVal, textbookVerVal) {
        if (gradeVal !== undefined && textbookVerVal !== undefined) {
            const setting = {
                query: {
                    grade: gradeVal,
                    textbook_ver: textbookVerVal,
                },
            };
            Q.get("/api/textbooks", setting).done((res) => {
                this.buildTextBookNodes(res.results);
            });
        }
    }

    openAddTextBookModal() {
        Modal.show(
            <NewTitleModal
                handleSubmit={this.handleNewTextBook.bind(this)}
                title="教材"
            />);
    }

    // 添加教材 如：七年级、八年级
    handleNewTextBook(firstLevelName) {
        const newNode = {
            title: firstLevelName,
            grade: this.props.grade,
            textbook_ver: this.props.textbookVer,
        };
        Q.put(`/api/textbooks/node`, { json: newNode })
            .done((result) => {
                // 新增教材节点后，选中教材节点。
                this.setState({ activeNodeId: result._id }, () => {
                    this.getDataByGradeAndVer(this.props.grade, this.props.textbookVer);
                });
            })
            .fail((jqXHR, statusText) => {
                Q.defaultAjaxFail(jqXHR, statusText);
            });
    }

    couldChange() {
        if (this.state.changed) {
            return confirm('是否放弃已修改的内容?可点击取消后保存');
        }
        return true;
    }

    buildTextBookNodes(result) {
        const data = result;
        const nodeMap = new Map();

        const tree = [];
        for (let i = 0; i < data.length; i++) {
            if (!data[i].deleted) {
                data[i].collapsed = true;
                nodeMap.set(data[i]._id, data[i]);
                if (!data[i].parent) {
                    data[i].collapsed = false;
                    tree.push(data[i]);
                }
            }
        }

        for (let i = 0; i < data.length; i++) {
            let children = data[i].children;
            if (!children) {
                children = [];
            } else if (children.length) {
                for (let j = 0; j < children.length; j++) {
                    if (!data[i].deleted) {
                        nodeMap.get(children[j]).parent = data[i];
                    }
                    children[j] = nodeMap.get(children[j]);
                }
            }
        }

        let showTree = {};
        if (tree.length) {
            showTree = tree[0];
        }
        // 若有已选中的教材节点，显示为选中的教材节点。
        if (this.state.activeNodeId) {
            const index = tree.map(t => t._id).indexOf(this.state.activeNodeId);
            if (index !== -1) {
                showTree = tree[index];
            }
        }
        const activeNodeId = showTree._id;

        this.setState({
            tree,
            nodeMap,
            showTree,
            activeNodeId,
        }, () => {
            if (this.props.onNodeSelected) {
                this.props.onNodeSelected(this.state.showTree);
            }
        });
    }

    updateParentState(data) {
        const node = data;
        if (node.parent) {
            node.parent.state = this.getStateByChildren(node.parent);
            this.updateParentState(node.parent);
        }
    }

    renderNode(node) {
        const parent = node.parent;
        if (parent) {
            Q.assert(parent);
            if (parent.collapsed) {
                return null;
            }
        }

        return (
            <span
                className={node._id === this.state.activeNodeId ? "node is-active" : "node"}
                onClick={this.onClickNode.bind(null, node)}
                key={node._id}
            >{ node.title }</span>
        );
    }

    render() {
        if (!this.state.tree) {
            return null;
        }
        return (
            <div className="textbook-content">
                <div className="textbook-header">
                    {this.state.tree.map(node =>
                        <label
                            key={node._id}
                            className={this.state.showTree === node ? "title active" : "title"}
                            onClick={this.onNodeShowChange.bind(this, node)}
                        >
                            {node.title}
                        </label>
                    )}
                    <button
                        className="btn btn-success btn-xs"
                        onClick={this.openAddTextBookModal}
                    >添加教材</button>
                </div>
                <div className="tag-view">
                    <NoDragTree
                        paddingLeft={20}
                        tree={this.state.showTree}
                        renderNode={this.renderNode}
                    />
                </div>
            </div>
        );
    }
}


export class ProgressSelect extends React.Component {
    constructor(props) {
        super(props);
        this.setBind();
    }

    setBind() {
        this.handleAddTextBookVer = this.handleAddTextBookVer.bind(this);
    }

    selectGradeChange(ele) {
        const value = ele.target.value;
        this.props.selectChange(parseInt(value, 10), this.props.textbookVer);
    }

    selectTextbookVerChange(ele) {
        const value = ele.target.value;
        this.props.selectChange(this.props.grade, value);
    }

    handleAddTextBookVer() {
        this.props.handleAddTextBookVer();
    }

    renderTextBookVerRow(ver) {
        return (
            <option value={ver} key={ver}>{ ver }</option>
        );
    }

    render() {
        return (
            <div className="textbook-progress">
                <select
                    onChange={this.selectGradeChange.bind(this)}
                    value={this.props.grade}
                >
                    {this.props.filters.grade.map(edu =>
                        <option key={edu} value={edu}>{EduDesc.get(edu).name}</option>
                    )}
                </select>
                <select
                    onChange={this.selectTextbookVerChange.bind(this)}
                    value={this.props.textbookVer}
                >
                    {this.props.filters.textbook_ver.map(this.renderTextBookVerRow.bind(this))}
                </select>
                <button
                    className="btn btn-success btn-xs"
                    onClick={this.handleAddTextBookVer}
                >添加教材版本</button>
            </div>
        );
    }
}


class TagUpdater extends React.Component {
    constructor(props) {
        super(props);
        const nodeClone = cloneDeep(props.node);
        this.state = {
            node: nodeClone,
            disableMove: false,
        };
        this.setBind();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.node === undefined) {
            return;
        }

        const nodeClone = cloneDeep(nextProps.node);
        this.setState({
            node: nodeClone,
        });
    }

    setBind() {
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.openModifyKTagModal = this.openModifyKTagModal.bind(this);
        this.handleRemoveKtag = this.handleRemoveKtag.bind(this);
        this.handleMoveUp = this.handleMoveUp.bind(this);
        this.handleMoveDown = this.handleMoveDown.bind(this);
        this.createSubNode = this.createSubNode.bind(this);
    }

    openModifyKTagModal() {
        const modal = KtagModal.show(this.props.grade, this.state.node.tag_ids, (ktags) => {
            this.state.node.tag_ids = ktags.map(ktag => ktag._id);
            this.state.node.tags = ktags;
            this.setState({});
            this.props.onChange();
            modal.close();
        });
    }

    handleInput(name, event) {
        const node = this.state.node;
        if (node[name] !== event.target.value) {
            this.props.onChange();
        }
        node[name] = event.target.value;
        this.setState({
            node,
        });
    }

    handleMoveUp() {
        this.handleMoveUpOrDown(true);
    }

    handleMoveDown() {
        this.handleMoveUpOrDown(false);
    }

    handleMoveUpOrDown(willMoveUp) {
        const node = this.state.node;
        const parent = this.state.node.parent;
        const childrenVal = parent.children;
        const index = childrenVal.map(nodeVal => nodeVal._id).indexOf(node._id);
        const temp = childrenVal[index];
        if (willMoveUp) {
            childrenVal[index] = childrenVal[index - 1];
            childrenVal[index - 1] = temp;
        } else {
            childrenVal[index] = childrenVal[index + 1];
            childrenVal[index + 1] = temp;
        }

        const patch = {
            children: childrenVal.map(c => c._id),
        };
        this.setState({ disableMove: true });
        Q.post(`/api/textbooks/nodes/${parent._id}`, { json: patch })
            .done((nodeVal) => {
                const newNode = nodeVal;
                // 重新设置parent的children值
                newNode.parent = parent.parent;
                this.props.onSubmit(newNode);
            }).always(() => {
                this.setState({ disableMove: false });
            });
    }

    handleRemoveKtag(ktagId) {
        const tagIdIndex = this.state.node.tag_ids.indexOf(ktagId);
        // remove tag_ids
        if (tagIdIndex !== -1) {
            this.state.node.tag_ids.splice(tagIdIndex, 1);
        }
        const tagsIndex = this.state.node.tags.map(tag => tag._id).indexOf(ktagId);
        // remove tags
        if (tagsIndex !== -1) {
            this.state.node.tags.splice(tagsIndex, 1);
        }
        this.props.onChange();
        this.setState({});
    }

    handleDelete() {
        if (confirm('确定要删除该节点？')) {
            const node = this.state.node;
            Q.delete_(`/api/textbooks/nodes/${node._id}`)
                .done(() => {
                    node.deleted = true;
                    this.props.onSubmit(node);
                })
                .fail((jqXHR, statusText) => {
                    Q.defaultAjaxFail(jqXHR, statusText);
                });
        }
    }

    handleSubmit() {
        const node = this.state.node;
        let request = null;

        const title = node.title.trim();
        if (!title) {
            Q.alert('名称不能为空', 'danger');
            return;
        }

        node.title = title;

        if (node._id === null) {
            const newNode = {
                title: node.title,
                grade: this.props.grade,
                textbook_ver: this.props.textbook_ver,
                parent: node.parent,
                tag_ids: node.tag_ids,
            };
            request = Q.put(`/api/textbooks/node`, { json: newNode });
        } else {
            const patch = {
                title: node.title,
                grade: this.props.grade,
                textbook_ver: this.props.textbook_ver,
                tag_ids: node.tag_ids,
            };
            request = Q.post(`/api/textbooks/nodes/${node._id}`, { json: patch });
        }
        request.done((newNode) => {
            const nodeVal = newNode;
            nodeVal.tags = node.tags;
            nodeVal.parent = node.parent;
            nodeVal.children = node.children;
            this.props.onSubmit(nodeVal);
        });
    }

    createSubNode() {
        const parent = this.state.node;
        Q.assert(parent._id);

        const subTitle = parent.title.concat('的子节点');
        const node = {
            _id: null,
            title: subTitle,
            parent: parent._id,
            children: [],
            tag_ids: [],
            tags: [],
        };

        this.props.onChange();
        this.setState({
            node,
        });
    }

    couldMoveUp() {
        return this.couldMoveUpOrMoveDown(true);
    }

    couldMoveDown() {
        return this.couldMoveUpOrMoveDown(false);
    }

    couldMoveUpOrMoveDown(moveUp = true) {
        if (this.state.disableMove) {
            return false;
        }
        const parent = this.state.node.parent;
        if (!parent || !parent._id) {
            return false;
        }
        const index = parent.children.map(node => node._id).indexOf(this.state.node._id);
        if (moveUp) {
            return index > 0;
        }
        return index < parent.children.length - 1;
    }


    couldAddTags() {
        if (!this.state.node.parent) {
            return false;
        }
        return !this.state.node.children.some(node => !node.deleted);
    }

    _renderTags() {
        if (this.couldAddTags()) {
            return (
                <div className="form-group">
                    <label className="col-sm-2 control-label">知识点</label>
                    <div className="col-sm-10">
                        <div>
                            <KtItems
                                ktags={this.state.node.tags}
                                tagAttr="_id"
                                type="textbooks"
                                removeKtagEvent={this.handleRemoveKtag}
                            />
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={this.openModifyKTagModal}
                        >添加知识点</button>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

    render() {
        if (!this.props.node) {
            return (<span>
                请选择知识点
            </span>);
        }

        return (
            <div>
                <div className="form-horizontal tag-modify-form">
                    <div className="form-group">
                        <label className="col-sm-2 control-label">操作</label>
                        <div className="col-sm-10">
                            <button
                                className="btn btn-primary"
                                onClick={this.handleSubmit}
                            >保存修改</button>
                            <button
                                onClick={this.createSubNode}
                                className={this.state.node._id === null ?
                                  'invisible' : "btn btn-success"}
                            >添加子节点</button>
                            <button
                                onClick={this.handleDelete}
                                className={this.state.node._id === null ?
                                  'invisible' : "btn btn-danger"}
                            >删除当前节点</button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">移动</label>
                        <div className="col-sm-10">
                            <button
                                onClick={this.handleMoveUp}
                                className={!this.state.node._id ? 'hidden' : "btn btn-primary"}
                                disabled={!this.couldMoveUp()}
                            >上移</button>
                            <button
                                onClick={this.handleMoveDown}
                                className={!this.state.node._id ? 'hidden' : "btn btn-success"}
                                disabled={!this.couldMoveDown()}
                            >下移</button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">ID</label>
                        <div className="col-sm-10">
                            <p className="form-control-static">{this.state.node._id}</p>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">名称</label>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                className="form-control"
                                value={this.state.node.title}
                                onChange={this.handleInput.bind(null, 'title')}
                            />
                        </div>
                    </div>
                    { this._renderTags() }
                </div>
            </div>
        );
    }
}

class NewTitleModal extends React.Component {
    constructor(props) {
        super(props);
        this.bookVerTitle = '';
    }

    handleBookVerTitleChange(evt) {
        this.bookVerTitle = evt.target.value;
    }

    handleSubmit(evt) {
        evt.preventDefault();
        if (this.props.handleSubmit) {
            this.props.handleSubmit(this.bookVerTitle);
            this.newVerModal.close();
        }
    }

    render() {
        return (
            <Modal ref={(ref) => { this.newVerModal = ref; }}>
                <ModalBody>
                    <div className="new-title-modal-comp">
                        <form
                            onSubmit={this.handleSubmit.bind(this)}
                            className="form form-horizontal"
                        >
                            <div className="form-section">
                                <div className="form-group">
                                    <label className="control-label">{`新的${this.props.title}名称`}</label>
                                    <input
                                        required
                                        placeholder={`请输入${this.props.title}名称`}
                                        name="new_book_ver"
                                        type="text"
                                        className="form-control"
                                        onChange={this.handleBookVerTitleChange.bind(this)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary submit-button"
                                    onClick={this.handleSubmit.bind(this)}
                                >确定</button>
                            </div>
                        </form>
                    </div>
                </ModalBody>
            </Modal>
        );
    }
}
