import React from 'react';
import Immutable from 'immutable';
import $ from 'jquery';
import {browserHistory} from 'react-router';
import Q, { planIds } from 'js/quantum';
import { getSubjectByItemType } from 'js/subjects';
import { HtmlWithTex } from 'js/widgets/html_with_tex';
import { showAlert } from 'js/widgets/alert';
import { setCurrentNav } from './common';
import { Row, Col } from 'react-flexbox-grid'
import KTagPanel from './ktag';
import StarsGroup from './star_group';
let gGoodToLeave = true;


class DuplicationDetector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            clusterSize: 0,
        };
    }

    componentDidMount() {
        Q.get(`/api/item/${this.props.itemId}/cluster`)
            .done((cluster) => {
            	if(cluster){
            		this.setState({ clusterSize: cluster.item_ids.length });
            	}
            })
        ;
    }

    render() {
        if (this.state.clusterSize > 1) {
            return <span className='duplicate-item'>有重复题目，请查看聚类</span>;
        } else {
            return <span className='duplicate-item' />;
        }
    }
}

export class ReviewProgress extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            reviewed: 0,
            total: 0,
        };
    }

    componentDidMount() {
        let url = `/api/items/review_progress?review=${this.props.review}&subreview=${this.props.subreview || ''}`;
        if (this.props.paperId) {
            url += `&paper_id=${this.props.paperId}`;
        } else if (this.props.volumeId) {
            url += `&volume_id=${this.props.volumeId}`;
        }

        if (this.props.edu) {
            url += `&edu=${this.props.edu}`;
        }

        Q.get(url)
            .done((rv) => {
                this.setState(rv);
            });
    }

    render() {
        if (this.state.total === 0) {
            return <span className='review-progress' />;
        } else {
            return (<span className='review-progress'>
                {this.props.caption} / 总数: {this.state.reviewed} / {this.state.total}
            </span>);
        }
    }
}
class PlanTags extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        let {plans} = this.props;
        return (
            <div className="kplan-group">
                <ul>
                {plans.map((plan, index) => (
                    <li key={`plan${index}`} className="kplan-wrapper clearfix">
                        <span className="text-info">{plan.get('path')}</span>
                        <button
                            className="btn btn-danger btn-xs pull-right" onClick={()=>this.props.removePlan(plan)}
                        >
                            <i className="glyphicon glyphicon-remove" />
                        </button>

            </li>))}

            </ul>
            </div>)
    }
}

export default class ItemTagging extends React.Component {
    constructor(props) {
        super(props);
        this.item = null;
        this.state = {
            itemTagData: null,
            source: 0,
            year: 0,
            city: "",
            province: "",
            abilities: "",
            level: 0,
            currentSecIndex: 0,
            dataComplete: false,
            ajaxing: false,
            plans: [],//教案切片
            edu: 0,
            inReview: props.location.pathname.substr(props.location.pathname.lastIndexOf('/') + 1) === props.location.query.review,
        };
        this.autoDifficulty = true;
        this.itemHtml = null;
        this.itemType = 0;
        this.ktags = [];
        this.rootTypes = [];
        this.kTagsIdMap = {};
        this.kTagsRelMap = {};
        this.abilityData = [];
        this.itemTag = {};
        this.setBind();
    }
    componentWillReceiveProps(nextProps) {
        this.updatePage(nextProps)
    }
    updatePage(props) {
        setCurrentNav('标注', props.params.id,props.location.search);
        const getRootTye = Q.get(`/api/all_root_ktags`)
            .done(result => {
                this.rootTypes = result.map(desc => desc.type);
            })
        const htmlReq = Q.get(`/api/item/${props.params.id}/html`)
            .done((data) => {
                this.itemHtml = data.html;
                this.itemType = data.type;
                this.setState({ edu: data.extra.edu });
            });
        const getAbility = Q.get('/general/getAbility', { query: { edu: Global.user.edu}})
            .done(data => {
                this.abilityData = data;
            })
        const ktagsReq = Q.get(`/api/plan_tag/get_tree_for_tag`)
            .done((data) => {
                this.ktags = data;
            });

        const itemTagReq = Q.get(`/api/item/${props.params.id}/item_tag`)
            .done((data) => {
                this.itemTag = data;
                this.autoDifficulty = !data.difficulty;
            });
        //获取教案

        $.when(getRootTye, htmlReq, ktagsReq, itemTagReq, getAbility)
            .done(() => {
                this.convertKtag();
                this.convertItemTagData(this.itemTag);
                this.setState({
                    dataComplete: true,
                });
                Q.get(`/api/plan_tag/item/${props.params.id}/v1`)
                    .done(data => {
                        let plans = data.map(plan => Immutable.fromJS(this.getPlanById(plan)))
                        this.setState({plans})
                    })
            });
    }
    componentDidMount() {

        $(window).on('beforeunload.tagging-page', () => {
            if (!gGoodToLeave) {
                return "题目尚未保存，确认离开此页面？";
            } else {
                return undefined;
            }
        });
        this.updatePage(this.props)


    }

