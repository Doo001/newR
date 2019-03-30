import React from 'react'
import {setCurrentNav} from "../../js/item/common";
import ItemParsing from 'component/ItemParsing'
import { Q } from 'js/quantum';
import Type9001 from './type9001'
// import Type9002 from './type9002'
import Type9003 from './type9003'
import Type9004 from './type9004'
import Type9005 from './type9005'
// import Type9006 from './type9006'
// import Type9007 from './type9007'
// import Type9008 from './type9008'
import Type9009 from './type9009'

export default class ItemParsingPage extends ItemParsing {
    constructor(props) {
        super(props)
    }
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
            setNavBar(navItems, '创建');
        })
    }
    componentDidMount() {
//      setCurrentNav('创建', null);

        // $(window).on('beforeunload.parsing-page', () => {
        //     if (!this.gGoodToLeave) {
        //         return "题目尚未保存，确认离开此页面？";
        //     } else {
        //         return undefined;
        //     }
        // });
    }
    
    clear(){
    	this.refs.inputZone.clear();
    }

    _renderInputZone() {
        if (this.state.type === 9001||this.state.type === 9002) {
            return <Type9001 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 9003) {
            return <Type9003 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 9004) {
            return <Type9004 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 9007||this.state.type === 9008) {
            return <Type9004 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 9009) {
            return <Type9009 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 9005) {
            return <Type9005 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;


        } else {
            return null;
        }
    }
}


export class PageModal extends ItemParsing {
    constructor(props) {
        super(props)
    }
    clear(){
    	this.refs.inputZone.clear();
    }

    _renderInputZone() {
        if (this.state.type === 9001||this.state.type === 9002) {
            return <Type9001 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 9003) {
            return <Type9003 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 9004) {
            return <Type9004 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 9007||this.state.type === 9008) {
            return <Type9004 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 9009) {
            return <Type9009 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 9005) {
            return <Type9005 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;


        } else {
            return null;
        }
    }
}