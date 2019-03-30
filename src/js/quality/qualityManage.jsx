import React from 'react';
import { Q, Edu, EduDesc } from 'js/quantum';
import { setNavBar, NavItem } from 'js/nav';
import Global from 'global';


export default class qualityManage extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        // const navItems = [new NavItem('查询', '/item_search'),new NavItem('创建', '/item/parse'),new NavItem('标注', '/item/review?review=tag'),new NavItem('复标', '/item/review?review=tag&subreview=retag'),new NavItem('审核', '/item/review?review=typeset')];
        // setNavBar(navItems, '查询');
    }

    render() {
        return (<h2>内容正在建设中</h2>);
    }
}
