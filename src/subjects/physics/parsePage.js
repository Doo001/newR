import React from 'react'
import {setCurrentNav} from "js/item/common";
import ItemParsing from 'component/ItemParsing'
import { Q } from 'js/quantum';
import Type2001 from './type2001'
import Type2002 from './type2002'
//import Type2003 from './type2003'
import Type2004 from './type2004'
//import Type2011 from './type2011'
import Type2012 from './type2012'
import Type2013 from './type2013'

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
        if (this.state.type === 2001 || this.state.type == 2005) {
            return <Type2001 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 2002) {
            return <Type2002 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 2003 || this.state.type === 2004 || this.state.type === 2006  || this.state.type === 2007 || this.state.type === 2008 ) {
            return <Type2004 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 2011) {
            return <Type2004 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 2012) {
            return <Type2012 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 2013) {
            return <Type2013 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;


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
        if (this.state.type === 2001 || this.state.type == 2005) {
            return <Type2001 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 2002) {
            return <Type2002 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 2003 || this.state.type === 2004 || this.state.type === 2006  || this.state.type === 2007 || this.state.type === 2008 ) {
            return <Type2004 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 2011) {
            return <Type2004 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 2012) {
            return <Type2012 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 2013) {
            return <Type2013 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;


        } else {
            return null;
        }
    }
}
