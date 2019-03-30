import React from 'react';
import { Q, Edu, EduDesc } from 'js/quantum';
import StarsGroup from 'js/item/star_group';
import { setNavBar, NavItem } from 'js/nav';
import KTagPanel from 'js/item/ktag';
import ItemDisplay from 'js/item/display';
import Immutable from 'immutable';
import Global from 'global';
import { KtItems } from 'js/widgets/kt_items';
import { HtmlWithTex } from 'js/widgets/html_with_tex';
import Pagination from 'js/widgets/pagination';
import { getSubject } from 'js/subjects';
import Select, { Option } from 'rc-select'
import { Difficult } from 'js/item/tagging'
import { Row, Col } from 'react-flexbox-grid'
import { YearSwitch, AreaSelected, ItemClassSwitcher, ItemTypeSwitcher } from 'component/itemParsing'
import "css/main.scss";

export default class ItemSearch extends React.Component {

    componentWillMount() {
        let a = Q.get('/item/review?review=tag');
        let b = Q.get('/item/review?review=tag&subreview=retag');
        let c = Q.get('/item/review?review=typeset');
        $.when(a,b,c).done((tagurl,retagurl,typeseturl)=>{
            let navItems = [
                new NavItem('查询', '/item_search'),
                new NavItem('创建', '/item/parse'),
                new NavItem('标注', tagurl),
                new NavItem('复标', retagurl),
                new NavItem('审核', typeseturl)
            ];
            setNavBar(navItems, '查询');
        })
    }

    componentDidMount() {

    }

    renderItemTools(item) {
        if (!Global.user) {
            return null;
        }
        if (!Global.user.permissions.filter(x => x === 1 || x === 3).length) {
            return null;
        }
        return (
            <div className="tools-wrapper">
                <a
                    className="btn btn-primary btn-sm" target="typeset"
                    href={`/item/${item._id}/typeset`}
                >
                    <span className="glyphicon glyphicon-edit" aria-hidden="true" />编辑题目
                </a>
            </div>
        );
    }
    render() {
        return <ItemSearchPanel renderItemTools={this.renderItemTools} />;
    }
}

