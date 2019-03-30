import React from 'react';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import $ from 'jquery';
import {Edu, Q, planIds} from 'js/quantum';
import "css/main.scss";
import MathJax from 'mathjax';
class TagContent extends React.Component {
    constructor(props) {
        super(props);
        this.clicks = 0;
        this.isShowTip = props.showTip;
        this.isOver = false;
    }

    onMouseOver(e) {
        if (this.isShowTip) {
            this.isOver = true;
            const tag = this.props.tag;
            const offset = $(e.target).offset();
            setTimeout(() => {
                if (this.isOver) {
                    if (tag.tagging_tip === undefined || tag.tagging_tip == null) {
                        Q.get(`/api/ktag/${tag._id}`)
                            .done((res) => {
                                if (res != null) {
                                    tag.tagging_tip = res.tagging_tip || '';
                                    this.showTip(tag.tagging_tip, offset);
                                }
                            });
                    } else {
                        this.showTip(tag.tagging_tip, offset);
                    }
                }
            }, 500);
        }
    }

    onMouseOut() {
        if (this.isShowTip) {
            this.isOver = false;
            $("#ktag-tip").hide();
        }
    }

    showTip(tip, offset) {
        if (this.isOver && tip) {
            const $tip = $("#ktag-tip");
            $tip.html(Q.htmlEscape(tip).replace(/\n/g, '<br />'));
            const tipWidth = tip.length < 30 ? tip.length * 14 : 400;
            const width = document.documentElement.clientWidth - offset.left;
            const style = {top: offset.top + 20, left: 'auto', right: 'auto'};
            if (width < tipWidth) {
                style.right = width - this.tagDiv.clientWidth;
            } else {
                style.left = offset.left;
            }
            $tip.css(style);
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, "#ktag-tip"]);
            $tip.show();
        }
    }

    toggleChildren = (e) => {
        this.clicks++;
        if (this.clicks === 1) {
            setTimeout(() => {
                if (this.clicks === 1) {
                    this.props.toggleChildren(this.props.tag);
                } else {
                    this.selectKtag();
                }
                this.clicks = 0;
            }, 300);
        }

    }

    selectKtag = (ev)=> {
//		ev.nativeEvent.stopImmediatePropagation();
        if (planIds.indexOf(this.props.tag.type) != -1) {
            // 教案切片
            Q.post(`/api/plan_tag/item/${this.props.id}/v1`, {
                json: {
                    id: this.props.tag._id,
                    state: 1
                }

            }).done( result => {
                this.props.selectPlan({location: 1, ...this.props.tag});
            })
            
        }else {
            this.props.selectKtag(this.props.tag);
        }
        
        
        if (this.isShowTip) {
            this.onMouseOut();
        }
    	
        
    }

    /*addDeepExpand = (e) => {
        e.stopPropagation()
        Q.post(`/api/plan_tag/item/${this.props.id}`, {
            json: {
                id: this.props.tag._id,
                location: 1,
                state: 1
            }
        }).done(result => {
            if (result.statedcode == 0) {
                return showAlert(result.msg, "danger")
            }
            this.props.selectPlan({location: 1, ...this.props.tag});
        })
    }
    addGeneralExplain = (e) => {
        e.stopPropagation()
        Q.post(`/api/plan_tag/item/${this.props.id}`, {
            json: {
                id: this.props.tag._id,
                location: 0,
                state: 1
            }
        }).done(result => {
            if (result.statedcode == 0) {
                return showAlert(result.msg, "danger")
            }
            this.props.selectPlan({location: 0, ...this.props.tag});
        })
    }*/

    render() {
        const tag = this.props.tag;
        const pos = this.props.pos;
        let hasChildren ;
        try {
            hasChildren = tag.children.length > 0;
        }catch (e) {
            console.log(tag)
        }

        const style = {
            top: `${pos.top}px`,
            left: `${pos.left}px`,
        };
        let html = <a><span onClick={this.toggleChildren}>{tag.name}</span></a>;
        /*if (planIds.indexOf(tag.type) != -1 && !hasChildren) {
            html = <a><span onClick={this.selectKtag.bind(this)} onMouseOver={this.onMouseOver.bind(this)}
                            onMouseOut={this.onMouseOut.bind(this)}>{tag.name}</span><span className='plan-btn'
                                                                                           onClick={this.addGeneralExplain}>【常】</span><span
                onClick={this.addDeepExpand} className='plan-btn'>【深】</span></a>
        }*/
        return (
            <div
                className={`kt-content-wrapper ${hasChildren ? 'has-child' : ''}`}
                data-id={tag._id} style={style}


                ref={(ref) => {
                    this.tagDiv = ref;
                }}
            >
                {html}
            </div>
        );
    }
}

