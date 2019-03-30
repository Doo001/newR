import React from 'react';
import ReactDom from 'react-dom';
import Immutable from 'immutable';
import Q from 'js/quantum';
import $ from 'jquery';
import { HtmlWithTex } from 'js/widgets/html_with_tex';
import { makeWikiLink } from './common';
import { Row, Col } from 'react-flexbox-grid'

/* 给定一个id或kcode_render的item即可显示 */
export class ItemDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            item: props.item,
            showAuxiliary: props.auxiliary,
        };
    }

    componentDidMount() {
        if (this.state.item !== null) {
            return;
        }
        Q.get(`/api/item/${this.props.id}`,
              { query: { render_kcode: 1, with_tagging: 1 }, defaultFail: false })
            .done(item => this.setState(
                { item: Immutable.fromJS(item) },
                () => this.props.onLoaded && this.props.onLoaded(this)
            ))
            .fail((jqXHR, statusText) => this.setState(
                { error: Q.jsonedError(jqXHR, statusText).message },
                () => this.props.onLoaded && this.props.onLoaded(this)
            ))
        ;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.item !== null || this.state.item === null) {
            return;
        }
        // 只在实际题目挂载时处理
        $(ReactDom.findDOMNode(this)).on('click', 'wiki,a', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (event.target.tagName === 'WIKI') {
                window.open(makeWikiLink($(event.target).attr('data-name')));
            } else {
                window.open($(event.target).attr('href'));
            }
        });

        $(ReactDom.findDOMNode(this)).on('click', '.no-click', (event) => {
            event.stopPropagation();
        });

        if (this.props.auxiliaryToggleable) {
            $(ReactDom.findDOMNode(this)).on('click', () => {
                this.setState({ showAuxiliary: !this.state.showAuxiliary });
            });
        }
    }
    
    biaozhu(){
    	let volume=this.props.volume;
    	if(volume){
    		window.open(`/item/${this.state.item.get('_id')}/tag?volume_id=${volume.get("_id")}`)
    	}else{
    		window.open(`/item/${this.state.item.get('_id')}/tag`)
    	}
    }

    _renderGeneralInfo() {
        return (
            <div className="general-info">
                <span className="label label-default no-click code idSpan"> {this.state.item.get('_id')} </span>
                &nbsp;
                <span className="color-light no-click"> (boost:{this.state.item.get('boost')}) </span>
                &nbsp;
                <a href={`/item/${this.state.item.get('_id')}`}> 查看 </a>
                &nbsp;
                {this.props.volume? <a href={`/item/${this.state.item.get('_id')}/tag?volume_id=${this.props.volume.get('_id')}`}>标注</a>:<a href={`/item/${this.state.item.get('_id')}/tag`}>标注</a>}
                &nbsp;
                <a href={`/item/${this.state.item.get('_id')}/typeset`}> 排版 </a>
                &nbsp;
                <a href={`/item/${this.state.item.get('_id')}/cluster`}> 聚类 </a>
            </div>
        );
    }

    render() {
        if (this.state.error) {
            return <div className="error">{this.state.error}</div>;
        }
        if (!this.state.item) {
            return <div className="loading"></div>;
        }
        const itemData = this.state.item.get('data');
        const children = [];
        if (itemData.get('stem')) {
            children.push(<Article itemData={itemData} key='article' />);
        }
        children.push(
            <Questions
                qs={itemData.get('qs')} key='qs'
                difficulty={itemData.get('stem') ? 0 : itemData.get('difficulty')}
            />
        );

        const qClass = this.state.showAuxiliary ? 'with-auxiliary' : 'without-auxiliary';
        const extraClass = this.props.classNameFunc ? this.props.classNameFunc(this.state.item)
            : '';
        return (
            <div className={`item-display ${extraClass} ${qClass}`}>
                { this._renderGeneralInfo() }
                <q data-id={this.state.item.get('_id')} >
                    {children}
                </q>
            </div>
        );
    }
}

export default ItemDisplay;

ItemDisplay.defaultProps = {
    id: null,
    item: null,
    auxiliary: false,
    auxiliaryToggleable: true,
    onLoaded: null,
};

function Article({ itemData }) {
    const auxiliaries = [];
    if (itemData.get('difficulty') > 0) {
        auxiliaries.push((
            <DifficultyAuxiliary difficulty={itemData.get('difficulty')} key='difficulty' />
        ));
    }
    if (itemData.get('ktags') > 0) {
        auxiliaries.push((
            <TaggingAuxiliary ktags={itemData.get('ktags')} key='tags' />
        ));
    }
    let auxiliary = null;
    if (auxiliaries.length > 0) {
        auxiliary = (
            <div className="auxiliary" key="auxiliary">
                {auxiliaries}
            </div>
        );
    }
    return (
        <div className="article-container">
            <KcodedText html={itemData.get('stem')} tag='stem' key="stem" />
            {auxiliary}
        </div>
    );
}

function Questions(props) {
    const numbered = props.qs.size > 1;
    const qs = props.qs.map((q, index) => {
        const tag = React.createFactory(numbered ? 'li' : 'div');
        return tag({ className: "qcontainer leaf-q", key: index },
            <Question q={q} index={index} difficulty={props.difficulty} />);
    });
    if (numbered) {
        return (<subqs> <ol> {qs} </ol> </subqs>);
    } else {
        return (<subqs> {qs} </subqs>);
    }
}