export class ItemSearchPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            totalPages: 0,
            isPagination: false,
        };
        this.setBind();
        this.searchParams = null;
    }
    setBind() {
        this.search = this.search.bind(this);
        this.paginate = this.paginate.bind(this);
        this.addItemToCart = this.addItemToCart.bind(this);
    }
    updateItems(data, isPagination) {
        this.setState({
            items: data.results,
            totalPages: Math.ceil(data.total / data.page_size),
            isPagination,
        });
    }
    search(params, page = 1, isPagination = false) {
        this.searchParams = params;
        const params_ = params;
        params_.page_num = page;
        params_.page_size = 10;
        Q.get('/api/item_search', { query: params_ })
        .done(data => this.updateItems(data, isPagination));
    }
    paginate(page) {
        this.search(this.searchParams, page, true);
    }
    addItemToCart(_id, digest) {
        this.refs.itemCart.add(_id, digest);
    }
    render() {
        const state = this.state;
        return (
            <div id="item-search">
                <div className="op-zone">
                    <SearchPanel searchCallback={this.search} />
                    <hr />
                    <ItemCart ref="itemCart" />
                </div>
                <div className="result-zone">
                    <div>
                        <ItemList
                            items={state.items}
                            renderItemTools={this.props.renderItemTools}
                            addItemToCart={this.addItemToCart}
                        />
                    </div>
                    <div>
                        <Pagination
                            totalPages={state.totalPages} isPagination={state.isPagination}
                            paginateCallback={this.paginate}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

function ItemList(props) {
    const items = props.items;
    return (
        <ul className="items-wrapper">
            {
                items.map(i =>
                    <ItemInfo
                        key={i._id} item={i}
                        renderItemTools={props.renderItemTools}
                        addToCart={props.addItemToCart}
                    />
                )
            }
        </ul>
    );
}

class ItemInfo extends React.Component {
    constructor(props) {
        super(props);
        this.item = null;
    }

    addToCart() {
        if (!this.item) {
            return;
        }
        const digest = (this.item.data.stem || this.item.data.qs[0].desc).substring(0, 100);
        this.props.addToCart(this.props.item._id, digest);
    }
    render() {
        const props = this.props;
        const item = props.item;
        let itemTools = null;
        if (props.renderItemTools) {
            itemTools = props.renderItemTools(item);
        }
        return (
            <li>
                <ItemInfoHeader item={item} addToCart={this.addToCart.bind(this)} />
                <ItemDisplay
                    id={item._id}
                    onLoaded={(itemDisplay) => {
                        this.item = itemDisplay.state.item ? itemDisplay.state.item.toJS() : null;
                    }}
                />
                {itemTools}
            </li>
        );
    }
}

function ItemInfoHeader(props) {
    const papers = props.item.papers;
    return (
        <div className="paperinfo-wrapper">
{/*            {
                papers.map((p, i) => {
                    return (<span key={i} className="label label-info">{p.name}</span>);
                })
            }*/}
            <button
                className="btn btn-default btn-xs" style={{ float: 'right' }}
                onClick={props.addToCart}
            >添加</button>
        </div>
    );
}

class SearchPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            year: 0,
            abilities: 0,
            dataReady: false,
            mustKtags: new Immutable.Map(),
            ktModalShow: false,
            selectedType: getSubject().id * 1000,
            selectedSource: null,
            edu: Global.user.edu || Edu.kDefault,
            keyword: "",
        };
        this.ktags = [];
        this.rootTypes = [];
        this.treeKtags = [];
        this.kTagsIdMap = {};
        this.kTagsRelMap = {};
        this.setBind();
    }
    getRemoteKtag() {
        Q.get(`/api/root_ktags`).done(result => {
            this.rootTypes = result.map(t => t.type);
            this.getRemoteData();
        })
    }
    getRemoteData() {
        Q.get(`/api/ktags`)
            .done((data) => {
                data.forEach((tag) => {
                    this.kTagsIdMap[tag._id] = tag;
                    if (!this.kTagsRelMap[tag.parent_id]) {
                        this.kTagsRelMap[tag.parent_id] = [];
                    }
                    this.kTagsRelMap[tag.parent_id].push(tag);
                });
                this.ktags = data;
                this.treeKtags = this.ktags.filter(k => this.rootTypes.indexOf(k.type) !== -1);
                this.setState({
                    dataReady: true,
                });
            });
    }
    componentDidMount() {
        this.getRemoteKtag()
    }
    setBind() {
        this.addKtag = this.addKtag.bind(this);
        this.removeKtag = this.removeKtag.bind(this);
        this.displayKtModal = this.displayKtModal.bind(this);
        this.search = this.search.bind(this);
        this.setItemType = this.setItemType.bind(this);
        this.setEdu = this.setEdu.bind(this);
        this.setKeyword = this.setKeyword.bind(this);
        this.getKtagById = this.getKtagById.bind(this);
        this.updateKtags = this.updateKtags.bind(this);
        this.setSourceType = this.setSourceType.bind(this);
    }
    getKtagById(ktId) {
        let tag = this.kTagsIdMap[ktId];
        const ktag = {
            id: ktId,
            name: tag.name,
            path: tag.name,
        };
        while (tag.parent_id) {
            tag = this.kTagsIdMap[tag.parent_id];
            ktag.path = `${tag.name}>${ktag.path}`;
        }
        return Immutable.fromJS(ktag);
    }
    /*setDifficulty(score) {
        this.setState({
            difficulty: score,
        });
    }*/
    changeLevel = score => {
        this.state.level = score;
    }
    setItemType(type) {
        this.state.selectedType = type;
    }
    setSourceType(type) {
        this.state.selectedSource = type;
    }
    setKeyword(word) {
        this.state.keyword = word;
    }
    setEdu(edu) {
        if (edu != this.state.edu) {
            this.setState({
                edu,
                mustKtags: this.state.mustKtags.clear()
            });

        }

    }
    addKtag(ktId) {
        if (!this.state.mustKtags.has(ktId)) {
            const ktTag = this.getKtagById(ktId);
            this.setState({
                mustKtags: this.state.mustKtags.set(ktId, ktTag),
            });
        }
    }
    updateKtags(ktags) {
        this.setState({
            mustKtags: ktags,
        });
    }
    removeKtag(ktId) {
        if (this.state.mustKtags.has(ktId)) {
            this.setState({
                mustKtags: this.state.mustKtags.delete(ktId),
            });
        }
    }
    displayKtModal(value) {
        this.setState({
            ktModalShow: value,
        });
    }
    changeDifficult = val => {
        this.state.difficulty = val;
    }
    changeArea = data => {
        this.state.city = data.city;
        this.state.province = data.province
    }
    changeAbility = data => {
        this.state.abilities = data;
    }
    yearChange = year => {
        this.state.year = year
    }

    search() {
        const params = {
            difficulty: this.state.difficulty,
            keywords: this.state.keyword,
            edu: this.state.edu,
            item_type: this.state.selectedType,

            year: this.state.year,
            city: this.state.city,
            province: this.state.province,
            level : this.state.level,
            source: this.refs['source'].state.value,
            abilities: this.state.abilities,
            classes: this.state.selectedSource || null,
            tag_ids: this.state.mustKtags.keySeq().join(','),
        };
        this.props.searchCallback(params);
    }
    render() {
        const state = this.state;
        if (!state.dataReady) {
            return (<div>数据加载中</div>);
        }
        return (
            <div className="search-panel">
                <EduTab edu={state.edu} callbackEvent={this.setEdu} />
                <ItemKt
                    title="知识点" selectedKTags={state.mustKtags.valueSeq()}
                    removeKtagEvent={this.removeKtag} openKtModalEvent={this.displayKtModal}
                />
                <ItemKeyword keyword={state.keyword} callbackEvent={this.setKeyword} />
                <ItemSourceType callbackEvent={this.setSourceType} />

                <ItemLevel callback={this.changeLevel}/>

                <Difficult level={state.difficulty}  callbackEvent={this.changeDifficult}/>
                <Row>
                    <AbilityGroup edu={state.edu} value={state.abilities} callback = {this.changeAbility} />
                    <ItemTypeSwitcher showAll={true} type={state.selectedType}  edu={state.edu} onTypeChanged={this.setItemType} />
                </Row>
                <Row>
                    <YearSwitch yearChange={this.yearChange} year={state.year} />
                    <ItemClassSwitcher showAll={true} ref="source"/>
                </Row>

                <AreaSelected showAll={true} hiddenYear={true} onFilterChange={this.changeArea} />
                <KtModal
                    edu={this.state.edu} ktags={this.treeKtags} rootTypes={this.rootTypes}
                    selectedKTags={state.mustKtags.valueSeq()}
                    show={state.ktModalShow} openKtModalEvent={this.displayKtModal}
                    getKtagById={this.getKtagById} submitKtags={this.updateKtags}
                />
                <div className="search-btn-wrapper">
                    <button className="btn btn-success" onClick={this.search}>检索</button>
                </div>
            </div>
        );
    }
}

