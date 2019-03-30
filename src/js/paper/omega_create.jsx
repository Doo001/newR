import React from 'react';
import Immutable from 'immutable';
import {Q, Grade} from 'js/quantum';
import $ from 'jquery';
import {Provider} from 'react-redux'
import {ItemTypeDesc} from 'js/subjects';
import {ItemDisplay} from 'js/item/display';
import {uploadFile} from 'js/widgets/uploader';
import {ItemSearchPanel} from 'js/item/search';
import { setNavBar, NavItem } from 'js/nav';
import {ModalHeader, ModalBody, ModalFooter, ModalSingle} from './modal';
import { showAlertModal } from 'js/widgets/alertModal'
import "css/main.scss";
import {store} from "js/main_entry";
import { Row, Col } from 'react-flexbox-grid'
import './css/omega_view.scss'
import {showAlert} from 'js/widgets/alert';
import axios from 'js/utils/api'
// import { Upload } from 'rctui'
export class OmegaPaperCreate extends React.Component {
    constructor(props) {
        super(props)
        this.terms = [];
        this.sources = [];
        this.categories = [];
        this.provinces = {};
        this.years = [{name:'',val:0}];
        for(let i= new Date().getFullYear(); i > 2000; i--) {
            this.years.push({
                name:i,
                val:i
            })
        }
        this.state = {
            name: '',
            "year":0,   //年份
            "term":0,  //学期
            "source":0,   //来源
            "province":[""],    //省
            "city":[""],        //市
            "categories":[],       //类型
            paper: {},
            ajaxing: false,
            doc_name: '',
            pdf_name: '',
            "doc_file": '',         //文件
            "pdf_file": ''
        // edu: Global.user.edu
        };
    }

    // redirect(reviewProps) {
    //     let edu = Math.floor(this.props.paper.grade / 10)
    //     Q.get(`/item/review?review=${reviewProps}&paper_id=${this.props.paper._id}&edu=${edu}`).done(data => {
    //         if (data) {
    //             window.location.href = data;
    //         }
    //     })
    // }

    componentDidMount() {
        setNavBar([
            new NavItem('创建', '/paper/create'),
            new NavItem('列表', '/omega_papers'),
        ], '创建')
        //这是获取学期
        let term = Q.get('/general/getDict', {query: {type: 1}})
        //这是来源
        let source = Q.get('/general/getDict', {query: {type: 2}})
        //这是试卷类型
        let categories = Q.get('/general/getDict', {query: {type: 3}})
        let cities = Q.get('/general/getCity')
        $.when(term, source, categories, cities)
            .done((terms, sources, categories, cities) => {
                this.terms = [{name:'', code:0}].concat(terms);
                this.sources = [{name:'', code:0}].concat(sources);
                this.categories = categories;
                cities.forEach(val => {
                    this.provinces[val.province_name] = val.city
                })
                this.forceUpdate()
            })
    }

    changeForm = (name, val) => {
        this.setState({
            name: val
        })
    }
    changeYear = e => {
        this.setState({
            year:  e.target.value
        })
    }
    changeProvince = (e)=>{
        let vals =  Array.prototype.filter.call(e.target.options, (item)=>item.selected).map(item => item.value)
        if (vals.length >1) {//选了
            this.setState({'city': []});
        }
        this.state.city = [];
        this.setState({
            province: Immutable.List(vals)
        })
    }
    changeCity =(e)=> {
        let vals =  Array.prototype.filter.call(e.target.options, (item)=>item.selected).map(item => item.value)
        this.setState({
            city: Immutable.List(vals)
        })
    }

