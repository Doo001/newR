import React from 'react';
import Immutable from 'immutable';
import {Link} from 'react-router'
import { Q, Grade, DEFAULT_PROVINCE_LIST } from 'js/quantum';

// import axios from './utils/api'
import { setCurrentNav } from 'js/paper/common';
import { setNavBar, NavItem } from 'js/nav';
import { Row, Col } from 'react-flexbox-grid'
import Select, {Option, OptGroup} from 'rc-select';
import Pagination from 'component/pagination';

export class OmegaPaperList extends React.Component {
    constructor(props) {
        super(props);
        this.provinces = {};
        this.years = []
        for(let i= new Date().getFullYear(); i > 2000; i--) {
            this.years.push({
                name:i,
                val:i
            })
        }
        this.years.unshift({ name: '所有', val: 0})
        this.state = {
            papers: [],
            year: 0, //new Date().getFullYear(),
            term: 0,
            source: 0,
            province: '',
            city: '',
            review: '0',
            pageIndex: 1,
            totalCount : 0,
            pageSize : 10
        };
        this.terms = [];
        this.sources = [];
        this.reviews = [];
        this.cities = [];
        this.termMap = {};
        this.sourceMap = {};
        this.reviewMap = {};

        this.pageIndex = 1;
    }

    componentDidMount() {
        setNavBar([
            new NavItem('创建', '/paper/create'),
            new NavItem('列表', '/omega_papers'),
        ], '列表');
        //这是获取学期
        let term = Q.get('/general/getDict', {query: {type: 1}})
        //这是来源
        let source = Q.get('/general/getDict', {query: {type: 2}})
        //这是试卷类型
        let cities = Q.get('/general/getCity')
        $.when(term, source, cities)
            .done((terms, sources, cities) => {
                this.terms = terms;
                this.sources = sources;
                this.cities = cities;
                this.terms.unshift({
                    code: 0,
                    name: '所有'
                })
                this.sources.unshift({
                    code: 0,
                    name: '所有'
                })
                this.terms.forEach(term => {
                    this.termMap[term.code] = term
                })
                this.sources.forEach(source => {
                    this.sourceMap[source.code] = source
                })
                this.cities.forEach(val => {
                    this.provinces[val.province_name] = val.city;
                })
                this.onFilterChange({
                    year: 0,
                    term: 0,
                    source: 0,
                    province: '',
                    city: '',
                    review: 0,
                    pageIndex: 1
                })
            })
        this.reviewMap = {
            0 : {code : 0, name : '所有'},
            1 : {code : 1, name : '待录排'},
            2 : {code : 2, name : '录排中'},
            3 : {code : 3, name : '已录排'}
        }



    }

    onFilterChange = (query) =>{
        let url = `/api/paper/paper_list?year=${query.year==0?'':query.year}&term=${query.term==0?'':query.term}&source=${query.source==0?'':query.source}&province=${encodeURIComponent(query.province)}&city=${encodeURIComponent(query.city)}&review=${query.review == 0?'':query.review}&page_no=${query.pageIndex}&page_size=12`;

        Q.get(`${url}` )
        .done((json) => {
            this.setState({
                papers: json.results, //Immutable.fromJS(json.results),
                pageIndex: json.page_no,
                pageSize: json.page_size,
                totalCount: json.total
            });
         }, ()=>{
             console.log(this.state.papers)
         })
        .fail((error)=>{
            console.log(error);
        });
    }

    createPaper(event) {
        event.preventDefault();
        Q.put('/api/omega_papers', { json: {
                name: '',
                year: new Date().getFullYear(),
                edu: Global.user.edu,
                grade: Grade.kSenior_3,
                cat: '',
                doc: '',
                deleted: false,
                districts: [],
                term: parseInt(Global.user.edu*10+1),
                source: 2,
                province: [],
                city: [],
                categories: [],
                pdf: '',
                item_ids: [],
            } })
            .done((paper) => {
                location.href = `/omega_paper/${paper._id}`;
            })
        ;
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.terms.length && nextProps.sources.length && nextProps.cities.length) {
        //     nextProps.cities.forEach(val => {
        //         this.provinces[val.province_name] = val.city
        //     })
        // }
    }
    changeYear = (value) => {
        this.setState({
            year: value,
            pageIndex: 1
        }, () => {
            this.onFilterChange(this.state);
            // this.browserPush(true);
        })

    }
    changeTerm = (value) => {
        this.setState({
            term: value,
            pageIndex: 1
        }, () => {
            this.onFilterChange(this.state);
            // this.browserPush(true);
        })

    }
    changeSource = (value) => {
        this.setState({
            source: value,
            pageIndex: 1
        }, () => {
            this.onFilterChange(this.state);
            // this.browserPush(true);
        })
    }
    changeProvince = (value) => {
        this.setState({
            province: value,
            city: '',
            pageIndex: 1
        }, () => {
            this.onFilterChange(this.state);
            // this.browserPush(true);
        })
    }
    changeCity = value => {
        this.setState({
            city: value,
            pageIndex: 1
        }, () => {
            this.onFilterChange(this.state);
            // this.browserPush(true);
        })
    }
    filterStatus = (value) => {
        this.setState({
            review: value,
            pageIndex: 1
        }, () => {
            this.onFilterChange(this.state);
            // this.browserPush(true);
        })
    }
    changeStatus = (paper)=> {//1 待录排，2 录排中，3 已录排
        if(paper.review == 1){
            Q.post(`/api/paper/lock_paper/${paper._id}`)
                .done((result) => {
                    if(result==1){//对其操作的账号
                        //goto 录排页面
                       this.props.router.push(`/omega_paper/${paper._id}`);
                    }else{
                        return;
                    }
                });
        } else if(paper.review == 2){
            Q.post(`/api/paper/lock_paper/${paper._id}`)
                .done((result) => {
                    if(result==1){//对其操作的账号
                        //goto 录排页面
                        this.props.router.push(`/omega_paper/${paper._id}`);
                    }else{
                        return;
                    }
                })
        } else if(paper.review == 3){
            //goto 录排预览页
            this.props.router.push(`/omega_paper/${paper._id}`);
        }
    }

