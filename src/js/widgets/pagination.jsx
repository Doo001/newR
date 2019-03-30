import React from 'react';
import ReactDom from 'react-dom';
import $ from 'jquery';
import './jquery.twbsPagination';

export const DEFAULT_PAGE_NO = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 999999;

export default class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.setBind();
    }
    componentDidMount() {
        this.showPaginations(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.showPaginations(nextProps);
    }
    shouldComponentUpdate() {
        return false;
    }
    setBind() {
        this.selectPage = this.selectPage.bind(this);
    }
    showPaginations(props) {
        if (props.isPagination) {
            return;
        }
        const $page = $(ReactDom.findDOMNode(this));
        $page.twbsPagination('destroy');
        if (props.totalPages) {
            $page.twbsPagination({
                totalPages: props.totalPages,
                first: "首页",
                last: "尾页",
                prev: "&laquo;",
                next: "&raquo;",
                startPage: props.pageNo || 1,
                initiateStartPageClick: false,
                onPageClick: this.selectPage,
            });
        }
    }
    selectPage(evt, page) {
        this.props.paginateCallback(page);
    }
    render() {
        return (
            <div style={{ display: "inline-block" }} />
        );
    }
}
