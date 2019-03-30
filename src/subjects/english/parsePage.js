import React from 'react'
import {setCurrentNav} from "js/item/common";
import ItemParsing from 'component/ItemParsing'
import { Q } from 'js/quantum';
import Type1001 from './type1001'
import Type1002 from './type1002'
import Type1003 from './type1003'
import Type5002 from './type5002'
import Type5004 from './type5004'
import Type5005 from './type5005'
import Type5006 from './type5006'
import Type5007 from './type5007'
import Type5008 from './type5008'
import Type5009 from './type5009'
import Type5010 from './type5010'
import Type5012 from './type5012'
import Type5013 from './type5013'

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
        if (this.state.type === 1001 || this.state.type === 5001) {
            return <Type1001 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 1002 || this.state.type === 5003) {
            return <Type1002 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type  === 5012) {
            return <Type5012 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        }else if (this.state.type === 1003) {
            return <Type1003 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 5002) {
            return <Type5002 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 5008) {
            return <Type5008 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 5005 || this.state.type === 5011) {
            return <Type5005 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 5009) {
            return <Type5009 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 5004) {
            return <Type5004 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 5006) {
            return <Type5006 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 5007) {
            return <Type5007 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 5010) {
            return <Type5010 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 5013) {
            return <Type5013 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
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
        if (this.state.type === 1001 || this.state.type === 5001) {
            return <Type1001 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 1002 || this.state.type === 5003) {
            return <Type1002 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type  === 5012) {
            return <Type5012 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        }else if (this.state.type === 1003) {
            return <Type1003 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 5002) {
            return <Type5002 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 5008) {
            return <Type5008 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 5005 || this.state.type === 5011) {
            return <Type5005 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 5009) {
            return <Type5009 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 5004) {
            return <Type5004 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 5006) {
            return <Type5006 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 5007) {
            return <Type5007 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 5010) {
            return <Type5010 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else if (this.state.type === 5013) {
            return <Type5013 ref="inputZone" setGoodToLeave={this.setGoodToLeave}/>;
        } else {
            return null;
        }
    }
}