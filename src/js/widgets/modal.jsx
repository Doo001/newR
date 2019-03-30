import React from 'react';
import ReactDom from 'react-dom';
import { Q, Edu, EduDesc } from 'js/quantum';
import $ from 'jquery';
import {HtmlWithTex} from 'js/widgets/html_with_tex';
import ItemParsing,{PageModal} from 'subjects/<%SUBJECT%>/parsePage';
import { getSubject } from 'js/subjects';
import Select, {Option, OptGroup} from 'rc-select';
import SortableTree, {
    changeNodeAtPath,
    addNodeUnderParent,
    removeNodeAtPath,
    getNodeAtPath
} from 'react-sortable-tree'
import {store} from "../main_entry";

//小小小
var countAll=0;
var idType={
		type:0,
		idArr:[]
	}

export class Modal extends React.Component {
	constructor(props){
        super(props);
        this.state={
        	pageNow:1,
        	count:0,
			resHtml:[],
			todos:[],
			idType:[],
			isShowLength:false
        }
    }
	
    static show(Comp) {
        return ReactDom.render(
            Comp
            ,
            document.getElementById('dialog-root'));
    }
    prePage=()=>{	//向上翻页
		let oPageNow=this.state.pageNow;
		console.log(oPageNow)
		if(oPageNow!=1){
			this.setState({
				pageNow:this.state.pageNow-1
			},function(){
				console.log(this.state.pageNow);
				Q.get(`/api/plan_tag/${this.props.id}/v1`)
			    .done(data => {
			        this.setState({
			            res: data
			        },function(){
			        	let resListId=this.state.res.item_list;
			        	
			        	if(resListId.length){
			        		let pageNum=Math.ceil(resListId.length/10);
			        		document.getElementById('pageNum').innerHTML=pageNum;
			        		let arrTen=[];
			        		resListId.map((v,i)=>{
			        			if(i>=this.state.pageNow-10&&i<this.state.pageNow*10)
			        			arrTen.push(v)
			        		})
			        		let strQuest=arrTen.join(',');
			        		Q.get(`/api/item/${strQuest}/htmls`)
							    .done(data => {
							        this.setState({
							            resHtml: data
							        },function(){
										
							        })
							    })
			        	}
			        })
			    })
			})
		}
		
	}
	nextPage=()=>{	//向下翻页
		let oPageNow=this.state.pageNow;
		let opageNum=document.getElementById('pageNum').innerHTML;
		console.log(oPageNow);
		if(oPageNow < opageNum){
			this.setState({
				pageNow:this.state.pageNow+1	//当前页
			})
			Q.get(`/api/plan_tag/${this.props.id}/v1`)
			    .done(data => {
			    	let resListId=data.item_list;
		        	if(resListId.length){
		        		let pageNum=Math.ceil(resListId.length/10);
		        		document.getElementById('pageNum').innerHTML=pageNum;
		        		
		        		let arrTenDown=[];	//清空
		        		arrTenDown.length=0;
			        	console.log(arrTenDown)
			        	
		        		resListId.map((v,i)=>{	//指定
		        			if(i>=this.state.pageNow*10-10&&i<this.state.pageNow*10)
		        			arrTenDown.push(v)
		        		})
		        		let strQuest=arrTenDown.join(',');
		        		
		        		Q.get(`/api/item/${strQuest}/htmls`)
						    .done(data => {
						    	this.setState({
						    		resHtml:data
						    	},()=>{
						    		
						    	})
						    })
		        	}
			    })
		}
	}
	

    componentDidMount() {
        $(this._modal).modal('show');
        $(this._modal).on('click', '.modal-btn', (evt) => {
            let handler = this.props[$(evt.currentTarget).data('action')];
            if (!handler) {
                handler = this[$(evt.currentTarget).data('action')].bind(this);
            }
            Q.assert(handler);
            handler(evt, this);
        });
        $(this._modal).on('hidden.bs.modal', this.onHidden.bind(this));
        
        /*小题库初始化*/
        Q.get(`/api/plan_tag/${this.props.id}/v1`)	
	    .done(data => {
	        	let resListId=data.item_list;
	        	if(resListId.length){
	        		let pageNum=Math.ceil(resListId.length/10);
	        		document.getElementById('pageNum').innerHTML=pageNum;
	        		let arrTen=[];
	        		resListId.map((v,i)=>{
	        			if(i<10)
	        			arrTen.push(v)
	        		})
	        		let strQuest=arrTen.join(',');
	        		Q.get(`/api/item/${strQuest}/htmls`)
					    .done(data => {
					        this.setState({
					            resHtml: data
					        },function(){
					        	console.log(this.state.resHtml)
					        })
					    })
	        	}else{
	        		this.setState({
	        			isShowLength:true
	        		},()=>{
	        			console.log(this.state.isShowLength)
	        		})
	        	}

	    })
        
    }