class ItemKt extends React.Component {
    constructor(props) {
        super(props);
        this.setBind();
    }
    setBind() {
        this.clickHandler = this.clickHandler.bind(this);
    }
    clickHandler() {
        if (this.props.openKtModalEvent) {
            this.props.openKtModalEvent(true);
        }
    }
    render() {
        const props = this.props;
        return (
            <Row className="item-kt-wrapper">
                <Col xs={2}><label htmlFor="">知识点</label></Col>
                <Col xs={10}>
                    <div>
                        <KtItems
                            ktags={props.selectedKTags} tagAttr="name"
                            removeKtagEvent={props.removeKtagEvent}
                        />
                    </div>
                    <div className="kt-tools">
                        <a onClick={this.clickHandler}>
                            <span className="glyphicon glyphicon-plus" />
                            <span>添加知识点</span>
                        </a>
                    </div>
                </Col>
            </Row>
        );
    }
}

class KtModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedKTags: new Immutable.Map(),
        };
        this.setBind();
        this.selectedKTags = [];
        this.getKtagById = props.getKtagById;
    }
    componentWillReceiveProps(nextProps) {
        let selectedKTags = new Immutable.Map();
        nextProps.selectedKTags.forEach((t) => {
            selectedKTags = selectedKTags.set(t.get('id'), t);
        });
        this.setState({
            selectedKTags,
        });
    }
    setBind() {
        this.cancelClick = this.cancelClick.bind(this);
        this.submit = this.submit.bind(this);
        this.addKtag = this.addKtag.bind(this);
        this.removeKtag = this.removeKtag.bind(this);
    }
    cancelClick() {
        if (this.props.openKtModalEvent) {
            this.props.openKtModalEvent(false);
        }
    }
    addKtag(ktId) {
        if (!this.state.selectedKTags.has(ktId)) {
            const ktTag = this.getKtagById(ktId);
            this.setState({
                selectedKTags: this.state.selectedKTags.set(ktId, ktTag),
            });
        }
    }
    removeKtag(ktId) {
        if (this.state.selectedKTags.has(ktId)) {
            this.setState({
                selectedKTags: this.state.selectedKTags.delete(ktId),
            });
        }
    }
    submit() {
        this.props.submitKtags(this.state.selectedKTags);
        this.props.openKtModalEvent(false);
    }
    render() {
        const props = this.props;
        const state = this.state;
        let modalClass = "kt-modal";
        modalClass += props.show ? "" : " hide";
        return (
            <div className={modalClass}>
                <div className="body">
                    <div className="selected-panel">
                        <div className="selected-kt-wrapper">
                            <KtItems
                                ktags={state.selectedKTags.valueSeq()}
                                removeKtagEvent={this.removeKtag}
                            />
                        </div>
                        <div className="btns-wrapper">
                            <button className="btn btn-success" onClick={this.submit}>确定</button>
                            <button className="btn btn-default" onClick={this.cancelClick} >
                            取消</button>
                        </div>
                    </div>
                    <div className="kt-panel-wrapper">
                        <KTagPanel
                            edu={props.edu} tags={props.ktags}
                            selectKtag={this.addKtag} rootTypes={props.rootTypes}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

class EduTab extends React.Component {
    clickHandler(edu) {
        console.log(edu);
        this.props.callbackEvent(edu);
    }
    render() {
        const props = this.props;
        return (
            <div className="edu-tab-wrapper">
                <ul className="nav nav-pills nav-justified">
                    { EduDesc.kAll.map(desc =>
                        <li
                            className={props.edu === desc.edu ? "active" : ""}
                            key={desc.edu}
                            onClick={this.clickHandler.bind(this, desc.edu)}
                        ><a>{desc.name}</a></li>
                    )}
                </ul>
            </div>
        );
    }
}
class AbilityGroup extends React.Component {
    constructor(props) {
        super(props)
        this.dataStack = {}
    }
    state = {
        value: ''
    }
    componentDidMount() {
        Q.get('/general/getAbility',{ query: { edu: 0}})
            .done(data => {
                data.forEach(item => {
                    if (!this.dataStack[item.edu]) {
                        this.dataStack[item.edu] = []
                    }
                    this.dataStack[item.edu].push(item)
                })
                this.forceUpdate()
            })
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value
        })
    }
    changeAbility = value => {
        this.setState({
            value
        }, ()=> {
            this.props.callback(this.state.value)
        })
    }
    render() {
        let { edu } = this.props;
        let data = this.dataStack[edu]

        return (
            <Col xs>
                    <label style={{'marginRight': '10px'}}>能力</label>
                    <Select style={{ width: "70%" }} onChange={this.changeAbility} showSearch={false} optionLabelProp="children">
                        {
                            data? data.map((item, index) => <Option key={item._id} value={item.ability_id}>{item.name}</Option>): null
                        }
                    </Select>
            </Col>

        )
    }
}
class ItemType extends React.Component {
    constructor(props) {
        super(props)
        this.categories = [];
    }
    state = {
        selectedType: ''
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            selectedType: nextProps.selectedType
        })
    }
    componentDidMount() {
        Q.get('/general/getDict',{query: {type: 4}})
            .done(data => {
                this.categories = data;
                this.categories.unshift({
                    code: 0,
                    name:'所有'
                })
                this.forceUpdate()
            })
    }
    clickHandler =(type)=>{
        this.setState({
            selectedType: type
        }, () => {
            this.props.callbackEvent(type);
        })

    }

    render() {
        return (
            <Col xs>
                <label style={{'marginRight': '10px'}}>题类</label>
                <Select style={{ width: "70%" }} onChange={this.clickHandler} showSearch={false} optionLabelProp="children" value={this.state.selectedType}>
                    {

                        this.categories.map((item, index) => (<Option key={item.code} value={item.code}>{item.name}</Option>))
                    }
                </Select>
            </Col>
        );
    }
}

