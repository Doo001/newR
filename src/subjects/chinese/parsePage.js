import React from 'react'
import {setCurrentNav} from "js/item/common";
import ItemParsing from 'component/ItemParsing'
import { Q } from 'js/quantum';
import Type7001 from './type7001'
import Type7003 from './type7003'
import Type7004 from './type7004'
import Type7005 from './type7005'
import Type7009 from './type7009'
import Type6013 from './type6013'

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

        if (this.state.type === 6001||this.state.type === 6017||this.state.type === 6018) {
            return <Type7001 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 6002||this.state.type === 6004||this.state.type === 6023
            ||this.state.type === 6011||this.state.type === 6012||this.state.type === 6025) {
            return <Type7003 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 6019) {
            return <Type7004 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        }else if (this.state.type === 6006
            ||this.state.type === 6007||this.state.type === 6008||this.state.type === 6010
            ||this.state.type === 6014||this.state.type === 6016||this.state.type === 6024) {
            return <Type7004 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 6003||this.state.type === 6005||this.state.type === 6015
            ||this.state.type === 6009||this.state.type === 6022) {
            return <Type7009 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 6013) {
            return <Type6013 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        }else if (this.state.type === 7005) {
            return <Type7005 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else{
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

        if (this.state.type === 6001||this.state.type === 6017||this.state.type === 6018) {
            return <Type7001 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 6002||this.state.type === 6004||this.state.type === 6023
            ||this.state.type === 6011||this.state.type === 6012||this.state.type === 6025) {
            return <Type7003 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 6019) {
            return <Type7004 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        }else if (this.state.type === 6006
            ||this.state.type === 6007||this.state.type === 6008||this.state.type === 6010
            ||this.state.type === 6014||this.state.type === 6016||this.state.type === 6024) {
            return <Type7004 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 6003||this.state.type === 6005||this.state.type === 6015
            ||this.state.type === 6009||this.state.type === 6022) {
            return <Type7009 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else if (this.state.type === 6013) {
            return <Type6013 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        }else if (this.state.type === 7005) {
            return <Type7005 ref="inputZone" setGoodToLeave={this.setGoodToLeave} />;
        } else{
            return null;
        }
    }
}