    changCategories=(e) => {
        let vals = this.state.categories;
        if (e.target.checked) {
            let index = vals.indexOf(+e.target.value);
            if (index == -1) {//没有
                this.state.categories.push(+e.target.value)
            }
        } else {
            let index = vals.indexOf(+e.target.value);
            if (index != -1) {//有
                this.state.categories.splice(index,1);
            }
        }
        this.setState({
            categories: vals
        })
    }
    //上传文件doc
    upChange=(ev)=>{
        let fileArr=ev.target.value.split('\\');
        let valInput=fileArr[fileArr.length-1];
        let typeFileArr=valInput.split('.');
        let typeF=typeFileArr[typeFileArr.length-1];
        var formData = new FormData();
        let docfile = this.refs.fileInput.files[0];

        if(typeF=='doc'||typeF=='docx'){
            formData.append("type", 'doc');
            formData.append("file", document.getElementById("docInput").files[0]);
            this.state.doc_file = document.getElementById("docInput").files[0];
            this.setState({'doc_name': valInput})
        }else{
            showAlert('请上传指定类型的文件')
            return;
        }
    }
    //上传文件pdf
    upChangepdf=(ev)=>{
        let fileArr=ev.target.value.split('\\');
        let valInput=fileArr[fileArr.length-1];
        let typeFileArr=valInput.split('.');
        let typeF=typeFileArr[typeFileArr.length-1];
        var formData = new FormData();
        let pdffile = this.refs.pdffileInput.files[0];

        if(typeF=='pdf'){
            formData.append("type", 'pdf');
            formData.append("file", document.getElementById("pdfInput").files[0]);
            this.state.pdf_file = document.getElementById("pdfInput").files[0];
            this.setState({'pdf_name': valInput})
        }else{
            showAlert('请上传指定类型的文件')
            return;
        }
    }

    //删除文件
    delFile=(dataType)=>{
        if(dataType.type == 'doc' && dataType.file_name!=''){
            this.state.doc_file = '';
            this.setState({'doc_name':''})
        }else if(dataType.type == 'pdf' && dataType.file_name!=''){
            this.state.pdf_file = '';
            this.setState({'pdf_name':''})
        }
    }

    onSave = (type) => {
        var formData = new FormData();
        if (!this.state.name || this.state.name.replace(/\s/g,"")=='') {
            this.setState({name : ''});
            showAlertModal('修改试卷','请填写试卷名称');
            return;
        }
        if (!this.state.term || this.state.term==0) {
            showAlertModal('修改试卷','请选择试卷所在学期');
            return;
        }
        if (!this.state.source || this.state.source==0) {
            showAlertModal('修改试卷','请选择试卷来源');
            return;
        }
        if (!this.state.province || this.state.province.length > 0) {
            showAlertModal('修改试卷','请选择试卷的省份');
            return;
        }
        if ((this.state.doc_file == "undefined" || this.state.doc_file == '') && (this.state.pdf_file == "undefined" || this.state.pdf_file == '')) {
            showAlertModal('修改试卷','请进行DOC或PDF上传');
            return;
        }

        formData.append("name", this.state.name);
        formData.append("year", this.state.year);
        formData.append("term", this.state.term);
        formData.append("source", this.state.source);
        formData.append("province", this.state.province.toArray());
        formData.append("city", this.state.city.length<=0?[]:this.state.city.toArray());
        formData.append("categories", this.state.categories);
        if(type=='type'){formData.append("reviewing", true);}//如果是去录排，后台要加锁
        if (this.state.doc_file != "undefined" && this.state.doc_file != ''){
            formData.append("doc_file",  this.state.doc_file);
        }
        if(this.state.pdf_file != "undefined" && this.state.pdf_file != ''){
            formData.append("pdf_file", this.state.pdf_file);
        }
        this.state.ajaxing = true;
        //let xhr = new XMLHttpRequest();
        axios.post(`/api/paper/create_paper`,formData, {headers: { 'Content-Type': 'multipart/form-data' }})
            .then(res => {
                if(type == 'type'){
                    // Q.alert('保存成功！去录排');
                    window.location.href = `/omega_paper/${res._id}`;
                }else if(type == 'list'){
                    this.setState({
                        name: '',
                        "year":0,   //年份
                        "term":0,  //学期
                        "source":0,   //来源
                        "province":[""],    //省
                        "city":[""],        //市
                        "categories":[],       //类型
                        paper: {},
                        ajaxing: false,
                        doc_name: '',
                        pdf_name: '',
                        "doc_file": '',         //文件
                        "pdf_file": ''
                        // edu: Global.user.edu
                    });
                    document.getElementById("category0").checked=false;
                    document.getElementById("category1").checked=false;
                    document.getElementById("category2").checked=false;
                    Q.alert('保存成功到列表');
                }
               this.setState({ajaxing: false});
            })
            .catch((err)=>{
                console.log(JSON.stringify(err))
            });
    }