class ItemLevel extends React.Component{
    state = {
        level: 0
    }
    setLevel = val => {
        this.setState({
            level: val
        }, () => {
            this.props.callback(this.state.level)
        })
    }
    render() {
        return (
            <Row>
                <Col xs={2}>星级</Col>
                <Col xs={10}>
                    <StarsGroup value = {this.state.level} callbackEvent={this.setLevel}/>
                </Col>
            </Row>
        );
    }
}

class ItemKeyword extends React.Component {
    state = {
        keyword: ''
    }
    changeHandler = (evt) => {
        this.setState({
            keyword:evt.target.value
        }, () => {
            this.props.callbackEvent(this.state.keyword);
        })

    }
    render() {
        return (
            <Row className="keyword-wrapper">
                <Col xs={2}>关键词</Col>
                <Col xs={10}>
                    <input className='form-control'
                        type="text" placeholder="请输入关键词" value={this.state.keyword}
                        onChange={this.changeHandler}
                    />
                </Col>
            </Row>
        );
    }
}

class ItemSourceType extends React.Component {
    constructor(props) {
        super(props);
        this.sourceTypes = [
            { type: 1, title: "真题" },
            { type: 2, title: "其他" },
            { type: 0, title: "所有" },
        ];
        this.changeHandler = this.changeHandler.bind(this);
    }
    state = {
        value: ''
    }
    changeHandler(evt) {
        this.setState({
            value: parseInt(evt.target.value, 10)
        }, () => {
            this.props.callbackEvent(this.state.value)
        })
    }
    render() {
        return (
            <Row className="source-wrapper">
                <Col xs={2}>来源</Col>
                <Col xs={10}>
                    { this.sourceTypes.map((t) => {
                        return (
                            <label key={t.type}>
                                <input
                                    type="radio" name="source" value={t.type}
                                    onChange={this.changeHandler}
                                />
                                <span>{t.title}</span>
                            </label>
                        );
                    })}
                </Col>
            </Row>
        );
    }
}

