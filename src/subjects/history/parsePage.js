import React from 'react'
import {setCurrentNav} from "../../js/item/common";
import ItemParsing from 'component/ItemParsing'
import { Q } from 'js/quantum';
import Type7001 from './type7001'
// import Type7002 from './type7002'
import Type7003 from './type7003'
import Type7004 from './type7004'
import Type7005 from './type7005'
// import Type7006 from './type7006'
// import Type7007 from './type7007'
// import Type7008 from './type7008'
import Type7009 from './type7009'

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
        if (this.state.type === 7001||this.state.type === 7002) {
            return <Type7001 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 7003) {
            return <Type7003 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 7004) {
            return <Type7004 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 7007||this.state.type === 7008) {
            return <Type7004 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 7009) {
            return <Type7009 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 7005) {
            return <Type7005 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;


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
        if (this.state.type === 7001||this.state.type === 7002) {
            return <Type7001 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 7003) {
            return <Type7003 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 7004) {
            return <Type7004 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 7007||this.state.type === 7008) {
            return <Type7004 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 7009) {
            return <Type7009 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 7005) {
            return <Type7005 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;


        } else {
            return null;
        }
    }
}