class HorizontalLine extends React.Component {
    constructor(props) {
        super(props);
        this.event = [];
    }

    render() {
        const tag = this.props.tag;
        const pos = this.props.pos;
        const style = {
            top: `${pos.top}px`,
            left: `${pos.left}px`,
        };
        return <div className="h-line" data-h-id={tag._id} style={style}/>;
    }
}

class VerticalLine extends React.Component {
    constructor(props) {
        super(props);
        this.event = [];
    }

    render() {
        const tag = this.props.tag;
        const pos = this.props.pos;
        const style = {
            top: `${pos.top}px`,
            left: `${pos.left}px`,
            height: `${pos.height}px`,
        };
        let node = null;
        try {
             node = <div className="v-line" data-v-pid={tag._id || ""} style={style}/>;
        } catch (e) {
            console.log(tag)
        }
        return node
    }
}

class LevellLine extends React.Component {
    constructor(props) {
        super(props);
        this.event = [];
    }

    render() {
        const tag = this.props.tag;
        const pos = this.props.pos;
        const style = {
            top: `${pos.top}px`,
            left: `${pos.left}px`,
        };
        let node = null;
        try {
            node = <div className="level-line" data-level-pid={tag._id || ""} style={style}/>
        } catch (e) {
            console.log(tag)
        }
        return node;
    }
}

class KTagTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodesPosition: [],
        };
        this.nodePositionMap = {};
        this.config = {
            levelWidth: 170,
            hLineHeight: 5,
            hLineWidth: 25,
            vLineWidth: 1,
            unitWidth: 50,
            textHeight: 8,
            levelLineWidth: 175,
            levelLineHeight: 5,
            textMinWidth: 30,
        };
        this.setBind();
    }

    componentWillMount() {
        this.initPos();
    }
    
    componentDidMount() {
    	console.log(this.state.nodesPosition)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.root._id !== this.props.root._id
            || !isEqual(Array.from(Object.keys(nextProps.kTagsIdMap)),
                Array.from(Object.keys(this.props.kTagsIdMap)))) {
            this.initPos(nextProps);
        }
    }

    setBind() {
        this.selectKtag = this.selectKtag.bind(this);
    }

    initPos(props = this.props) {
        const root = props.root;
        let pivot = 0;
        if (root) {
            pivot = Math.round(root.children.length / 2);
        } else {
            this.setState({
                nodesPosition: null,
            });
            return;
        }
        let pos = {
            id: root._id || root.ability_id,
            hasChildren: root.children.length > 0,
            children: [],
            position: [pivot, pivot + 1],
            parent: null,
            level: 0,
            index: 0,
        };
        this.nodePositionMap[pos.id] = pos;
        pos = this.updatePos(props.root, [pos]);
        this.setState({
            nodesPosition: pos,
        });
    }

    updatePos(node, pos) {
        const newPos = pos;
        return this._adjustPos(node, newPos);
    }

    _adjustPos(node, positionObj) {
        function findNearestNode(curr, prev) {
            let elems = [positionObj[0]];
            let minGap = 999;
            let target;
            const flag = prev ? -1 : 1;
            while (elems.length > 0) {
                const elem_ = elems.pop();
                if (elem_ !== curr && elem_.level === curr.level && elem_.children.length) {
                    const gap_ = (elem_.position[0] - curr.position[0]) * flag;
                    if (gap_ > 0 && gap_ < minGap) {
                        minGap = gap_;
                        target = elem_;
                    }
                } else if (elem_.children.length > 0) {
                    elems = elems.concat(elem_.children);
                }
            }
            return target;
        }

        function downAdjust(currNode) {
            let nextNode = findNearestNode(currNode);
            let end;
            if (currNode.children.length) {
                end = currNode.children[currNode.children.length - 1].position[1];
            } else {
                return;
            }
            if (nextNode) {
                if (end > nextNode.children[0].position[0]) {
                    const gap_ = end - nextNode.children[0].position[0];
                    let node_ = currNode;
                    while (nextNode.parent) {
                        if (nextNode.parent === node_.parent) {
                            break;
                        }
                        nextNode = nextNode.parent;
                        node_ = node_.parent;
                    }
                    let nodes = node_.parent.children.slice(node_.index + 1);
                    node_.position = [node_.position[0], node_.position[1] + gap_];
                    while (nodes.length > 0) {
                        const cnode = nodes.pop();
                        cnode.position = cnode.position.map(pos => pos + gap_);
                        nodes = nodes.concat(cnode.children);
                    }
                    downAdjust(nextNode.parent);
                }
            }
        }

        function ensurePositiveStart(posNodes) {
            /* 校准位置不超出初始位置*/
            let nodes = posNodes.map(item => item);
            let minStart = 9999;
            while (nodes.length) {
                const node_ = nodes.pop();
                nodes = nodes.concat(node_.children);
                if (node_.position[0] < minStart) {
                    minStart = node_.position[0];
                }
            }
            if (minStart !== 0) {
                nodes = posNodes.map(item => item);
                while (nodes.length) {
                    const node_ = nodes.pop();
                    nodes = nodes.concat(node_.children);
                    node_.position = node_.position.map(pos => pos - minStart);
                }
            }
        }

        function checkNodes(posNodes) {
            let nodes = posNodes.map(item => item);
            while (nodes.length) {
                const node_ = nodes.pop();
                nodes = nodes.concat(node_.children);
                downAdjust(node_);
            }
            ensurePositiveStart(posNodes);
        }

        const cnode = this.nodePositionMap[node._id];
        if (cnode.children.length) {
            cnode.children = [];
            if (cnode.parent) {
                let gap_ = 1;
                if (cnode.index) {
                    const pre = cnode.parent.children[cnode.index - 1];
                    gap_ = pre.position[1] - pre.position[0];
                    if (gap_ > 1) {
                        pre.position[1] = pre.position[0] + 1;
                    }
                }
                const cgap_ = cnode.position[1] - cnode.position[0];
                if (gap_ > 1 || cgap_ > 1) {
                    cnode.position[0] = cnode.position[0] - gap_ + 1;
                    cnode.position[1] = cnode.position[0] + 1;
                    let nodes = cnode.parent.children.slice(cnode.index + 1);
                    while (nodes.length) {
                        const node_ = nodes.pop();
                        if (node_.children.length) {
                            nodes = nodes.concat(node_.children);
                        }
                        node_.position = node_.position.map(pos => pos - gap_ - cgap_ + 2);
                    }
                }
                checkNodes([positionObj[0]]);
            }
            return positionObj;
        }
        cnode.children = [];
        if (node.children.length) {
            const start = cnode.position[0];
            const childrenNodes = node.children;
            const newStart = start - ((childrenNodes.length - 1) / 2);
            childrenNodes.forEach((item, i) => {
                cnode.children.push({
                    id: item._id,
                    position: [newStart + i, newStart + i + 1],
                    parent: cnode,
                    level: cnode.level + 1,
                    index: i,
                    hasChildren: item.children ? item.children.length > 0 : false,
                    children: [],
                });
                this.nodePositionMap[item._id] = cnode.children[cnode.children.length - 1];
            });
            checkNodes([positionObj[0]]);
        }
        return positionObj;
    }

    toggleAllDescendant(tag, desiredState = undefined) {
        let pos = this.state.nodesPosition;
        const q = [this.nodePositionMap[tag._id]];
        while (q.length) {
            const cnode = q.shift();
            const ctag = this.props.kTagsIdMap[cnode.id];
            if (desiredState === true) {
                if (cnode.children.length === 0) {
                    pos = this.updatePos(ctag, pos);
                }
            } else if (desiredState === false) {
                if (cnode.children.length > 0) {
                    pos = this.updatePos(ctag, pos);
                }
            } else {
                // actually pos never got changed
                pos = this.updatePos(ctag, pos);
            }
            if (cnode.children.length) {
                q.push(...cnode.children);
            }
        }
        this.setState({nodesPosition: pos});
    }

    toggleChildren(tag, desiredState = undefined) {
        let theTag = tag;
        if (typeof tag === 'string') {
            theTag = this.props.kTagsIdMap[tag];
        }
        const cnode = this.nodePositionMap[theTag._id];
        let pos = this.state.nodesPosition;
        if (desiredState === true) {
            if (cnode.children.length === 0) {
                pos = this.updatePos(theTag, pos);
            }
        } else if (desiredState === false) {
            if (cnode.children.length > 0) {
                pos = this.updatePos(theTag, pos);
            }
        } else {
            // actually pos never got changed
            pos = this.updatePos(theTag, pos);
        }

        this.setState({nodesPosition: pos});
    }

    selectKtag(tag) {
        this.props.selectKtag(tag._id);
    }

    render() {
        if (!this.state.nodesPosition) {
            return null;
        }
        const conf = this.config;
        let nodes = [this.state.nodesPosition[0]];
        const components = [];
        while (nodes.length) {
            const node = nodes.pop();
            const tag = this.props.kTagsIdMap[node.id];
            if (node.children.length) {
                nodes = nodes.concat(node.children);
                let top = node.children[0].position[0] * conf.unitWidth;
                const height = ((node.children[node.children.length - 1].position[0]) * 50) - top;
                let left = ((node.level + 1) * conf.levelWidth) - conf.hLineWidth - conf.vLineWidth;
                /*if (planIds.indexOf(this.props.type) !=-1) {
                    left += 186;
                }*/

                const pos = {left, top, height};
                try {
                    components.push(<VerticalLine tag={tag} pos={pos} key={`vline-${node.id }`}/>);
                } catch (e) {
                    console.log(node)
                }

                top = node.position[0] * conf.unitWidth;
                left = node.level * conf.levelWidth;
                /*if (planIds.indexOf(this.props.type) !=-1) {
                    left += 186;
                }*/
                try {
                    components.push(
                        <LevellLine tag={tag} pos={{top, left}} key={`lline-${node.id }`}/>
                    );
                }catch (e) {
                    console.log(e)
                }

            }
            let top = (node.position[0] * conf.unitWidth) - conf.textHeight;
            let left = node.level * conf.levelWidth;
            /*if (planIds.indexOf(this.props.type) !=-1) {
                    left += 186;
                }*/

            components.push(
                <TagContent
                    id={this.props.id}
                    tag={tag} pos={{left, top}}
                    type={this.props.type}
                    selectPlan={this.props.selectPlan}
                    toggleChildren={this.toggleChildren.bind(this)} key={`tag-${node.id}`}
                    selectKtag={this.selectKtag}
                    showTip={this.props.showTip}
                />
            );
            left = (node.level * conf.levelWidth) - conf.hLineWidth;
            /*if (planIds.indexOf(this.props.type) !=-1) {
                    left += 186;
                }*/
            top = node.position[0] * conf.unitWidth;
            components.push(
                <HorizontalLine tag={tag} pos={{left, top}} key={`hline-${node.id}`}/>
            );
        }
        return (<div className="kt-tree">{components}</div>);
    }
}