    componentWillUnmount() {
        $(window).off('beforeunload.tagging-page');
    }

    setBind() {
        this.setKTag = this.setKTag.bind(this);
        this.setSection = this.setSection.bind(this);
        this.setDiffculty = this.setDiffculty.bind(this);
        this.setAbility = this.setAbility.bind(this);
        this.setCategories = this.setCategories.bind(this);
        this.updateKtags = this.updateKtags.bind(this);
        this.save = this.save.bind(this);
    }

    setSection(index) {
        if (this.state.currentSecIndex !== index) {
            this.setState({
                currentSecIndex: index,
            });
        }
    }

    setKTag(tagId) {
        const tag = Immutable.fromJS(this.getTagById(tagId, true, false));
        const newItemTagData = this.state.itemTagData.withMutations((itemTagData) => {
            if (!this.state.currentSecIndex) {
                this.updateStemKtags(itemTagData, tag, true);
            } else {
                this.updateQsTags(itemTagData, tag, this.state.currentSecIndex - 1, true);
            }
        });
        this.setState({ itemTagData: newItemTagData });
        gGoodToLeave = false;
    }
    getPlanById(obj) {
        let tag_ = this.kTagsIdMap[obj._id];
        const tag = {
            id: obj._id,
            name: tag_.name,
            path: tag_.name,
            type: tag_.type,
            location: obj.location
        };
        while (tag_.parent_id) {
            tag_ = this.kTagsIdMap[tag_.parent_id];
            tag.path = `${tag_.name}>${tag.path}`;
        }
        return tag;
    }
    getTagById(tagId, primary = false, auto = false) {
        let tag_ = this.kTagsIdMap[tagId];
        const tag = {
            id: tagId,
            name: tag_.name,
            path: tag_.name,
            type: tag_.type,
            primary,
            auto,
        };
        while (tag_.parent_id) {
            tag_ = this.kTagsIdMap[tag_.parent_id];
            tag.path = `${tag_.name}>${tag.path}`;
        }
        return tag;
    }

    setDiffculty(score) {
        this.autoDifficulty = !score;
        const itemTagData = this.state.itemTagData.set('difficulty', score);
        this.state.itemTagData = itemTagData;
        gGoodToLeave = false;
    }
    setLevel = (level) => {
        const itemTagData = this.state.itemTagData.set('level', level);
        this.setState({ itemTagData });
        gGoodToLeave = false;
    }
    setAbility(item, score) {
        let abilities = this.state.itemTagData.get('abilities_list');
        let index = abilities.indexOf(item);
        abilities = abilities.set(index, item.set('level', score))
        this.state.itemTagData = this.state.itemTagData.set('abilities_list', abilities);
        /*this.setState({
            itemTagData: this.state.itemTagData.set('abilities_list', abilities),
        });*/
        gGoodToLeave = false;

    }

    setCategories(category) {
        let categories = this.state.itemTagData.get('categories');
        const index = categories.indexOf(category);
        if (index !== -1) {
            categories = categories.delete(index);
        } else {
            categories = categories.push(category);
        }
        this.setState({
            itemTagData: this.state.itemTagData.set('categories', categories),
        });
        gGoodToLeave = false;
    }