    onHidden() {
        //ReactDom.render(<div />, document.getElementById('dialog-root'));
        ReactDom.unmountComponentAtNode(document.getElementById('dialog-root'));
        countAll=0;
		idType={
				type:0,
				idArr:[]
			}
    }

    close() {
        $(this._modal).modal('hide');
        if (this.props.onClose) {
            this.props.onClose(this);
        }
        countAll=0;
		idType={
				type:0,
				idArr:[]
			}
    }
    
    
	toFatherFn=(resHeader)=>{
		this.setState({
			idType:resHeader
		},()=>{
			console.log(this.state.idType)
			this.props.callback(this.state.idType.type,this.state.idType.idArr)
		})
	}

    render() {
        return (
            <div
                className="modal fade"
                ref={(ref) => { this._modal = ref; }}
            >
                <div
                    className={`modal-dialog ${this.props.modalDialogClass}`}
                    id={this.props.id || `${(new Date()).getTime()}`}
                    style={this.props.modalDialogStyle}
                >
                    <div className="modal-content">
		                    <HeaderDetail toFather={this.toFatherFn.bind(this)} ref={(a)=>this.b=a} prePage={this.prePage} nextPage={this.nextPage} pageNow={this.state.pageNow}  id={this.props.id} type={this.props.type} />
		                    <BodyDetail isShowLength={this.state.isShowLength} count={this.state.count} selectIt={this.selectIt} res={this.state.res} resHtml={this.state.resHtml}  id={this.props.id} type={this.props.type} />
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

Modal.defaultProps = {
    id: '',
    modalDialogClass: "",
    modalDialogStyle: {},
};
//小题库头
export class HeaderDetail extends React.Component{
	constructor(props){
        super(props);
        this.state={
        	idType:{
				type:0,
				idArr:[]
			}
        }
    }
	
	sureSmall=()=>{
		let IdArr=JSON.parse( localStorage.getItem('idArr') )
		idType.type=this.props.type;
		idType.idArr=IdArr;
		this.setState({
			idType:{
				type:this.props.type,
				idArr:IdArr
			}
		},()=>{
			console.log(this.state.idType)
			this.props.toFather(this.state.idType);
		})
		console.log(idType)
	}
	
	render(){
		const pageNow=this.props.pageNow;
		return (
	        <div className={`modal-header ${this.props.className || ''}`}>
	            <button className="close modal-btn" data-action="close">
	                <span>×</span>
	            </button>
	            <h4 className="modal-title modal-small">
	            	<span className="jiaoAnTilLeft">
		            	<span className="til">教案备用题</span>
		            	<span className="pageNum">(共<span id="pageNum">0</span>页)</span>
	            	</span>
				    <button className="btb preBtb" onClick={this.props.prePage}>上一页</button>
				    <span className="NowPage">第<span id="pageNow">{this.props.pageNow}</span>页</span>
				    <button className="btb preNext" onClick={this.props.nextPage}>下一页</button>
				    <span className="selectNum" id="selectNum">0</span>
				    <button className="sureBtb  modal-btn" data-action="close" onClick={this.sureSmall}>确定</button>
				</h4>
	        </div>
	    );
	}
	
}
export function ModalHeader(props) {
    return (
        <div className={`modal-header ${props.className || ''}`}>
            <button className="close modal-btn" data-action="close">
                <span>×</span>
            </button>
            {props.children}
        </div>
    );
}

//================================大题=========================================
//大大大
export class Modalbig extends Modal {
	constructor(props){
        super(props);
        this.state={
        	pageNowBig:1,
        	count:0,
			resHtml:[],
			todos:[],
			idType:[]
        }
    }
	
    static show(comp) {
        return ReactDom.render(
            comp,

            document.getElementById('dialog-root'));
    }
    
    searchSel=()=>{	//搜索
    	this.setState({
    		resHtml:[]
    	})
		let arrStorage=JSON.parse(localStorage.getItem('dataSel'));
		if(!arrStorage){
			arrStorage=[]
		}
		let str="";
		let arrId=[];
		arrStorage.map(v=>{
			arrId.push(v.id);
		})
		str=arrId.join(',');
		Q.get(`/api/item_search?difficulty=&keywords=&edu=${this.props.edu||Global.user.edu}&item_type=1000&classes=&tag_ids=${str}&page_num=1&page_size=10`)
		    .done(data => {
		    	this.state.res=data;
		    	this.setState({
		    		res:data
		    	},()=>{
		    		if(this.state.res.total){
		    			let pageNumAll=Math.ceil(this.state.res.total/10);
        				document.getElementById('pageNumBig').innerHTML=pageNumAll;
		        		let arr=[];
		        		this.state.res.results.map(v=>{
		        			arr.push(v._id)
		        		})
		        		let str2=arr.join(',');
		        		
		        		Q.get(`/api/item/${str2}/htmls`)
					    .done(data => {
					    	this.setState({
					    		resHtml:data
					    	})
					    })
		        	}
		    	})
		    })
	}
    
    nextPage=()=>{	//向下翻页 大题
    	console.log('向下')
    	let arrStorage=JSON.parse(localStorage.getItem('dataSel'));
		if(arrStorage){
			let str="";
			let arrId=[];
			arrStorage.map(v=>{
				arrId.push(v.id);
			})
			str=arrId.join(',');
			
			let oPageNowBig=this.state.pageNowBig;
			let opageNumBig=document.getElementById('pageNumBig').innerHTML;
			if(oPageNowBig < opageNumBig){
				this.setState({
					pageNowBig:this.state.pageNowBig+1	//当前页
				},()=>{
					Q.get(`/api/item_search?difficulty=&keywords=&edu=${this.props.edu||Global.user.edu}&item_type=1000&classes=&tag_ids=${str}&page_num=${this.state.pageNowBig}&page_size=10`)
				    .done(data => {	
				    	this.setState({
				    		res:data
				    	},()=>{
				    		if(this.state.res.total){
				        		let arr=[];
				        		this.state.res.results.map(v=>{
				        			arr.push(v._id)
				        		})
				        		let str2=arr.join(',');
				        		
				        		Q.get(`/api/item/${str2}/htmls`)
							    .done(data => {
							    	this.setState({
							    		resHtml:data
							    	})
							    })
				        	}
				    	})
				    })	
				})
				
			}
		}
   }
    
    prePage=()=>{		//向上翻页 大题
    	console.log('向上')
    	let arrStorage=JSON.parse(localStorage.getItem('dataSel'));
		if(arrStorage){
			let str="";
			let arrId=[];
			arrStorage.map(v=>{
				arrId.push(v.id);
			})
			str=arrId.join(',');
			let oPageNowBig=this.state.pageNowBig;
			console.log(oPageNowBig);
			if(oPageNowBig!=1){
				this.setState({
					pageNowBig:this.state.pageNowBig-1	//当前页da 向前翻页
				},()=>{
					Q.get(`/api/item_search?difficulty=&keywords=&edu=${this.props.edu||Global.user.edu}&item_type=1000&classes=&tag_ids=${str}&page_num=${this.state.pageNowBig}&page_size=10`)
				    .done(data => {	
				    	this.setState({
				    		res:data
				    	},()=>{
				    		if(this.state.res.total){
				        		let arr=[];
				        		this.state.res.results.map(v=>{
				        			arr.push(v._id)
				        		})
				        		let str2=arr.join(',');
				        		
				        		Q.get(`/api/item/${str2}/htmls`)
							    .done(data => {
							    	this.setState({
							    		resHtml:data
							    	})
							    })
				        	}
				    	})
				    })	
				})
			}
		}	
    }
    

    componentDidMount() {
        $(this._modal).modal('show');
        $(this._modal).on('click', '.modal-btn', (evt) => {
            let handler = this.props[$(evt.currentTarget).data('action')];
            if (!handler) {
                handler = this[$(evt.currentTarget).data('action')].bind(this);
            }
            Q.assert(handler);
            handler(evt, this);
        });
        $(this._modal).on('hidden.bs.modal', this.onHidden.bind(this));
    }

    onHidden() {
        //ReactDom.render(<div />, document.getElementById('dialog-root'));
        ReactDom.unmountComponentAtNode(document.getElementById('dialog-root'));
        countAll=0;
		idType={
				type:0,
				idArr:[]
			}
    }

    close() {
        $(this._modal).modal('hide');
        if (this.props.onClose) {
            this.props.onClose(this);
        }
        countAll=0;
		idType={
				type:0,
				idArr:[]
			}
    }
    
    toFatherFn=(resHeader)=>{
		this.setState({
			idType:resHeader
		},()=>{
			console.log(this.state.idType)
			this.props.callbackBig(this.state.idType.type,this.state.idType.idArr)
		})
	}
    

    render() {
    	let type=1;
        return (
            <div
                className="modal fade"
                ref={(ref) => { this._modal = ref; }}
            >
                <div
                    className={`modal-dialog ${this.props.modalDialogClass}`}
                    id={this.props.id || `${(new Date()).getTime()}`}
                    style={this.props.modalDialogStyle}
                >
                    <div className="modal-content">
                			<HeaderDetailBig searchSel={this.searchSel.bind(this)} toFather={this.toFatherFn.bind(this)} ref={(a)=>this.b=a} prePage={this.prePage} nextPage={this.nextPage} pageNowBig={this.state.pageNowBig}  id={this.props.id} type={this.props.type} />
		                    <BodyDetailBig  edu={this.props.edu} count={this.state.count} selectIt={this.selectIt} res={this.state.res} resHtml={this.state.resHtml}  id={this.props.id} type={this.props.type} />
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}


//大题库头
export class HeaderDetailBig extends React.Component{
	state={
		strQuest:'',
		res:null,	
		resHtml:[],
		idArr:{
				type:0,
				idArr:[]
			}
	}
	sureBig=()=>{
		let IdArr=JSON.parse( localStorage.getItem('idArr') )
		idType.type=this.props.type;
		idType.idArr=IdArr;
		this.setState({
			idType:{
				type:this.props.type,
				idArr:IdArr
			}
		},()=>{
			console.log(this.state.idType)
			this.props.toFather(this.state.idType);
		})
		console.log(idType)

	}	
	
	render(){
		return (
	        <div className={`modal-header ${this.props.className || ''}`}>
	            <button className="close modal-btn" data-action="close">
	                <span>×</span>
	            </button>
	            <h4 className="modal-title modal-small">
	            	<span className="tilLeftBox">
	            		<span className="til">手动选题</span>
				    	<span className="pageNum">(共<span id="pageNumBig">0</span>页)</span>
	            	</span>
				    <div className="tilRightBox">
				    	<button className="btb preBtb" onClick={this.props.prePage}>上一页</button>
					    <span className="NowPage">第<span id="pageNowBig">{this.props.pageNowBig}</span>页</span>
					    <button className="btb preNext" onClick={this.props.nextPage}>下一页</button>
					    
					    <button className="sureBtb sureBig modal-btn sureBigbtn" data-action="close" onClick={this.sureBig}>确定</button>
					    <button className="sureBtb sureBig searchBig" onClick={this.props.searchSel}>搜索</button>
					    <span className="selectNum selectNumBig" id="selectNumBig">0</span>
				    </div>
				    
				    
				</h4>
	        </div>
	   );	
	}
}


export class ModalBody extends React.Component{
	constructor(props){
        super(props);
    }
	saveCallback=()=>{
		console.log(99)
	}
	render(){
		return (
	        <div className={`modal-body ${this.props.className || ''}`}>
	            {this.props.children}
	        </div>
	    );
	}
    
}

export class AlonesMallTest extends React.Component{
	state={
		checked:false,
		background:"#EAEAEA",
		count:0
	}
	check=(id,type)=>{
		
		this.setState({
			checked:!this.state.checked
		},()=>{
			if(this.state.checked){
				this.setState({
					background:"#FFD343",
					count:this.state.count+1
				},()=>{
					countAll++;
					document.getElementById('selectNum').innerHTML=countAll;
					idType.idArr.push(id)
					console.log(idType.idArr)
					localStorage.setItem('idArr',JSON.stringify(idType.idArr))
				})
			}else{
				this.setState({
					background:"#EAEAEA",
					count:this.state.count-1
				},()=>{
					countAll--;
					document.getElementById('selectNum').innerHTML=countAll;
					for(let i=0;i<idType.idArr.length;i++){
						if(idType.idArr[i].indexOf(id)!=-1){
							idType.idArr.splice(i,1)
						}
					}
					localStorage.setItem('idArr',JSON.stringify(idType.idArr))
					console.log(idType.idArr)
				})
			}
		})
	}
	
	render(){
		let { v,selectedCb } =this.props;
		return(
			<div className="aloneItem" key={v.id} type={this.props.type}>
				<div className="mark" style={{'backgroundColor':this.state.background}} onClick={()=>this.check(v.id,this.props.type)}><span></span></div>
                <HtmlWithTex html={v.html} ref="preview"/>
				<div className="bottomBtn"><button onClick={this.props.showBtbSmall}><span></span><i>查看详情</i></button></div>
			</div>
		)
	}
}

export class BodyDetail extends React.Component{	//小题主体
	constructor(props){
        super(props);
        this.selectedList = []
        this.state={
        	DataLength:true,
        	isShowLength:false
        }
   	}
	
	componentDidMount(){
		this.setState({
			isShowLength:this.props.isShowLength
		},()=>{
			console.log(this.state.isShowLength)
		})
	}
	showBtbSmall(ev){
		let btbCont=ev.currentTarget.getElementsByTagName('i')[0].innerHTML;
		if(btbCont=="查看详情"){
			ev.currentTarget.getElementsByTagName('i')[0].previousSibling.style.transform = 'rotate(180deg)';
			ev.currentTarget.getElementsByTagName('i')[0].innerHTML='收起详情';
			let answers=ev.currentTarget.parentNode.previousSibling.getElementsByClassName('auxiliary');
			for(let j=0;j<answers.length;j++){
				ev.currentTarget.parentNode.previousSibling.getElementsByClassName('auxiliary')[j].style.display="block";
			}
		}else{
			ev.currentTarget.getElementsByTagName('i')[0].previousSibling.style.transform = 'rotate(180deg)';
			ev.currentTarget.getElementsByTagName('i')[0].innerHTML='查看详情';
			let answers=ev.currentTarget.parentNode.previousSibling.getElementsByClassName('auxiliary');
			for(let j=0;j<answers.length;j++){
				ev.currentTarget.parentNode.previousSibling.getElementsByClassName('auxiliary')[j].style.display="none";
			}
		}
	}
	
	
	render(){
			console.log(this.props.resHtml)
			
			const smallAloneDetail=this.props.resHtml.map((v,i)=>(
				<AlonesMallTest key={v.id} v={v} showBtbSmall={this.showBtbSmall} type={this.props.type} selected={this.selectedList.indexOf(v.id)==-1} selectedCb={this.props.selectIt} />	
			))
			
		return (
	        <div className="aloneBox">
	        	{smallAloneDetail}
	        	<p className={`noShow ${this.state.isShowLength?'haveNone':''}`}>暂无数据</p>
	        </div>
	    );
	}
    
}

//单个大题
export class AloneBigTest extends React.Component{
	state={
		checked:false,
		background:"#EAEAEA",
		count:0
	}
	check=(id,type)=>{
		this.setState({
			checked:!this.state.checked
		},()=>{
			if(this.state.checked){
				this.setState({
					background:"#FFD343",
					count:this.state.count+1
				},()=>{
					countAll++;
					let flagPushArr=[];
					document.getElementById('selectNumBig').innerHTML=countAll;
					idType.idArr.push(id)
					localStorage.setItem('idArr',JSON.stringify(idType.idArr))
					console.log(idType.idArr)
				})
			}else{
				this.setState({
					background:"#EAEAEA",
					count:this.state.count-1
				},()=>{
					countAll--;
					document.getElementById('selectNumBig').innerHTML=countAll;
					for(let i=0;i<idType.idArr.length;i++){
						if(idType.idArr[i].indexOf(id)!=-1){
							idType.idArr.splice(i,1)
						}
					}
					localStorage.setItem('idArr',JSON.stringify(idType.idArr))
					console.log(idType.idArr)
				})
			}
		})
	}
	
	render(){
		let { v,selectedCb } =this.props;
		return(
			<div className="aloneItem aloneBig" key={v.id} type={this.props.type}>
				<div className="mark" style={{'backgroundColor':this.state.background}} onClick={()=>this.check(v.id,this.props.type)}><span></span></div>
                <HtmlWithTex html={v.html} ref="preview"/>
				<div className="bottomBtn"><button onClick={this.props.showBtbBig}><span></span><i>查看详情</i></button></div>
			</div>
		)
	}
}

//大题主体
export class BodyDetailBig extends React.Component{
	constructor(props) {
		super(props)
		this.roots = [];
        this.rootTypes = [];
        this.results = {
            treeData: []
		}
	}
	state={
		count:0,
		count2:0,
		doo:null,
		seletctData:[],
		showFlag2:false,
		selected: "",
		treeData:[],
		dotData:[]
	}
	
	filterDatas(results) {
        let { filterPlan, edu } = this.props;
        var processData = results.reduce((total, cur, curIndex, arr) => {
            if (cur.deleted) return total;
            if (this.rootTypes.indexOf(cur.type) == -1) return total;

            if (edu === Edu.kSenior && cur.weight > 0) return total;
            if (edu === Edu.kJunior && (cur.weight < 0 || cur.weight >= 100)) return total;
            if (edu === Edu.kElementary && cur.weight < 100 && cur.weight !== 0) return total;
            cur.children = [];
            cur.treeIndex = cur.treeIndex || parseInt(total.treeIndex * 100);
            total.treeIndex++;
            if (cur.parent_id === null) {
                /*cur.expanded = true;
                cur.active = true;*/
                this.roots.push(cur)
                total.treeData.unshift(cur);
            }
            if (total.temp[cur._id]) {
                cur.children = total.temp[cur._id].children;
                delete total.temp[cur._id]
            }
            if (total.nodeMap[cur.parent_id]) {
                total.nodeMap[cur.parent_id].children.push(cur)
                total.nodeMap[cur.parent_id].children.sort((rn, ln) => rn.treeIndex - ln.treeIndex)
            }
            if (cur.parent_id && !total.nodeMap[cur.parent_id]) {
                total.temp[cur.parent_id] = total.temp[cur.parent_id] || {children: []};
                total.temp[cur.parent_id].children.push(cur);
            }
            cur.children.sort((rn, ln) => rn.treeIndex - ln.treeIndex)
            total.nodeMap[cur._id] = cur;

            return total;
        }, {treeData: [], temp: {}, nodeMap: {}, treeIndex: 0})
        return processData;
    }
	
	componentDidMount() {
		this.getRemoteKtag();
	}
	getRemoteKtag() {
		Q.get(`/api/root_ktags`).done(result => {
			this.rootTypes = result.map(t => t.type);
			this.getRemoteData();
		})
	}
	getRemoteData() {
		Q.get(`/api/ktags`)
			.done((data) => {
				this.results = this.filterDatas(data);
				this.results.treeData.sort(function (a, b) {
					return b.type - a.type
				})
				this.setState({
					selected: this.results.treeData[0]._id,
					treeData: this.results.treeData[0].children
				})
			});
	}
	
	
	showBtbBig(ev){
		let btbCont=ev.currentTarget.getElementsByTagName('i')[0].innerHTML;
		if(btbCont=="查看详情"){
			ev.currentTarget.getElementsByTagName('span')[0].style.transform = 'rotate(180deg)';
			ev.currentTarget.getElementsByTagName('i')[0].innerHTML='收起详情';
			let answers=ev.currentTarget.parentNode.previousSibling.getElementsByClassName('auxiliary');
			for(let j=0;j<answers.length;j++){
				ev.currentTarget.parentNode.previousSibling.getElementsByClassName('auxiliary')[j].style.display="block";
			}
		}else{
			ev.currentTarget.getElementsByTagName('span')[0].style.transform = 'rotate(180deg)';
			ev.currentTarget.getElementsByTagName('i')[0].innerHTML='查看详情';
			let answers=ev.currentTarget.parentNode.previousSibling.getElementsByClassName('auxiliary');
			for(let j=0;j<answers.length;j++){
				ev.currentTarget.parentNode.previousSibling.getElementsByClassName('auxiliary')[j].style.display="none";
			}
		}
	}
	
	getNodeKey = ({node}) => node._id
	
	toggleUlFn(ev){	//下拉过滤
    	this.setState({
            showFlag3:!this.state.showFlag3
       	})
    	let oFlag3=document.getElementById('Flag3');
		if(this.state.showFlag3){
            oFlag3.style.display="none"
       	}else{
            oFlag3.style.display="block"
       	}
		ev.cancelBubble = true;
        ev.stopPropagation();
    }
	
	
	selClick(ev) {
    	let oFlagBig=document.getElementById('FlagBig');
		oFlagBig.style.display="none"
		this.setState({
            showFlag2:false
       	})
        let liCont=ev.target.innerHTML;
        let targetSan=ev.target.parentNode.previousSibling;
        targetSan.innerHTML=liCont;
        
    }
	
	toggleUlFnBig(ev){	//下拉过滤大题
    	this.setState({
            showFlag2:!this.state.showFlag2
       	})
    	let oFlagBig=document.getElementById('FlagBig');
		if(this.state.showFlag2){
            oFlagBig.style.display="none"
       	}else{
            oFlagBig.style.display="block"
       	}
		ev.cancelBubble = true;
        ev.stopPropagation();
    }
	
	selectOption = (val, option) =>{
		this.setState({
			selected: val,
			treeData: option.props.data.children
		})
		console.log('改变筛选条件')
	}
	
	selectTree = (node) => {
		let r = this.state.dotData.filter(d=>d.id==node._id)
		if (!r.length) {
			this.setState({
				dotData:[
					...this.state.dotData,
					{
						id:node._id,
						name:node.name
					}
				]
			},function(){
				localStorage.setItem('dataSel',JSON.stringify(this.state.dotData))
			})
		}
		
	}
	
	delIt=(id)=>{
		let dotData=this.state.dotData.filter((v,i)=>v.id!==id );
    	this.setState({dotData},function(){
    		localStorage.setItem('dataSel',JSON.stringify(this.state.dotData))
    	})
	}
	
	
	render(){

		let SeletctDataFn=this.results.treeData.map((v)=><Option key={v._id} data={v} value={v._id}>{v.name}</Option>)
		const dotDataFn=this.state.dotData.map((v,i)=><li key={v.id}>{v.name}<span onClick={()=>this.delIt(v.id)}>+</span></li>)
		const bigAloneDetail=this.props.resHtml.map((v,i)=>(
				<AloneBigTest key={v.id} v={v} showBtbBig={this.showBtbBig} type={this.props.type}/>	
				
			)) 
		return (
	        <div className="bodyWrap">
	        	<div className="treeBox">
	        		<div className="selectBox">
		        		<div className="ulBox ulBoxBig">
		        		
			            	<span className="ulName">图谱类型</span>
                            <Select style={{width: "120px"}} className="modal-big" showSearch={false} value={this.state.selected} defaultValue={this.state.selected} optionLabelProp="children" onChange={this.selectOption}>{SeletctDataFn}</Select>
			            	
			            </div>
		            </div>
		            <div className="sortBox">
		        		<SortableTree
			                treeData={this.state.treeData}
			                onChange={treeData=>this.setState({treeData: treeData})}
			                searchFocusOffset={0}
			                getNodeKey={this.getNodeKey}
			                generateNodeProps={({node}) => {
			                	
			                    return {
			                    	title: node.name,
			                    	onDoubleClick: ()=>{
			                    		this.selectTree(node)
			                    	}
			                    }
			                }}
			                canDrag={false}
			                canDrop={({nextParent}) =>
			                    !nextParent || !nextParent.noChildren
			                }
			                isVirtualized={true}
			            />
		            </div>
	        	</div>
	        	<div className="aloneItemBox">
	        		<ul className="tilSelect">
	        			<span className="tHead">已选知识点:</span>
	        			{dotDataFn}
	        		</ul>
					<div className="aloneItem alongBigBox">
						{bigAloneDetail}
					</div>
				</div>
				
				
	        </div>
	    );
	}
    
}

BodyDetailBig.defaultProps = {
	edu: 3
}

export class ModalBodySmall extends React.Component{
	constructor(){
        super();
        this.state={
        	age:18
        }
    }
	showBtb=()=>{
		alert(55)
	}

	render(){
		return (
	        <div className={`modal-header ${this.props.className || ''}`}>
	            <button className="close modal-btn" data-action="close">
	                <span>×</span>
	            </button>
	            {this.props.children}
	        </div>
	    );
	}
    
}

export function ModalFooter(props) {
    return (
        <div className={`modal-footer ${props.className || ''}`}>
            {props.children}
        </div>
    );
}






//单单单
export class ModalSingle extends Modal {
	constructor(props){
        super(props);
        this.state={
        	pageNow:1,
        	count:0,
			resHtml:[],
			todos:[],
			edu:4,
			itemid:''
        }
    }
	
    static show(comp) {
        return ReactDom.render(
            comp,
            document.getElementById('dialog-root'));
    }
	

    componentDidMount() {
        $(this._modal).modal('show');
        $(this._modal).on('click', '.modal-btn', (evt) => {
            let handler = this.props[$(evt.currentTarget).data('action')];
            if (!handler) {
                handler = this[$(evt.currentTarget).data('action')].bind(this);
            }
            Q.assert(handler);
            handler(evt, this);
        });
        $(this._modal).on('hidden.bs.modal', this.onHidden.bind(this));
    }

    onHidden() {
        //ReactDom.render(<div />, document.getElementById('dialog-root'));
        ReactDom.unmountComponentAtNode(document.getElementById('dialog-root'));
    }

    close() {
        $(this._modal).modal('hide');
        if (this.props.onClose) {
            this.props.onClose(this);
        }
    }
    
    idGoFatherFn=(resId)=>{
        this.props.callbackSingle && this.props.callbackSingle(this.props.type,resId)
    }
    
    render() {
    	let type=1;
        return (
            <div
                className="modal fade"
                ref={(ref) => { this._modal = ref; }}
            >
                <div
                    className={`modal-dialog ${this.props.modalDialogClass}`}
                    id={this.props.id || `${(new Date()).getTime()}`}
                    style={this.props.modalDialogStyle}
                >
                    <div className="modal-content">
	                    <ModalHeader>
		                    <h4 className="modal-title">
		                        <div class="leftTile">
		                            单题录入<span className="title-span">注:每次仅限录入一个题目</span>
		                        </div>
		                        <div className="rightTile">
		                        </div>
		                    </h4>
		                </ModalHeader>
		                <ModalBody>
		                    <PageModal eduu={this.state.edu} {...this.props} idGoFather={this.idGoFatherFn}/>
		                </ModalBody>
		                <ModalFooter>
		                </ModalFooter>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export class ModalCreateTrue extends React.Component {
	constructor(props){
        super(props);
        this.state={
        	pageNow:1,
        	count:0,
			resHtml:[],
			todos:[],
			edu:4
        }
    }
	
	static show(comp) {
        return ReactDom.render(
            comp,

            document.getElementById('dialog-root'));
    }
	
	close() {
        $(this._modal).modal('hide');
        if (this.props.onClose) {
            this.props.onClose(this);
        }
        countAll=0;
		idType={
				type:0,
				idArr:[]
			}
    }
	
	onHidden() {
        //ReactDom.render(<div />, document.getElementById('dialog-root'));
        ReactDom.unmountComponentAtNode(document.getElementById('dialog-root'));
        countAll=0;
		idType={
				type:0,
				idArr:[]
			}
    }
	
	componentDidMount() {
        $(this._modal).modal('show');
        $(this._modal).on('click', '.modal-btn', (evt) => {
            let handler = this.props[$(evt.currentTarget).data('action')];
            if (!handler) {
                handler = this[$(evt.currentTarget).data('action')].bind(this);
            }
            Q.assert(handler);
            handler(evt, this);
        });
        $(this._modal).on('hidden.bs.modal', this.onHidden.bind(this));
    }
	
	
	
	render(){
		return(
			<div className="modal fade" ref={(ref) => { this._modal = ref; }}>
                <div
                    className={`modal-dialog ${this.props.modalDialogClass}`}
                    id={this.props.id || `${(new Date()).getTime()}`}
                    style={this.props.modalDialogStyle}
                >
                    <div className="modal-content">
	                    {this.props.children}
                    </div>
                </div>
            </div>
		)
	}
}