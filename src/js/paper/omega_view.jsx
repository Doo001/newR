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
import {ModalDel} from './clearAlert';
import { showAlertModal } from 'js/widgets/alertModal'
import "css/main.scss"; 
import {store} from "js/main_entry";
import { Row, Col } from 'react-flexbox-grid'
import './css/omega_view.scss'
import {showAlert} from 'js/widgets/alert';
import axios from 'js/utils/api'

export class OmegaPaper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paper: null,
            ajaxing: false,
            edu: Global.user.edu,
            title:'删除题目',
            clearTil:'将所有题目从试卷中移除，注意该步骤不可逆！',
            clear:false,
            paiDone:false,
            review:2,
            addNew:'',
            itemIdsConst:[],
            itemidsNew:[],
            tilMove:'移动题目',
            conMove:'执行题目移动操作，试卷排版数据将被清空，是否继续进行！',
            isfile:'',
        };
    }

    componentWillMount() {
        Q.get(`/api/user/${Global.userId}`)
            .done((res) => {
                this.setState({
                    edu: res.edu
                }, () => {
                    Global.user.edu = res.edu;
                })
            })
    }
    
    intData(){
		Q.get(`/api/paper/show_paper/${this.props.params.id}`)
            .done((paper) => {
                this.setState({
                	itemidsNew:paper.item_ids,//最新的数组
                	paper: Immutable.fromJS(paper),
            	},()=>{
            		console.log(this.state.itemIdsConst,this.state.itemidsNew)
            	});
            })
    }
    
    intDataDidMount(){
		Q.get(`/api/paper/show_paper/${this.props.params.id}`)
            .done((paper) => {
                this.setState({
                	paiDone:paper.typset_state,
                	itemIdsConst:paper.item_ids,
                	itemidsNew:paper.item_ids,
                	paper: Immutable.fromJS(paper),
                	review:paper.review,
            	},()=>{
            		console.log(989)
            	});
            })
    }

    componentDidMount() {
        if (this.props.params.id) {
        	this.intDataDidMount();
        }
        setNavBar([
            new NavItem('录排', `/omega_paper/${this.props.params.id}`),
        ], '录排')
    }
    
    addNew=(res)=>{
    	console.log(res)
    	this.intData();
    }

    onPropChanged(name, value) {
        this.setState(
            {paper: this.state.paper.set(name, value)}
        );
    }

    sureC=()=>{
    	axios.post(`/api/paper/clear_item/${this.props.params.id}`)
	    	.then(res => {
    			this.setState({
    				clear:true,
    				itemidsNew:[],
    				itemIdsConst:[],
    			})
    			this.c.clearText();
	        })
	    	.catch((err)=>{
	    		console.log(JSON.stringify(err))
	    	});
    }
    
    cancelC=()=>{
    }

    remove() {
    	//清空确认
	        ModalDel.show(
                <ModalDel title={this.state.title} til={this.state.clearTil} cancelC={this.cancelC} sureDel={this.sureC}> </ModalDel>
	        );
    }

    addItem(item) {
        item.map((v, i) => {
            if (this.state.paper.get('item_ids').includes(v)) {
                Q.alert('此题已添加', 'warning');
                item.splice(i, 1);
            }

            this.setState({
                paper: this.state.paper.updateIn(['item_ids'], list => list.concat(item))
            });
            $('#modal-container .bs-example-modal-lg').modal('hide');
        })
    }

    addItemSingle(item) {

        if (this.state.paper.get('item_ids').includes(item)) {
            Q.alert('此题已添加', 'warning');
            return;
        }
        $('#modal-container .bs-example-modal-lg').modal('hide');
        this.setState(
            {paper: this.state.paper.updateIn(['item_ids'], list => list.push(item))}
        );
    }


    showSearchModal() {
        localStorage.removeItem('idArr');
        localStorage.removeItem('dataSel');
        localStorage.setItem('dataSel', JSON.stringify([]))
        const modal = Modalbig.show(
            <Provider store={store}>
                <Modalbig data-backdrop="static" modalDialogClass="modal-big" edu={this.state.paper.get('edu')}
                          callbackBig={() => this.addItem(JSON.parse(localStorage.getItem('idArr')))}>
                    {this.props.children}
                </Modalbig>
            </Provider>
        );
    }
    
    showCreateModal() {
        const modal = ModalSingle.show(
            <Provider store={store}>
                <ModalSingle arrLinShi={this.state.itemidsNew} nowNum={this.state.itemidsNew.length} clearFalse={this.clearFalse} addNew={this.addNew} paperId={this.props.params.id}  modalDialogClass="modal-big" isPaper={true} edu={this.state.paper.get('edu')} saveCallback={(item) => {
                    this.addItemSingle(item);
                }}>
                </ModalSingle>
            </Provider>
        );

    }
    
    clearFalse=()=>{
    	this.setState({
    		clear:false
    	})
    }
    
    //保存
    savePaper=(fn,alertFlag)=>{
        if (!this.state.paper.get('name').replace(/\s/g,'')) {
        	showAlert('请补全试卷名称!',"danger")
            return;	
        }
        if (!this.state.paper.get('term')) {
        	showAlert('请选择学期!',"danger")
            return;
        }
        
        if (!this.state.isfile) {
        	showAlert('请上传doc或pdf文件!',"danger")
            return;
        }
        
        if (!this.state.paper.get('source')) {
        	showAlert('请选择来源!',"danger")
            return;
        }
        
        if (!this.state.paper.get('province')) {
        	showAlert('请选择省!',"danger")
            return;
        }
        let oldArr=this.state.itemIdsConst;
        let newArr=this.state.itemidsNew;
        let allA=oldArr.concat(newArr)
		let allArr=[];
     	allA.map(v=>{
     		allArr.indexOf(v)==-1?allArr.push(v):null
     	})
     	//去除数组中的空格
     	oldArr.map((v,i)=>{
        	v==""?oldArr.splice(i,1):null
        	return v
        })
     	newArr.map((v,i)=>{
        	v==""?newArr.splice(i,1):null
        	return v
        })
     	allArr.map((v,i)=>{
        	v==""?allArr.splice(i,1):null
        	return v
        })
     	
        if(newArr.length==0){
        	showAlert('请先录入题目!',"danger")
        	return;
        }
        
    		console.log(oldArr,newArr,allArr)
    		console.log(oldArr.length,newArr.length,allArr.length)
        
    	let commonArrLength=oldArr.length+newArr.length-allArr.length;
    	if(oldArr.length==commonArrLength){
    		console.log('交集一样')
    		for(var i=0;i<oldArr.length;i++){
				if(oldArr[i]!=newArr[i]){
					//列表移动了
					ModalDel.show(
			            <ModalDel title={this.state.tilMove} til={this.state.conMove} cancelC={this.moveNo} sureDel={()=>{this.moveYes()}}> </ModalDel>
			        );
			        return;
				}
			}
    		this.fnSave(fn,alertFlag);
    	}else{
        	this.fnSave(fn,alertFlag);
        }
    }
    
    
    fnSave=(fn,alertFlag)=>{
    	axios.post(`/api/paper/update_paper/${this.props.params.id}`,this.state.paper.toObject())
		 	.then(res => {
		 		this.setState({
		 			itemIdsConst:this.state.itemidsNew
		 		})
		 		if(alertFlag){
		 			showAlert('更新成功');
		 		}
				fn();
	        })
	    	.catch((err)=>{
	    		console.log(JSON.stringify(err))
	    	});
    } 
    
    
    //试卷排版
    paiFn=()=>{
		this.props.router.push(`/paper/composition/${this.props.params.id}`)
    } 
    
    //%
    saveIt=()=>{
    }
    
    moveYes=()=>{
    	//确定移动
    	this.fnSave();
    }
    
    moveNo=()=>{}
    
    //试卷预览
    seeSave=()=>{
    	window.open(`/paper/preview/${this.props.params.id}`)
    }
    paperLook=()=>{
		if(this.state.paiDone){
			//去预览
			window.open(`/paper/preview/${this.props.params.id}`)
		}else{
			showAlert('请先进行试卷排版!', "warning");
		}
    }
    
    //更新新数组
    updateNewList=(arrNew)=>{
    	this.setState({
    		itemidsNew:arrNew,
    		clear:false
    	})
    }
    
    isfile=(isfile)=>{
    	this.setState({
    		isfile:isfile
    	})
    }
    
    render() {
        if (this.state.paper === null) {
            return (<div className="loading">加载中...</div>);
        }
        return (
        	<div className="writeBox">
	            <div id="paper-view">
	                <PaperHeader
	                	ref={b=>this.c=b}
	                	isfile={this.isfile.bind(this)}
	                	updateNewList={this.updateNewList.bind(this)}
	                	review={this.state.review}
	                	clearList={this.state.clear}
	                    paper={this.state.paper}
	                    key="header"
	                    onPropChanged={this.onPropChanged.bind(this)}
	                    onCreateItem={this.showCreateModal.bind(this)}
	                    onSearchItem={this.showSearchModal.bind(this)}
	                    data-backdrop="static"
	                />
	                <PaperBody
	                	clearSure={this.state.clear}
	                    itemIds={this.state.paper.get('item_ids')}
	                    itemTpls={this.state.paper.get('item_tpls')}
	                />
	                <div className="op-zone paper-op-zone panel panel-default">
	                	{
	                		this.state.paiDone?<button className="btn btn-danger clearAll" disabled onClick={this.remove.bind(this)}>清空</button>
	                		:<button className="btn btn-danger clearAll" onClick={this.remove.bind(this)}>清空</button>
	                	}
	                    
	                </div>
	                <div className="preview-ctr" >
	                    <ul >
	                        <li style={{'background':this.state.review==3?'#000':'#fff','opacity':this.state.review==3?'0.2':1,'background':this.state.review==3?'#000':'#fff',}}><li style={{display:this.state.review==3?'block':'none',cursor:this.state.review==3?'default':'pointer'}} className='readonlyMask'></li><a onClick={()=>{this.savePaper(this.paiFn,false)}}>试卷排版</a></li>
	                        <li style={{'position':'relative'}}> <a onClick={e=>{e.stopPropagation(); this.paperLook()}}>试卷预览</a></li>
	                        <li style={{'background':this.state.review==3?'#000':'#ffd343','opacity':this.state.review==3?'0.2':1}} className="saveIt"> <li style={{display:this.state.review==3?'block':'none',cursor:this.state.review==3?'default':'pointer'}} className='readonlyMask'></li> <a onClick={e=>{e.stopPropagation(); this.savePaper(this.saveIt,true)}}>保存</a></li>
	                    </ul>
	                </div>
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

class AlearModal extends React.Component{
	
	sureClear=()=>{
		this.props.clearFlag(false)
	}
	
	cancelClear=()=>{
		this.props.clearFlag(false)
	}
		
	
	render(){
		return(<div className="maskWrap">
			<div className="down"></div>
			<div className="center">
				<p className="til">删除题目<span>+</span></p>
				<p className="con">将所有题目从试卷中移除，注意该步骤不可逆！</p>
				<div className="btnBox">
					<button className='sureBtn' onClick={this.sureClear}>确定</button>
					<button className="cancelBtn" onClick={this.cancelClear}>取消</button>
				</div>
			</div>
			
		</div>)
	}
}

class PaperHeader extends React.Component{
	updateNewList=(arrNew)=>{
		this.props.updateNewList(arrNew)
	}
	
	isfile=(isfile)=>{
		this.props.isfile(isfile)
	}
	
	clearText=()=>{
		this.b.fnClearText();
	}
	
	render(){
		return (
	        <Row className="paper-header">
	        	<div style={{display: this.props.review==3?'block':'none'}} className="readonlyMask"></div>
	            <Col xs={4} className="paper-item-ids">
	                <p>题目ID列表</p>
	                <TextList
	                	ref={(a)=>this.b=a}
	                	updateNewList={this.updateNewList}
	                	clearList={this.props.clearList}
	                    items={this.props.paper.get('item_ids')}
	                    onListChanged={(newList) => {
	                        this.props.onPropChanged('item_ids', newList);
	                    }}
	                />
	            </Col>
	            <Col xs={8} className="paper-metas">
	                <PaperMetaForm isDoc={this.isfile.bind(this)}  {...this.props} />
	            </Col>
	        </Row>
	    );
	}
    
}

//function PaperMetaForm(props) {
class PaperMetaForm extends React.Component {
    constructor(props) {
        super(props)
        this.terms = [];
        this.sources = [];
        this.categories = [];
        this.provinces = {};
        this.years = []
        for(let i= new Date().getFullYear(); i > 2000; i--) {
            this.years.push({
                name:i,
                val:i,
            })
        }
        
    }

    state = {
        paper: this.props.paper,
        docFile:'',
        pdfFile:'',
        title:'删除文件',
        delFileTil:'确定要删除此文件？',
        doc_original:'',
        pdf_original:''
    }

    redirect(reviewProps) {
        let edu = Math.floor(this.props.paper.get('grade') / 10)
        Q.get(`/item/review?review=${reviewProps}&paper_id=${this.props.paper.get('_id')}&edu=${edu}`).done(data => {
            if (data) {
                window.location.href = data;
            }
        })
    }

    componentDidMount() {
    	this.years.unshift({
            name:"",
            val:"",
        })
        //这是获取学期
        let term = Q.get('/general/getDict', {query: {type: 1}})
        //这是来源
        let source = Q.get('/general/getDict', {query: {type: 2}})
        //这是试卷类型
        let categories = Q.get('/general/getDict', {query: {type: 3}})
        let cities = Q.get('/general/getCity')
        $.when(term, source, categories, cities)
            .done((terms, sources, categories, cities) => {
                this.terms = terms;
                this.sources = sources;
                this.categories = categories;
                cities.forEach(val => {
                    this.provinces[val.province_name] = val.city
                })
                this.forceUpdate()
            })
            
        this.setState({
        	docFile:this.props.paper.get('doc'),
        	pdfFile:this.props.paper.get('pdf'),
        	doc_original:this.props.paper.get('doc_original'),
        	pdf_original:this.props.paper.get('pdf_original')
        	
        },()=>{
        	let idFile=this.state.doc_original+this.state.pdf_original;
        	this.props.isDoc(idFile)
        })
    }
    changCategories=(e) => {
        let vals = this.state.paper.get('categories');
        if (e.target.checked) {
            vals = vals.push(+e.target.value)
        } else {
            let index = vals.indexOf(+e.target.value);
            if (index != -1) {
                vals = vals.delete(index)
            }
        }
        this.setState({
            paper: this.state.paper.set('categories', vals)
        }, this.props.onPropChanged('categories', vals))
    }
    changeForm = (name, val) => {
        this.setState({
            paper: this.state.paper.set(name, val)
        }, () => {
            this.props.onPropChanged(name, val);
        })

    }
    changeProvince = (e)=>{
        let vals =  Array.prototype.filter.call(e.target.options, (item)=>item.selected).map(item => item.value)
        if (vals.length >1) {
            this.state.paper.set('city', [])
            this.props.onPropChanged('city', []);
        }
        this.setState({
            paper: this.state.paper.set('province', Immutable.List(vals))
        }, () => {
            this.props.onPropChanged('province', vals);
        })
    }
    changeCity =(e)=> {
        let vals =  Array.prototype.filter.call(e.target.options, (item)=>item.selected).map(item => item.value)
        this.setState({
            paper: this.state.paper.set('city', Immutable.List(vals))
        }, () => {
            this.props.onPropChanged('city', vals);
        })
    }
    changeYear = e => {
        this.setState({
            paper: this.state.paper.set('year', e.target.value)
        },() => {
            this.props.onPropChanged('year', this.state.paper.get('year'));
        })
    }
    
    //上传doc文件
    upChange=(ev)=>{
    	let fileArr=ev.target.value.split('\\');
     	let valInput=fileArr[fileArr.length-1];
     	let typeFileArr=valInput.split('.');
     	let typeF=typeFileArr[typeFileArr.length-1];
     	var formData = new FormData(); 
     	
     	if(typeF=='doc'||typeF=='docx'){
			formData.append("type", 'doc');
			formData.append("file", document.getElementById("docInput").files[0]);
			axios.post(`/api/paper/upload/${this.props.paper.get('_id')}`,formData)
			 	.then(res => {
	     			this.setState({
	     				doc_original: res.file_original
	     			},()=>{
			        	let idFile=this.state.doc_original+this.state.pdf_original;
			        	this.props.isDoc(idFile)
			        })
		        })
		    	.catch((err)=>{
		    		console.log(JSON.stringify(err))
		    	});
     	}else{
     		showAlert('请上传指定类型的文件')
     		return;
     	}
    }
    //pdf this.props.paper.get('_id')
    upChangepdf=(ev)=>{
    	let fileArr=ev.target.value.split('\\');
     	let valInput=fileArr[fileArr.length-1];
     	let typeFileArr=valInput.split('.');
     	let typeF=typeFileArr[typeFileArr.length-1];
     	var formData = new FormData(); 
     	
     	if(typeF=='pdf'){
			formData.append("type", 'pdf');
			formData.append("file", document.getElementById("pdfInput").files[0]);
			axios.post(`/api/paper/upload/${this.props.paper.get('_id')}`,formData)
			 	.then(res => {
	     			this.setState({
	     				pdf_original: res.file_original
	     			},()=>{
			        	let idFile=this.state.doc_original+this.state.pdf_original;
			        	this.props.isDoc(idFile)
			        })
		        })
		    	.catch((err)=>{
		    		console.log(JSON.stringify(err))
		    	});
     	}else{
     		showAlert('请上传指定类型的文件')
     		return;
     	}
    }
    
    
    cancelDelFile=()=>{
    }
    
    sureDelFile=(params)=>{
    	axios.post(`/api/paper/delete_file/${this.props.paper.get('_id')}`, params)
     		.then(res => {
     			params.type=='doc'?this.setState({ doc_original: '' }):this.setState({ pdf_original: '' })
   				showAlert('删除成功');
   				let idFile=this.state.doc_original+this.state.pdf_original;
	        	this.props.isDoc(idFile)
	        })
	    	.catch((err)=>{
	    		console.log(JSON.stringify(err))
	    	});
    }
    
    //删除文件
    delFile=(dataType)=>{
    	console.log(dataType)
    	ModalDel.show(
            <ModalDel title={this.state.title} til={this.state.delFileTil} cancelC={this.cancelDelFile} sureDel={()=>{ this.sureDelFile(dataType)}}> </ModalDel>
        );
    }
    
    render() {
        let { paper } = this.state;
        let provinceOpt = [];
        for (let key in this.provinces) {
            provinceOpt.push(<option key={key} selected={paper.get('province').indexOf(key) ==-1?false: true} value={key}>{key}</option>)
        }
        return (
            <div className="form-horizontal">
                <div className="form-group">
                    <label className="col-sm-1 control-label">名字</label>
                    <div className="col-sm-11">
                        <input
                            type="text" value={paper.get('name')} required
                            onChange={(event) => {
                                event.stopPropagation();
                                this.changeForm('name', event.target.value)
                            }}
                            className="nameInput"
                        />
                    </div>
                </div>
                
                <div className='checBox'>
	                <div className="form-group form-group1">
	                    <label className="col-sm-4">年份</label>
	                    <div className="col-sm-8 selectB">
	                        <select name="year" value={paper.get('year')} onChange={this.changeYear}>
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
	                    <label className="col-sm-4">学期</label>
	                    <div className="col-sm-8 selectB">
	                        <select name="term" value={paper.get('term')} onChange={event =>this.changeForm('term', event.target.value)}>
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
	                    <label className="col-sm-4">来源</label>
	                    <div className="col-sm-8 selectB">
	                        <select name="term" value={paper.get('source')} onChange={event =>this.changeForm('source', event.target.value)}>
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
                    <label className="col-sm-1 control-label">省份</label>
                    <div className="col-sm-4">
                        <select className='form-control' name="province" id=""  multiple onChange={this.changeProvince}>
                            { provinceOpt }
                        </select>
                    </div>
                    <label className="col-sm-1 control-label">城市</label>
                    <div className="col-sm-4">
                        <select className='form-control' name="city" id="" multiple onChange={this.changeCity}>
                            {
                                paper.get('province').size== 1 && Object.keys(this.provinces).length ?   this.provinces[paper.get('province').get(0)].map((c) => {
                                    return (<option key={`city${c.city_id}`} selected={paper.get('city').indexOf(c.city_name) ==-1?false: true} value={c.city_name}>{c.city_name}</option>)
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
                                            <label htmlFor=""> 
                                                <input className="LeiXingcheck" key={`categories${index}`} type="checkbox" name="categories" value={item.code} checked={paper.get('categories').indexOf(item.code) != -1} onChange={this.changCategories}/>
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
                    		this.state.doc_original?
                    		<div className="DocBoxDown">
	                    		<a target='_blank' href={ `http://sealdata.youneng.com/doc/${this.state.docFile}` }> {this.state.doc_original }</a>
	                    		<span className="delDoc" onClick={()=>{this.delFile({"type":'doc',"file_name": this.state.docFile})}}>x</span>
                    		</div>
                    		:<div className="DocBoxUp">
                    			<input type="string" value='' readOnly style={{'background':'#fff'}} className="form-control formFile"/>
								<form id="" enctype="multipart/form-data" method="post"> 
									<label className="upLable">
										上传
										<input id="docInput" className="upFileBtn" type="file" onChange={this.upChange} name="" value="" accept={'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'}/>
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
                    		this.state.pdf_original?
                    		<div className="DocBoxDown">
	                    		<a target='_blank' href={ `http://sealdata.youneng.com/pdf/${this.state.pdfFile}` }> {this.state.pdf_original}</a>
	                    		<span className="delDoc" onClick={()=>{this.delFile({type:'pdf',file_name: this.state.pdfFile})}}>x</span>
                    		</div>
                    		:<div className="DocBoxUp">
                    			<input type="string" value='' readOnly style={{'background':'#fff'}} className="form-control formFile"/>
								<form id="" enctype="multipart/form-data" method="post"> 
									<label className="upLable">
										上传
										<input id="pdfInput" className="upFileBtn" type="file" onChange={this.upChangepdf} name="" value="" accept={"application/pdf"}/>
									</label>
								</form> 
                    		</div>
                    	}
                    </div>
                </div>
                
                {/*
                  * <div className="form-group">
                    <label className="col-sm-1 control-label">操作</label>
                    <div className="col-sm-9">
                        <button
                            className="btn btn-success btn-sm"
                            onClick={() => this.props.onSearchItem()}
                        ><span className="glyphicon glyphicon-search" aria-hidden="true"/>
                            查询添加
                        </button>
                        <button
                            className="btn btn-success btn-sm"
                        ><span className="glyphicon glyphicon-search" aria-hidden="true"/>
                            <a onClick={() => this.redirect('tag')}>标注</a></button>
                        <button
                            className="btn btn-success btn-sm"
                        ><span className="glyphicon glyphicon-search" aria-hidden="true"/>
                            <a onClick={() => this.redirect('typeset')}>审核</a></button>
                        <button
                            className="btn btn-success btn-sm col-sm-offset-1"
                            onClick={() => this.props.onCreateItem()}
                        ><span className="glyphicon glyphicon-plus" aria-hidden="true"/>
                            新建题目
                        </button>
                        {this.props.paper.get('volume_id') &&
                        <a
                            href={`/volume/${this.props.paper.get('volume_id')}`}
                            target="_blank" className="col-sm-offset-1"
                        >查看录入</a>
                        }
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-1 control-label">Deleted</label>
                    <div className="col-sm-2">
                        <p className="form-control-static">
                            {this.props.paper.get('deleted') ? 'YES' : 'NO'}
                        </p>
                    </div>
                </div>	
                  * */}
                <button
                    className="btn btn-success btn-sm col-sm-offset-1 aloneTestBtn"
                    onClick={() => this.props.onCreateItem()}
                    data-backdrop="static"
                >
                    逐题录入
                </button>
            </div>
        );
    }

}

function getNonEmptyLines(val) {
    return val.split(/\n/).map(s => s.trim()).filter(s => !!s);
}

class TextList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.items.join('\n'),
        };
    }
    
    componentDidMount(){
    	localStorage.setItem('testNum',JSON.stringify(this.props.items.size))
    }

    componentWillReceiveProps(nextProps) {
        this.setState({value: nextProps.items.join('\n')});
    }

    handleBlur() {
        const lines = getNonEmptyLines(this.state.value);
        this.props.onListChanged(Immutable.List(lines));
        let arrBlur=this.state.value.split('\n');
        arrBlur.map((v,i)=>{
        	v==""?arrBlur.splice(i,1):null
        	return v
        })
        this.props.updateNewList(arrBlur)
    }
    
   	fnClearText=()=>{
   		this.setState({
   			value:''
   		})
   	}

    render() {
        return (<div>
        		<textarea
	            	className="idTextarea"
	                value={this.state.value}
	                onChange={(event) => {
	                    this.setState({value: event.target.value});
	                }}
	                onBlur={this.handleBlur.bind(this)}
	            />
        	</div>);
    }
}

class PaperBody extends React.Component{

	render(){
		let trs=[]
		if(!this.props.clearSure){
			trs = this.props.itemIds.map((itemId, index) => {
		        return (
		            <PaperItem
		                key={itemId} itemId={itemId} no={index + 1}
		            />
		        );
		   })
		}else{
			trs = [].map((itemId, index) => {
		        return (
		            <PaperItem
		                key={itemId} itemId={itemId} no={index + 1}
		            />
		        );
		   })
		}
		return (
	        <div className="paper-body">
	            <p className="tilTest">题目部分</p>
	            <table className="paper-items table table-striped">
	                <tbody>
	                {trs}
	                </tbody>
	            </table>
	        </div>
	    );
		
	}
}

class PaperItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemTypeName: '(未知)',
        };
    }

    onItemLoaded(itemDisplay) {
        if (itemDisplay.state.error) {
            return;
        }
        const item = itemDisplay.state.item;
        this.setState({itemTypeName: ItemTypeDesc.get(item.get('data').get('type')).name});
    }

    render() {
        return (
            <tr>
                <td width="45%">
                    <ul>
                        <li>序号: &nbsp;{this.props.no}</li>
                        <li>ID： &nbsp; &nbsp;
                            <a href={`/item/${this.props.itemId}`} target='_blank' className="code">
                                {this.props.itemId}
                            </a>
                        </li>
                        <li className="testKinds">题型: &nbsp; &nbsp;{this.state.itemTypeName}</li>
                        {/*
                          * 	
                          <li><span>操作: &nbsp; &nbsp;</span>
                        	<button className="delImg" ><span>移出</span></button>
                        	<button className="upImg"><span>UP</span></button>
                        	<button className="downImg"><span>DOWN</span></button>
                        </li>
                          */}
                        
                    </ul>
                </td>
                <td width="55%" style={{'paddingTop':'15px'}}>
                    <ItemDisplay id={this.props.itemId} onLoaded={this.onItemLoaded.bind(this)}/>
                </td>
            </tr>
        );
    }
}