    /*换页*/
    handlePageChange = (num)=> {
        this.state.pageIndex=num;
        this.onFilterChange(this.state);
    }
    browserPush(pageReset = false) {
        if (pageReset) {
            delete this.query.page_no;
        }
        this.props.history.push({pathname: this.props.location.pathname});
    }

    render() {
        let { year, term, source, province, city, review, pageIndex} = this.state;
        let provinceOpt = [];
        for (let key in this.provinces) {
            provinceOpt.push(<Option key={key} value={key}>{key}</Option>)
        }
        provinceOpt.unshift(<Option key={'provinceAll'} value={""}>所有</Option>)
        let cities =  province ? this.provinces[province]: []
        let cityList = cities.map((item, index) => (<Option key={`city${index}`} value={item.city_name}>{item.city_name}</Option>))
        cityList.unshift(<Option key={'cityAll'} value={""}>所有</Option>)
        return (
            <div id="paperList" className="paperList">
                <Row className="container-list">
                    <Col className="container-col">
                        <Row className="filter-row">
                            <Col xs={2}>
                                <label style={{'marginRight': '10px'}}>年份</label>
                                <Select style={{ width: "50%" }} onChange={this.changeYear} showSearch={false} optionLabelProp="children" value={year}>
                                    {
                                        this.years.map((item, index) => (<Option key={`year${index}`} value={item.val}>{item.name}</Option>))
                                    }
                                </Select>
                            </Col>
                            <Col xs={2}>
                                <label style={{'marginRight': '10px'}}>学期</label>
                                <Select style={{ width: "50%" }} onChange={this.changeTerm} showSearch={false} optionLabelProp="children" value={term}>
                                    {
                                        this.terms.map((item, index) => (<Option key={`term${index}`} value={item.code}>{item.name}</Option>))
                                    }
                                </Select>
                            </Col>
                            <Col xs={2}>
                                <label style={{'marginRight': '10px'}}>来源</label>
                                <Select style={{ width: "50%" }} onChange={this.changeSource} showSearch={false} optionLabelProp="children" value={source}>
                                    {
                                        this.sources.map((item, index) => (<Option key={`source${index}`} value={item.code}>{item.name}</Option>))
                                    }
                                </Select>
                            </Col>
                            <Col xs={2}>
                                <label style={{'marginRight': '10px'}}>省份</label>
                                <Select style={{ width: "60%" }} onChange={this.changeProvince} showSearch={false} optionLabelProp="children" value={province}>
                                    {
                                        provinceOpt
                                    }
                                </Select>
                            </Col>
                            <Col xs={2}>
                                <label style={{'marginRight': '10px'}}>城市</label>
                                <Select style={{ width: "60%" }} onChange={this.changeCity} showSearch={false} optionLabelProp="children" value={city}>
                                    {
                                        cityList
                                    }
                                </Select>
                            </Col>
                        </Row>
                        <Row className="titles">
                            <table className="tablepaper">
                                <thead>
                                <tr>
                                    <th width="10%"> 序号 </th>
                                    <th width="35%"> 名称 </th>
                                    <th width="10%"> 年份 </th>
                                    <th width="15%"> 学期 </th>
                                    <th width="20%"> 来源 </th>
                                    <th width="10%">
                                        <Select style={{ width: "60%" }} onChange={this.filterStatus} showSearch={false} optionLabelProp="children" value={review}>
                                            <Option key="status0" value='0'>所有</Option>
                                            <Option key="status1" value='1'>待录排</Option>
                                            <Option key="status2" value='2'>录排中</Option>
                                            <Option key="status3" value='3'>已录排</Option>
                                        </Select>
                                    </th>
                                </tr>
                                </thead>
                            </table>
                        </Row>
                        <Row className="content">
                            <table className="tablepaper table-hover">

                                <tbody>
                                { this.state.papers.length>0 && this.state.papers.map((paper, index) =>
                                    <tr data-id={paper._id} >
                                        <td width="10%"> {index + 1} </td>
                                        <td width="35%" className="paperName" title={paper.name}> {paper.name.length>30?paper.name.substr(0,30)+"...":paper.name}</td>
                                        <td width="10%"> {paper.year==0?'':paper.year} </td>
                                        <td width="15%"> {paper.term == 0 ? '无': this.termMap[paper.term].name} </td>
                                        <td width="20%"> {paper.source == 0 ? '无': this.sourceMap[paper.source].name } </td>
                                        <td width="10%" className={paper.review == 2 ? "statusBlack" : "statusBlue"}>
                                            <span onClick={(e)=>{e.stopPropagation();this.changeStatus(paper)}}>{paper.review == 0 ? '无' : this.reviewMap[paper.review].name} </span>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>

                        </Row>
                        <Row className="pagenation">
                            <Pagination changePage={this.handlePageChange} current={pageIndex} count={5}
                                        total={Math.ceil(this.state.totalCount / this.state.pageSize)}></Pagination>
                        </Row>
                     </Col>
                </Row>
                <div className="lastTilBox">
                    <p className="p1">© 优能中学教育</p>
                    <p className="p2">(Release: dev, Git Version: 278f7e22)</p>
                    <p className="p3">建议您使用360、Google Chrome，分辨率1280*800及以上浏览本网站，获得更好用户体验</p>
                </div>
            </div>
        );
    }
}


export default OmegaPaperList;