    render() {
        let { paper } = this.state;
        let provinceOpt = [];
        for (let key in this.provinces) {
            provinceOpt.push(<option key={key} selected={this.state.province.indexOf(key) ==-1?false: true} value={key}>{key}</option>)
        }
        let opable = !this.state.ajaxing;

        let statusIndicator = <span className="upload-status label" />;
        if (this.state.status === 'ok') {
            statusIndicator = <span className="upload-status label label-success">上传成功</span>;
        } else if (this.state.status === 'error') {
            statusIndicator = <span className="upload-status label label-danger">上传失败</span>;
        } else if (this.state.status === 'uploading') {
            statusIndicator = <span className="upload-status label label-info">正在上传</span>;
        }

        return (
            <div className="writeBox">
                <div id="paper-view">
                    <Row><Col xs className="paperTitle">试卷基本信息</Col></Row>
                    <Row className="paper-header">
                        <Col xs={12}>
                            <Row center="xs">
                            <Col xs={9} className="paper-metas">
                                <form enctype="multipart/form-data" className="form-horizontal" >
                                    <div className="form-group">
                                        <label className="col-sm-1 control-label normalLabel must">名字</label>
                                        <div className="col-sm-11 alignleft">
                                            <input
                                                type="text" value={this.state.name} required placeholder="在此处填写试卷名称"
                                                onChange={(event) => {
                                                    event.stopPropagation();
                                                    this.setState({name : event.target.value})
                                                }}
                                                className="nameInput"
                                            />
                                        </div>
                                    </div>

                                    <div className='checBox'>
                                        <div className="form-group form-group1">
                                            <label className="col-sm-4 normalLabel">年份</label>
                                            <div className="col-sm-8 selectB">
                                                <select name="year" value={this.state.year} onChange={this.changeYear}>
                                                    {
                                                        this.years.map((item, index) => {
                                                            return (
                                                                <option key={`year${index}`} value ={item.val}>{item.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group form-group1">
                                            <label className="col-sm-4 normalLabel must">学期</label>
                                            <div className="col-sm-8 selectB">
                                                <select name="term" value={this.state.term} onChange={event =>{this.setState({'term':event.target.value})}}>
                                                    {
                                                        this.terms.map((term, index) => {
                                                            return (
                                                                <option key={`term${index}`} value ={term.code}>{term.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group form-group1">
                                            <label className="col-sm-4  normalLabel must">来源</label>
                                            <div className="col-sm-8 selectB">
                                                <select name="term" value={this.state.source} onChange={event =>{this.setState({'source': event.target.value})}}>
                                                    {
                                                        this.sources.map((term, index) => {
                                                            return (
                                                                <option key={`source${index}`} value={term.code}>{term.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group form-groupCity">
                                        <label className="col-sm-1 control-label normalLabel must">省份</label>
                                        <div className="col-sm-4">
                                            <select className='form-control' name="province" id=""  multiple onChange={this.changeProvince}>
                                                { provinceOpt }
                                            </select>
                                        </div>
                                        <label className="col-sm-1 control-label normalLabel">城市</label>
                                        <div className="col-sm-4">
                                            <select className='form-control' name="city" id="" multiple onChange={this.changeCity}>
                                                {
                                                    this.state.province.size== 1 && Object.keys(this.provinces).length ? this.provinces[this.state.province.get(0)].map((c) => {
                                                        return (<option key={`city${c.city_id}`} selected={this.state.city.indexOf(c.city_name) ==-1?false: true} value={c.city_name}>{c.city_name}</option>)
                                                    }) : null
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-1 control-label" style={{'paddingTop':0}}>类型</label>
                                        <div className="col-sm-11 kinds" >
                                            <Row start="xs">
                                              {
                                                this.categories.map((item, index) => {
                                                    return (
                                                        <Col xs={2}>
                                                            <label className="typeLabel" htmlFor="" for={`category${index}`}>
                                                                <input className="LeiXingcheck" id={`category${index}`} key={`categories${index}`} type="checkbox" name="categories" value={item.code}  onChange={this.changCategories}/>
                                                                {item.name}
                                                            </label>
                                                        </Col>
                                                    )
                                                })
                                              }
                                            </Row>
                                        </div>
                                    </div>

                                    <div className="form-group doneBox">
                                        <label className="col-sm-1 control-label">DOC</label>
                                        <div className="col-sm-9">
                                            {/* 上传DOC */}
                                            {
                                                this.state.doc_name?
                                                    <div className="DocBoxDown">
                                                        <a> {this.state.doc_name}</a>
                                                        <span className="delDoc" onClick={()=>{this.delFile({type:'doc',file_name: this.state.doc_name})}}>x</span>
                                                    </div>
                                                    :<div className="DocBoxUp">
                                                    <input type="string" value='' readOnly style={{'background':'#fff'}} className="form-control formFile"/>
                                                    <form id="" enctype="multipart/form-data" method="post">
                                                        <label className="upLable">
                                                            上传
                                                            <input id="docInput" className="upFileBtn" type="file" ref='fileInput' onChange={this.upChange} name="" value="" accept={'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'}/>
                                                        </label>
                                                    </form>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="form-group doneBox">
                                        <label className="col-sm-1 control-label">PDF</label>
                                        <div className="col-sm-9">
                                            {/* 上传PDF */}
                                            {
                                                this.state.pdf_name?
                                                    <div className="DocBoxDown">
                                                        <a> {this.state.pdf_name}</a>
                                                        <span className="delDoc" onClick={()=>{this.delFile({type:'pdf',file_name: this.state.pdf_name})}}>x</span>
                                                    </div>
                                                    :<div className="DocBoxUp">
                                                    <input type="string" value='' readOnly style={{'background':'#fff'}} className="form-control formFile"/>
                                                    <form id="" enctype="multipart/form-data" method="post">
                                                        <label className="upLable">
                                                            上传
                                                            <input id="pdfInput" ref='pdffileInput' className="upFileBtn" type="file" onChange={this.upChangepdf} name="pdffile" value="" accept={"application/pdf"}/>
                                                        </label>
                                                    </form>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <Row>
                                        <Col xs={3}></Col>
                                        <Col>
                                            <button type="button"
                                                className="btn btn-success btn-sm col-sm-offset-1 lupaiBtn"
                                                onClick={() => this.onSave('type')}
                                            >去录排
                                            </button>
                                        </Col>
                                        <Col>
                                            <button type="button"
                                                className="btn btn-success btn-sm col-sm-offset-1 saveAndCreate"
                                                onClick={() => this.onSave('list')}
                                            >保存并继续创建
                                            </button>
                                        </Col>
                                     </Row>
                                </form>
                            </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
                <div className="lastTilBox">
                    <p className="p1">© 优能中学教育</p>
                    <p className="p2">(Release: dev, Git Version: 278f7e22)</p>
                    <p className="p3">建议您使用360、Google Chrome，分辨率1280*800及以上浏览本网站，获得更好用户体验</p>
                </div>
            </div>
        );
    }

}
