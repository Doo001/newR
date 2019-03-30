import React from 'react'
import {setCurrentNav} from "js/item/common";
import ItemParsing from 'component/ItemParsing'
import { Q } from 'js/quantum';
import Type4001 from './type4001'
import Type4002 from './type4002'
import Type4003 from './type4003'
import Type4004 from './type4004'
import Type4005 from './type4005'

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
        // setCurrentNav('创建', null);

        /*$(window).on('beforeunload.parsing-page', () => {
            if (!this.gGoodToLeave) {
                return "题目尚未保存，确认离开此页面？";
            } else {
                return undefined;
            }
        });*/
    }
    
    clear(){
    	this.refs.inputZone.clear();
    }

    _renderInputZone() {
        if (this.state.type === 4001) {
            return <Type4001 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 4002) {
            return <Type4002 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 4003) {
            return <Type4003 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 4004) {
            return <Type4004 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 4005) {
            return <Type4005 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        }else {
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
        if (this.state.type === 4001) {
            return <Type4001 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 4002) {
            return <Type4002 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 4003) {
            return <Type4003 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 4004) {
            return <Type4004 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 4005) {
            return <Type4005 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        }else {
            return null;
        }
    }
}