    getSaveData() {
        const itemTagData = this.state.itemTagData.toJSON();
        itemTagData.ktags = itemTagData.ktags.map(k => ({ id: k.id, primary: k.primary }));
        itemTagData.qs = itemTagData.qs.map(
            q => q.map(k => ({ id: k.id, primary: k.primary }))
        );
        return itemTagData;
    }

    setAjaxStatus(status = false) {
        this.setState({
            ajaxing: status,
        });
    }

    convertKtag() {
        this.ktags.forEach((tag) => {
            this.kTagsIdMap[tag._id] = tag;
            if (!this.kTagsRelMap[tag.parent_id]) {
                this.kTagsRelMap[tag.parent_id] = [];
            }
            this.kTagsRelMap[tag.parent_id].push(tag);
        });
        this.treeKtags = this.ktags.filter(k => this.rootTypes.indexOf(k.type) !== -1);
    }

    convertItemTagData(data) {
        const tagData = data.data;
        tagData.ktags = data.data.ktags.map(
            k => this.getTagById(k.id, k.primary, k.auto));
        tagData.qs = data.data.qs.map(
            q => q.map(k => this.getTagById(k.id, k.primary, k.auto))
        );
        this.setState({
            itemTagData: Immutable.fromJS(tagData),
        });
    }

    save(type = 'save') {
        // type in ('save', 'review', 'review_skip')
        const payload = { json: this.getSaveData() };
        payload.json.action = type;
        if(this.props.location.query.volume_id){
        	payload.json.volume_id = this.props.location.query.volume_id;
        }
        
        payload.json.in_flow = !!this.props.location.query.review;
        const inReview = (type === 'review' || type === 'review_skip');

        function validate(data) {
            for (let i = 0; i < data.qs.length; i++) {
                if (data.qs[i].length === 0) {
                    Q.alert(`第${i + 1}小题没有标注知识点`, 'warning');
                    return false;
                }
            }

            if (data.difficulty === 0) {
                Q.alert('没有标注难度', 'warning');
                return false;
            }
            return true;
        }

        if (type !== 'review_skip' && !validate(payload.json)) {
            return;
        }

        this.setAjaxStatus(true);
        Q.post(`/api/item/${this.props.params.id}/item_tag`, payload)
        .done((data) => {

            this.convertItemTagData(data);
            gGoodToLeave = true;
            if (type == 'save') {
                showAlert('保存成功','success');
                return ;
            }
            if (inReview) {
                Q.get(`/item/review${this.props.location.search}`)
                    .done(result => {
                        browserHistory.push(result)
                    })
                //window.location.href = `/item/review${this.props.location.search}`;
            } else if (this.props.location.query.review === 'typeset') {
                window.location.href = `/item/${this.props.params.id}/typeset${this.props.location.search}`;
            }
        })
        .fail((jqXHR, ...rest) => {
            if (jqXHR.status === 409 && inReview) {
                const message = Q.jsonedError(jqXHR, ...rest).message;
                if (window.confirm(`${message}，重新分配题目？`)) {
                    window.location.href = `/item/review${this.props.location.search}`;
                }
            }
        })
        .always(() => {
            this.setAjaxStatus();
        });
    }

    updateKtags(index, key, tag, update) {
        let tag_ = Immutable.fromJS(this.getTagById(tag.id, tag.primary, tag.auto));
        if (key === "update") {
            // eslint-disable-next-line no-restricted-syntax
            for (const key_ in update) {
                if (update.hasOwnProperty(key_)) {
                    tag_ = tag_.set(key_, update[key_]);
                }
            }
        }
        const newItemTagData = this.state.itemTagData.withMutations((itemTagData) => {
            if (index === 0) {
                this.updateStemKtags(itemTagData, tag_, key === "update");
            } else {
                this.updateQsTags(itemTagData, tag_, index - 1, key === "update");
            }
        });
        this.setState({ itemTagData: newItemTagData });
        gGoodToLeave = false;
    }

    updateStemKtags(itemTagData, tag, update) {
        // itemTagData should be mutable
        const ktags = itemTagData.get(`ktags`);
        let index = -1;
        ktags.forEach((tag_, i) => {
            if (tag_.get('id') === tag.get('id')) {
                index = i;
            }
        });
        if (index !== -1 && !update) {
            if (ktags.get(index).get('auto')) {
                return;
            }
            itemTagData.set('ktags', ktags.delete(index));
        } else if (index === -1) {
            itemTagData.set('ktags', ktags.push(tag));
        } else {
            itemTagData.set('ktags', ktags.set(index, tag));
        }
    }

