import React from 'react';
import Immutable from 'immutable';
import { setNavBar, NavItem } from 'js/nav';
import { Q, Qdate } from 'js/quantum';
import Pagination, { DEFAULT_PAGE_NO, DEFAULT_PAGE_SIZE } from 'js/widgets/pagination';
import "css/main.scss";

import { docStatus } from './doc_view';

export class DocListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page_no: DEFAULT_PAGE_NO,
            page_size: DEFAULT_PAGE_SIZE,
            total: 0,
            docs: Immutable.List(),
        };
    }

    componentDidMount() {
        setCurrentNav('已上传');
        this.search();
    }

    onPageNoChange(pageNo) {
        this.setState({ page_no: pageNo });
        this.search();
    }

    search() {
        Q.get(
            '/api/docs',
            {
                query: {
                    page_no: this.state.page_no,
                    page_size: this.state.page_size,
                },
            })
         .done((page) => {
             this.setState({
                 total: page.total,
                 docs: Immutable.fromJS(page.results),
             });
         });
    }

    render() {
        return (
            <div id="doc-list-page" className="flex-column">
                <div className="doc-list">
                    <DocList docs={this.state.docs} />
                </div>
                <Pagination
                    pageNo={this.state.page_no}
                    totalPages={Math.ceil(this.state.total / this.state.page_size)}
                    paginateCallback={pageNo => this.onPageNoChange(pageNo)}
                />
            </div>
        );
    }
}

function DocList(props) {
    return (
        <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th width="5%"> 序号 </th>
                    <th width="20%"> ID </th>
                    <th width="40%"> 名称 </th>
                    <th width="15%"> 上传时间 </th>
                    <th width="15%"> 状态 </th>
                </tr>
            </thead>
            <tbody>
                { props.docs.map((doc, index) =>
                    <DocRow doc={doc} index={index} key={index} />) }
            </tbody>
        </table>
    );
}

function DocRow(props) {
    return (
        <tr data-id={props.doc.get('_id')} className={props.doc.get('deleted') ? 'strikeout' : ''}>
            <td> {props.index + 1} </td>
            <td className="code"> {props.doc.get('_id')} </td>
            <td>
                <a href={`/doc/${props.doc.get('_id')}`}>
                    {props.doc.get('title') || '<EMPTY TITLE>'}
                </a>
            </td>
            <td> {Qdate.datetimeFormat(1000 * props.doc.get('ctime'))} </td>
            <td> {docStatus(props.doc.get('status'))} </td>
        </tr>
    );
}

function setCurrentNav(current) {
    const navItems = [
        new NavItem('录入', '/volume/input'),
        new NavItem('已录入', '/volumes'),
        new NavItem('上传Doc', '/doc/input'),
        new NavItem('已上传', '/docs'),
    ];
    setNavBar(navItems, current);
}