function KTagNav({roots, currentTagType, onChange, switchKtag, showAll}) {
    return (
        <div>
            <ul className="kt-nav tab_bar nav nav-tabs">
                {
                    showAll?<li onClick={switchKtag} className={currentTagType === 'ability'? "active": ""}>
                        <a>能力</a>
                    </li>:null
                }

                {
                    roots.map(tag =>
                        <li
                            data-tid={tag.type} key={`nav-${tag.type}`}
                            onClick={tag.type !== currentTagType ?
                                onChange.bind(null, tag.type) : undefined}
                            className={tag.type === currentTagType ? "active" : ""}
                        ><a>{tag.name}</a>
                        </li>
                    )
                }
            </ul>
        </div>
    );
}

export default class KTagPanel extends React.Component {
    constructor(props) {
        super(props);
        this.roots = [];
        this.kTagsIdMap = {};
        this.searchDataSource = [];

        this.setBind();
        this.initData(this.props);
        this.state = {
            // 初始挂载时 ktags 可能为空
            currentTagType: this.roots.length ? this.roots[0].type : 0,
            showType: 'ktag'
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.tags.length !== this.props.tags.length || nextProps.edu !== this.props.edu) {
            this.initData(nextProps);
            this.setState({
                currentTagType: this.roots.length ? this.roots[0].type : 0,
            });
        }

    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.edu !== this.props.edu || !isEqual(nextState, this.state);
    }

    setBind() {
        this.changeTagType = this.changeTagType.bind(this);
    }

    changeTagType(tagType) {
        this.setState({
            currentTagType: tagType,
            showType: 'ktag'
        });
        return true;
    }

    initData(props) {
        this._initTags(props);
        this._initSearchDataSource();
    }