    updateQsTags(itemTagData, tag, qsIndex, update) {
        // itemTagData should be mutable
        let qKtags = itemTagData.get(`qs`).get(qsIndex);
        let index = -1;
        qKtags.forEach((tag_, i) => {
            if (tag_.get('id') === tag.get('id')) {
                index = i;
            }
        });
        if (index !== -1 && !update) {
            if (qKtags.get(index).get('auto')) {
                return;
            }
            qKtags = qKtags.delete(index);
        } else {
            if (index === -1) {
                qKtags = qKtags.push(tag);
            } else {
                qKtags = qKtags.set(index, tag);
            }
            if (this.hasStem()) {
                const tag_ = tag.set('primary', false);
                this.updateStemKtags(itemTagData, tag_, update);
            }
        }
        itemTagData.setIn(['qs', qsIndex], qKtags);
    }

    hasStem() {
        const html = this.itemHtml;
        const $html = $(html);
        if ($html.children().length > 1) {
            return true;
        }

        return false;
    }
    selectPlan = (tag)=> {
        const plan = Immutable.fromJS(this.getPlanById(tag));
        this.state.plans.push(plan);
        this.forceUpdate()
    }
    removePlan = (obj)=>{
        Q.post(`/api/plan_tag/item/${this.props.params.id}/v1`,{json: { state: 0, id: obj.get('id')}}).done(result=> {
            this.state.plans = this.state.plans.filter(plan => plan.get('id') != obj.get('id'))
            this.forceUpdate()
        })
    }
    updateAblity = (data) => {
        data.level = 0;
        let obj = Immutable.Map(data);
        let abilities = this.state.itemTagData.get('abilities_list');
        if (abilities.filter(item => item.get('name') == obj.get('name')).size != 0) return ;

        abilities = abilities.push(obj);
        this.setState({
            itemTagData: this.state.itemTagData.set('abilities_list', abilities)
        }, ()=> {
            gGoodToLeave = false;
        });


    }
    render() {
        if (!this.state.dataComplete) {
            return (<div>数据加载中</div>);
        }
        const state = this.state;
        return (
            <div id="item-tagging">
                <div className="item-pane">
                    {this.state.inReview &&
                        <div className="review-info">
                            <DuplicationDetector itemId={this.props.params.id} />
                            <ReviewProgress
                                review='tag'
                                subreview={this.props.location.query.subreview}
                                caption='已标注'
                                paperId={this.props.location.query.paper_id}
                                volumeId={this.props.location.query.volume_id}
                                edu={this.props.location.query.edu}
                            />
                        </div>
                    }
                    <div>
                        <div className="sections-wrapper">

                            <ItemSections
                                html={this.itemHtml}
                                ktags={state.itemTagData.get('ktags')}
                                qs={state.itemTagData.get('qs')}
                                currentSecIndex={state.currentSecIndex}
                                selectSection={this.setSection}
                                updateKtagEvent={this.updateKtags}
                            />
                             <PlanTags
                                removePlan={this.removePlan}
                                plans={this.state.plans}/>

                        </div>
                    </div>

                    <Difficult callbackEvent={this.setDiffculty} level={state.itemTagData.get('difficulty')}/>
                    <Row>
                        <Col xs={1}>星级</Col>
                        <Col xs={11}>
                            <StarsGroup value = { state.itemTagData.get('level')} callbackEvent={this.setLevel}/>
                        </Col>
                    </Row>
                    <ItemCategory
                        categories={state.itemTagData.get('categories')}
                        callbackEvent={this.setCategories}
                    />
                    <AbilitiesGroup
                        data={state.itemTagData.get('abilities_list')}
                        itemType={this.itemType}
                        callbackEvent={this.setAbility}
                    />
                    <div style={{ textAlign: 'center' }} className="well well-sm op-zone">
                        <button
                            className="btn btn-default btn-lg"
                            onClick={this.save.bind(this, 'save')} disabled={state.ajaxing}
                            title="保存标注，当处于审核流程时会跳回题目标注页面"
                        >保存</button>
                        {this.state.inReview &&
                            <button
                                className="btn btn-warning btn-lg"
                                onClick={this.save.bind(this, 'review_skip')} disabled={state.ajaxing}
                                title="当不确定如何标注时，跳过会保存当前标注并重新分配题目"
                            >跳过</button>
                        }
                        {this.state.inReview &&
                            <button
                                className="btn btn-danger btn-lg"
                                onClick={this.save.bind(this, 'review')} disabled={state.ajaxing}
                                title="保存标注并分配新题目"
                            >下一题</button>
                        }
                    </div>
                </div>
                <div className="kt-panel-pane">
                    <KTagPanel
                        showAll={true}
                        updateAblity={this.updateAblity}
                        selectPlan={this.selectPlan}
                        id={this.props.routeParams.id}
                        abilityData = {this.abilityData}
                        edu={this.state.edu} tags={this.treeKtags}
                        selectKtag={this.setKTag} rootTypes={this.rootTypes}
                        showTip
                    />
                </div>
            </div>
        );
    }
}

