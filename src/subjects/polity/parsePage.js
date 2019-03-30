import React from 'react'
import {setCurrentNav} from "js/item/common";
import ItemParsing from 'component/ItemParsing'
import { Q } from 'js/quantum';
import Type8001 from './type8001'
import Type8003 from './type8003'
import Type8004 from './type8004'
import Type8005 from './type8005'
import Type8009 from './type8009'

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
        if (this.state.type === 8001||this.state.type === 8002) {
            return <Type8001 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 8003) {
            return <Type8003 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 8004) {
            return <Type8004 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 8007||this.state.type === 8008) {
            return <Type8004 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 8009) {
            return <Type8009 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 8005) {
            return <Type8005 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
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
        if (this.state.type === 8001||this.state.type === 8002) {
            return <Type8001 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 8003) {
            return <Type8003 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 8004) {
            return <Type8004 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 8007||this.state.type === 8008) {
            return <Type8004 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 8009) {
            return <Type8009 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 8005) {
            return <Type8005 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else {
            return null;
        }
    }
}