    filterDatas(results, props) {
        let { filterPlan, rootTypes, edu } = props;
        var processData = results.reduce((total, cur, curIndex, arr) => {
            if (cur.deleted) return total;
            if (rootTypes.indexOf(cur.type) == -1) return total;

            if (edu === Edu.kSenior && cur.weight > 0) return total;
            if (edu === Edu.kJunior && (cur.weight < 0 || cur.weight >= 100)) return total;
            if (edu === Edu.kElementary && cur.weight < 100 && cur.weight !== 0) return total;
            cur.children = [];
            cur.treeIndex = cur.treeIndex || parseInt(total.treeIndex * 100);
            total.treeIndex++;
            if (cur.parent_id === null) {
                /*cur.expanded = true;
                cur.active = true;*/
                this.roots.push(cur)
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

    _initTags(props) {
        this.kTagsIdMap = {};
        this.roots = [];
        let { treeData, nodeMap} = this.filterDatas(props.tags, props);
        this.kTagsIdMap = nodeMap;
        return ;
        /*const tags = props.tags.filter(
            t => (props.filterPlan ? props.rootTypes.indexOf(t.type) !== -1 : true) && !t.deleted
        ).filter((tag) => {
            if (tag.type >= 2000) {
                return true;
            }
            if (props.edu === Edu.kSenior) {
                return tag.weight <= 0;
            } else if (props.edu === Edu.kJunior) {
                return tag.weight >= 0 && tag.weight < 100;
            } else if (props.edu === Edu.kElementary) {
                return tag.weight === 0 || tag.weight >= 100;
            } else {
                return true;
            }
        }).filter(tag => Object.assign({}, tag));


        const roots = tags.filter(t => t.parent_id === null), signal = {};
        for (let i = 0; i < roots.length; i++) {
            if (props.rootTypes.indexOf(roots[i].type) != -1 && !signal[roots[i].type]) {
                this.roots.push(roots[i]);
                signal[roots[i].type] = 1;
                if (Object.keys(signal).length == props.rootTypes.length) break;
            }
        }
        //this.roots = props.rootTypes.map(type => roots.find(r => r.type === type));

        tags.forEach((tag) => {
            this.kTagsIdMap[tag._id] = tag;
            tag.children = [];  // eslint-disable-line no-param-reassign
        });
        tags.forEach((tag) => {
            // 级段过滤可能会有多的
            if (tag.parent_id && this.kTagsIdMap[tag.parent_id]) {
                this.kTagsIdMap[tag.parent_id].children.push(tag);
            }
        });
        tags.forEach((tag) => {
            this.kTagsIdMap[tag._id].children.sort((t1, t2) => t2.weight - t1.weight);
        });*/
    }

    _initSearchDataSource() {
        this.searchDataSource = [];

        const recur = (node, ppath) => {
            let path = []
            if (node && node.name) {
                path = ppath.concat([node.name])
            } else {
                console.log(node, ppath);

            }

            this.searchDataSource.push({
                value: node.name,
                display: path.join(' > '),
                id: node._id,
                level: path.length,
            });
            node.children.forEach(snode => recur(snode, path));
        };

        this.roots.forEach(root => recur(root, []));

        this.searchDataSource.sort((t1, t2) => t2.level - t1.level);
    }
    switchKtag = (e) => {
        this.setState({
            showType: 'ability',
            currentTagType: 'ability'
        })
    }

    render() {
        if (!this.roots.length) {
            return null;
        }
        return (
            <div className="kt-panel">
                <SearchBox
                    dataSource={this.searchDataSource}
                    onSelected={item => this.props.selectKtag(item.id)}
                />
                <div className="kt-nav-wrapper">
                    <KTagNav
                        showAll={this.props.showAll}
                        roots={this.roots} currentTagType={this.state.currentTagType}
                        onChange={this.changeTagType} switchKtag={this.switchKtag}
                    />
                </div>
                <div className="kt-tree-wrapper">
                    {
                        this.state.showType != 'ktag' && this.props.showAll?<AblitilyTree type={this.state.currentTagType} list={this.props.abilityData} updateAblity={this.props.updateAblity}/> : this.roots.map((root) => {
                            const current = this.state.currentTagType;
                            const display = current === root.type ? "show" : "hide";
                            return (
                                <div className={display} key={root.type}>
                                    {
                                        <KTagTree
                                            ref={`tree${root.type}`}
                                            root={root}
                                            id={this.props.id}
                                            type={this.state.currentTagType}
                                            kTagsIdMap={this.kTagsIdMap}
                                            selectPlan={this.props.selectPlan}
                                            selectKtag={this.props.selectKtag}
                                            showTip={this.props.showTip}
                                        />
                                    }

                                </div>
                            );
                        })
                    }

                </div>
                {this.props.showTip ? <div id="ktag-tip"/> : null}
            </div>
        );
    }
}

KTagPanel.defaultProps = {
    filterPlan: false,
    showTip: false,     // 是否显示ktag的Tip
};

class AblitilyTree extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        let { list, updateAblity } = this.props
        return (
            <ul className="abilities-tree">
                {
                    list.map((data, index) => {
                        return (
                            <li onDoubleClick={e=>{e.stopPropagation(); updateAblity(data)}} key={`abilities-tree${index}`}>
                                <span>{data.name}</span>
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
}
class SearchBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            q: '',
            candidates: [],
            show: true,
            index: -1,
        };
        this.lateSearch = debounce(this.search.bind(this), 200);
    }

    componentDidMount() {
        $(document).on('click.KTagPanel.SearchBox', (evt) => {
            if ($(evt.target).closest('.search-box').length) {
                return;
            }
            if (this.state.show) {
                this.setState({show: false});
            }
        });
        document.onkeydown = (event) => {
            // 监听meta键+k键
            if (event.keyCode === 75 && (event.metaKey || event.altKey) && this.searchInput) {
                this.searchInput.focus();
                event.preventDefault();
            } else if (event.keyCode === 38 && this.state.candidates.length) {
                // 监听up键
                let index = this.state.index - 1;
                if (index < 0) {
                    index = this.state.candidates.length - 1;
                }
                event.preventDefault();
                this.setState({index});
            } else if (event.keyCode === 40 && this.state.candidates.length) {
                // 监听down键
                let index = this.state.index + 1;
                if (index >= this.state.candidates.length) {
                    index = 0;
                }
                event.preventDefault();
                this.setState({index});
            } else if (event.keyCode === 13 && this.state.index >= 0) {
                // 监听enter键
                this.handleCandidateClick(this.state.candidates[this.state.index]);
            } else if (event.keyCode === 27) {
                this.setState({show: false, index: 0});
            }
        };
    }

    componentWillUnmount() {
        $(document).off('click.KTagPanel.SearchBox');
        document.onkeydown = null;
    }

    handleChange(evt) {
        this.setState({q: evt.target.value});
        this.lateSearch();
    }

    clearQ() {
        this.setState({q: '', candidates: []});
    }

    search() {
        const items = this._doSearch(this.state.q, this.props.dataSource);
        this.setState({candidates: items, show: true, index: 0});
    }

    _doSearch(q, dataSource) {
        if (!q) {
            return [];
        }
        const re = new RegExp(q);
        return dataSource.filter(item => re.test(item.value)).slice(0, this.props.maxResult);
    }

    _renderCandidates() {
        if (!this.state.candidates.length) {
            return null;
        }
        if (!this.state.show) {
            return null;
        }
        return (
            <ul className="candidates">
                {this.state.candidates.map((candidate, index) =>
                    <li
                        key={candidate.id}
                        className={`candidate-item ${this.state.index === index ? 'active' : ''}`}
                        onClick={this.handleCandidateClick.bind(this, candidate)}
                    >
                        {candidate.display}
                    </li>
                )}
            </ul>
        );
    }

    handleCandidateClick(candidate) {
        this.blur = false;
        this.props.onSelected(candidate);
    }

    render() {
        return (
            <div
                className="search-box"
            >
                <div className="input-group">
                    <input
                        type="search" className="form-control" value={this.state.q}
                        onChange={this.handleChange.bind(this)}
                        ref={(ref) => {
                            this.searchInput = ref;
                        }}
                        placeholder="Meta+K to activate"
                        onFocus={() => this.setState({show: true, index: 0})}
                        onBlur={() => {
                            this.blur = true;
                            setTimeout(() => {
                                if (this.blur) {
                                    this.setState({show: false, index: 0});
                                }
                            }, 100);
                        }}
                    />
                    <span className="input-group-btn">
                        <button
                            className="btn btn-default" type="button"
                            onClick={this.clearQ.bind(this)}
                        >Clear</button>
                    </span>
                </div>
                {this._renderCandidates()}
            </div>
        );
    }
}

SearchBox.defaultProps = {
    maxResult: 10,
    dataSource: [],  // {value: String, display: String, id: String /* as key */}
};