class ItemSections extends React.Component {
    componentWillMount() {
        const html = this.props.html;
        const $html = $(html);
        if ($html.children().length === 1) {
            this.selectSection(1);
        }
    }
    getQsParts() {
        const html = this.props.html;
        const $html = $(html);
        const $children = $html.find('subq');
        const parts = [];
        $children.each((i, child) => {
        	if(this.props.qs.get(i)){
        		const tags = this.props.qs.get(i).toJSON();
	            const isCurrent = this.props.currentSecIndex === i + 1;
	            parts.push(
	                <ItemSection
	                    key={i + 1} html={child.outerHTML} tags={tags} isCurrent={isCurrent}
	                    clickCallbackEvent={this.selectSection.bind(this, i + 1)}
	                    updateKtagEvent={this.props.updateKtagEvent.bind(null, i + 1)}
	                />
	            );
        	}
            
        });
        return parts;
    }
    getStem() {
        const html = this.props.html;
        const isCurrent = this.props.currentSecIndex === 0;
        const $html = $(html);
        if ($html.children().length === 1) {
            return null;
        }
        const $stem = $html.children()[0];
        return (
            <ItemSection
                key={0} html={$stem.outerHTML} tags={this.props.ktags.toJSON()}
                isCurrent={isCurrent} clickCallbackEvent={this.selectSection.bind(this, 0)}
                updateKtagEvent={this.props.updateKtagEvent.bind(null, 0)}
            />);
    }
    selectSection(index) {
        this.props.selectSection(index);
    }
    render() {
        return (
            <div>
                <div className="stem-section-wrapper">
                    {this.getStem()}
                </div>
                <div className="qs-sections-wrapper">
                    {this.getQsParts()}
                </div>
            </div>
        );
    }
}

class ItemSection extends React.Component {
    constructor(props) {
        super(props);
        this.setBind();
    }
    setBind() {
        this.clickHandler = this.clickHandler.bind(this);
    }
    clickHandler() {
        if (this.props.clickCallbackEvent) {
            this.props.clickCallbackEvent();
        }
    }
    render() {
        const html = this.props.html;
        const tags = this.props.tags;
        let className = "item-section";
        className += this.props.isCurrent ? " current-section" : "";
        return (
            <div className={className} onClick={this.clickHandler}>
                <HtmlWithTex html={html} className="part-wrapper" />
                <KTaggingInfoGroup tags={tags} updateKtagEvent={this.props.updateKtagEvent} />
            </div>
        );
    }
}