class ItemCart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: Immutable.List(),
        };
    }

    add(_id, digest) {
        if (this.state.items.find(item => item._id === _id)) {
            return;
        }
        this.setState({
            items: this.state.items.push({
                _id, digest,
            }),
        });
    }

    remove(_id) {
        const entry = this.state.items.findEntry(item => item._id === _id);
        if (!entry) {
            return;
        }
        this.setState({
            items: this.state.items.delete(entry[0]),
        });
    }

    openAll() {
        const ids = this.state.items.map(item => item._id);
        if (ids.size === 0) {
            return;
        }
        const url = `/items/list?ids=${ids.join(',')}`;
        window.open(url);
    }

    render() {
        const removeHandler = this.remove.bind(this);
        const lis = this.state.items.map(item =>
            <li key={item._id}>
                <ItemCartRow item={item} removeHandler={removeHandler} />
            </li>
        );
        return (
            <div>
                <h3>
                    <span>题目暂存区</span>
                    <button
                        className="btn btn-default btn-sm"
                        style={{ float: 'right', margin: 0, paddingTop: 3, paddingBottom: 3 }}
                        onClick={this.openAll.bind(this)}
                    >打开</button>
                </h3>
                <ol> {lis} </ol>
            </div>
        );
    }
}

function ItemCartRow({ item, removeHandler }) {
    return (
        <div>
            <div>
                <span className="label label-default">{item._id}</span>
                <button
                    onClick={() => removeHandler(item._id)} style={{ float: 'right' }}
                    className="btn btn-default btn-xs"
                >删除</button>
            </div>
            <HtmlWithTex html={item.digest} />
        </div>
    );
}
