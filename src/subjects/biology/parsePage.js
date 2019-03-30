import React from 'react'
import {setCurrentNav} from "js/item/common";
import ItemParsing from 'component/ItemParsing'
import { Q } from 'js/quantum';
import Type3001 from './type3001'
import Type3002 from './type3002'
import Type3003 from './type3003'
import Type3004 from './type3004'
import Type3005 from './type3005'

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
        if (this.state.type === 3001) {
            return <Type3001 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 3002) {
            return <Type3002 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 3003) {
            return <Type3003 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 3004) {
            return <Type3004 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 3005) {
            return <Type3005 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
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
        if (this.state.type === 3001) {
            return <Type3001 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 3002) {
            return <Type3002 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 3003) {
            return <Type3003 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 3004) {
            return <Type3004 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 3005) {
            return <Type3005 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        }else {
            return null;
        }
    }
}