class KTaggingInfo extends React.Component {
    constructor(props) {
        super(props);
        this.setBind();
        this.cssMap = {
            1101: "text-primary",
            1102: "text-success",
            1103: "text-warning",
            1201: "text-danger",
            1888: "text-info"
        };
    }
    setBind() {
        this.removeTag = this.removeTag.bind(this);
        this.switchTagLevel = this.switchTagLevel.bind(this);
    }
    removeTag() {
        this.props.updateKtagEvent('remove', this.props.tag);
    }
    switchTagLevel() {
        this.props.updateKtagEvent('update', this.props.tag,
                                   { primary: !this.props.tag.primary });
    }
    render() {
        const tag = this.props.tag;
        let className = tag.primary ? 'primary-ktag' : 'sub-ktag';
        if (this.cssMap[tag.type]) {
            className += ` ${this.cssMap[tag.type]}`;
        }

        return (
            <li className="ktagginginfo-wrapper">
                <span className={className}>{tag.path}</span>
                <button
                    disabled={tag.auto}
                    className="btn btn-danger btn-xs pull-right" onClick={this.removeTag}
                >
                    <i className="glyphicon glyphicon-remove" />
                </button>
                <button
                    className="btn btn-success btn-xs pull-right" onClick={this.switchTagLevel}
                >
                    <i className="glyphicon glyphicon-sort" />
                </button>
            </li>
        );
    }
}

const KTaggingInfoGroup = function (props) {
    return (
        <div className="ktagginginfo-group">
            <ul>
                {
                    props.tags.map(tag =>
                        <KTaggingInfo
                            key={tag.id} tag={tag} updateKtagEvent={props.updateKtagEvent}
                        />
                    )
                }
            </ul>
        </div>
    );
};

class ItemCategory extends React.Component {
    constructor(props) {
        super(props);
        this.categories = [];
        this.changeHandler = this.changeHandler.bind(this);
    }
    changeHandler(evt) {
        this.props.callbackEvent(parseInt(evt.target.value, 10));
    }
    componentDidMount() {
        Q.get('/general/getDict',{query: {type: 4}})
            .done(data => {
                this.categories = data;
            })
    }
    render() {
        const categories = this.props.categories || [];
        return (
            <Row>
                <Col xs={1}>题类</Col>
                <Col xs={11}>
                    <Row>
                        {

                            this.categories.map(category =>
                                (<Col className="categories-label">
                                    <label key={category.code}>
                                        <input
                                            value={category.code} type="checkbox"
                                            checked={categories.indexOf(category.code) !== -1}
                                            onChange={this.changeHandler}
                                        />{category.name}
                                    </label>
                                </Col>)
                            )
                        }
                    </Row>

                </Col>
            </Row>
        );
    }
}

export class Difficult extends React.Component {
    constructor(props) {
        super(props)
        this.levels = [
            {
                val: 1,
                text: '极易',
                className: 'one'
            },
            {
                val: 2,
                text: '较易',
                className: 'two'
            },
            {
                val: 3,
                text: '中等',
                className: 'three'
            },
            {
                val: 4,
                text: '较难',
                className: 'four'
            },
            {
                val: 5,
                text: '极难',
                className: 'five'
            }
        ]
        this.currentLevel = this.levels.filter(val => val.val == this.props.level)[0]
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            level: nextProps.level
        })
    }
    state = {
        level: this.props.level
    }
    changeLevel(val) {
        this.currentLevel = val;
        this.setState({
            level: val.val
        }, () =>{
            this.props.callbackEvent(val.val)
        })
    }
    render() {
        let { level } = this.state;
        return (
           <Row middle="xs">
               <Col xs={1}>难度</Col>
               <Col xs={11}>
                   <Row center="xs" className="difficulty-wrap">
                       {
                           this.levels.map((val, index) => (
                               <Col xs key={`difficulty${index}`} onClick={e=>{ e.stopPropagation();this.changeLevel(val)}}>
                                   <div className={ `bar ${val.val <= level ? this.currentLevel.className : ''}`}></div>
                                   <div className={`desc ${val.val == level ? this.currentLevel.className: ''}`} >{val.text}</div>
                               </Col>
                               ))
                       }
                   </Row>
               </Col>
           </Row>
        )
    }
}


function AbilitiesGroup(props) {
    return (
        <div className="abilities-wrapper">
            <ul>
                {
                    props.data.map((item, index) =>
                        <li key={item.get('_id')} className="ability-item" >
                            <StarsGroup
                                label={`${item.get('name')}:`}
                                value={item.get('level')}
                                callbackEvent={score =>props.callbackEvent(item, score)}
                            />
                        </li>
                    )
                }
            </ul>
        </div>
    );
}