function Question({ q, index, difficulty }) {
    const children = [];
    if (q.get('desc')) {
        children.push(<KcodedText tag="stem" html={q.get('desc')} key='desc' />);
    }
    if (q.get('opts').size > 0) {
        children.push(<Opts opts={q.get('opts')} key='opts' />);
    }

    const auxiliaries = [];

    if (index === 0 && difficulty > 0) {
        auxiliaries.push((
            <DifficultyAuxiliary difficulty={difficulty} key='difficulty' />
        ));
    }
    if (q.get('ktags')) {
        auxiliaries.push(<TaggingAuxiliary ktags={q.get('ktags')} key='tagging' />);
    }

    const titles = {
        ans: '答案:',
        exp: '解析:',
        step: '备注:',
    };

    ['ans', 'exp', 'step'].forEach((key) => {
        const value = q.get(key);
        if (value) {
            auxiliaries.push(
                <div className={key} key={key}>
                    <div className="dt">{titles[key]}</div>
                    <KcodedText className="dd" html={value} />
                </div>
            );
        }
    });

    if (auxiliaries.length > 0) {
        children.push(<div className="auxiliary" key="auxiliary">{auxiliaries}</div>);
    }
    return (<subq> {children} </subq>);
}

function Opts(props) {
    let optClass = '';
    // fast estimate
    if (props.opts.every(opt => opt.length < 15)) {
        optClass = 'col-xs-3';
    } else if (props.opts.every(opt => opt.length < 30)) {
        optClass = 'col-xs-6';
    }
    const children = props.opts.map((opt, index) => {
        return (
            <opt className={`opt ${optClass}`} key={index} >
                <span className="opt-label">
                    {String.fromCharCode('A'.charCodeAt(0) + index)}.&nbsp;
                </span>
                <KcodedText className="opt-text" html={opt} tag='span' />
            </opt>
        );
    });
    return (<opts className="opts"> {children} </opts>);
}

function KcodedText(props) {
    return <HtmlWithTex {...props} />;
}

function TaggingAuxiliary({ ktags }) {
    return (
        <div className={'tagging'}>
            <div className="dt">标注:</div>
            <div className="dd">
                <Ktags ktags={ktags} />
            </div>
        </div>
    );
}

function Ktags({ ktags }) {
    return (
        <ul className="ktags" style={{padding:0}}>
            {ktags.map((tag) => {
                let className = "ktag";
                if (tag.get('primary')) {
                    className = `${className} primary`;
                } else {
                    className = `${className} sub`;
                }
                return (
                    <li key={tag.get('id')} className={className} >
                        <KtagPath path={tag.get('path')} />
                        &nbsp;&nbsp;
                        <span className="ktag-id no-click code" > ({tag.get('id')}) </span>
                        <br/>
                    </li>
                );
            })}
        </ul>
    );
}

function KtagPath({ path }) {
    if(path.size!=0){
        var components = [<span className="ktag-name" key='1'>{path.get(0).get('name')}</span>];
    }

    for (let i = 1; i < path.size; ++i) {
        components.push(<span className="ktag-sep" key={i * 2}>&gt;</span>);
        components.push(
            <span className="ktag-name" key={(i * 2) + 1}>{path.get(i).get('name')}</span>
        );
    }
    return (
        <div className="ktag-path" style={{'float':'left'}}>
            {components}
        </div>
    );
}

function DifficultyAuxiliary({ difficulty }) {
    const stars = Immutable.Range(0, difficulty).map((index) => {
        return <span className="glyphicon glyphicon-star" key={index} />;
    }).toList();
    let widthCenter=difficulty*20+'%';
    let backCenter='#71CAFF';
    if(difficulty==1){
    	backCenter='#71CAFF';
    }else if(difficulty==2){
    	backCenter='#5FD566';
    }else if(difficulty==3){
    	backCenter='#FFD343';
    }else if(difficulty==4){
    	backCenter='#FFA769';
    }else if(difficulty==5){
    	backCenter='#EF7887';
    }
    return (
        <div className={'difficulty'}>
            <div className="dt" style={{
            	'padding':0,  
            	'fontSize': '15px',
                'fontFamily': 'PingFangSC-Regular',
                'fontWeight': 400,
                'color': 'rgba(54,50,49,1)'
            }}>难度:</div>
            <div className="dd" style={{
            	'flex': 'initial',
                'width': '100%'
            }}>
            	<p className="lineBox" style={{
            		'width': '100%',
                    'height': '4px',
                    'background':'rgba(233,233,233,1)',
                    'position': 'relative',
                    'boxSizing': 'border-box'
            	}} ><p className="lineCenter" style={{
            		'width':widthCenter,
            		'position': 'absolute',
                    'height': '4px',
                    'background': backCenter,
            	
            	}}></p></p>
            	<div className="lineDetail" style={{
            		'fontSize':'10px',
                    'fontFamily':'PingFangSC-Regular',
                    'fontWeight':400,
                    'color':'rgba(210,210,210,1)'
            	}}>
            		<div style={{ 
            			'width': '20%',
                        'textAlign': 'center',
                        'float': 'left',
            			color:difficulty==1?backCenter:'#d2d2d2'
            		}}>极易</div>
            		<div style={{
            			'width': '20%',
                        'textAlign': 'center',
                        'float': 'left',
            			color:difficulty==2?backCenter:'#d2d2d2'
            		}}>较易</div>
            		<div style={{
            			'width': '20%',
                        'textAlign': 'center',
                        'float': 'left',
            			color:difficulty==3?backCenter:'#d2d2d2'
            		}}>中等</div>
            		<div style={{
            			'width': '20%',
                        'textAlign': 'center',
                        'float': 'left',
            			color:difficulty==4?backCenter:'#d2d2d2'
            		}}>较难</div>
            		<div style={{
            			'width': '20%',
                        'textAlign': 'center',
                        'float': 'left',
            			color:difficulty==5?backCenter:'#d2d2d2'
            		}}>极难</div>
            	</div>
            </div>
        </div>
    );
}
