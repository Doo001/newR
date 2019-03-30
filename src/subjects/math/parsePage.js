import React from 'react'
import {setCurrentNav} from "../../js/item/common";
import ItemParsing from 'component/ItemParsing'
import { setNavBar, NavItem } from 'js/nav';
import { Q } from 'js/quantum';
import Type1001 from './type1001'
import Type1002 from './type1002'
import Type1005 from './type1005'
import Type1007 from './type1007'

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
        if (this.state.type === 1001) {
            return <Type1001 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 1002||this.state.type === 1004) {
            return <Type1002 ref="inputZone"  setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 1003 || this.state.type === 1008) {
            return <Type1005 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 1005||this.state.type === 1006) {
            return <Type1005 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 1007 || this.state.type === 1009 || this.state.type === 1010) {
            return <Type1007 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
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
        if (this.state.type === 1001) {
            return <Type1001 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 1002||this.state.type === 1004) {
            return <Type1002 ref="inputZone"  setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 1003 || this.state.type === 1008) {
            return <Type1005 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 1005||this.state.type === 1006) {
            return <Type1005 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 1007 || this.state.type === 1009 || this.state.type === 1010) {
            return <Type1007 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else {
            return null;
        }
    }
}