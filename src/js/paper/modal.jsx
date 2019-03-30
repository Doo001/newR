import React,{createContext} from 'react';
import ReactDom from 'react-dom';
import { Q, Edu, EduDesc } from 'js/quantum';
import $ from 'jquery';
import {HtmlWithTex} from 'js/widgets/html_with_tex';
import ItemParsing,{PageModal} from 'subjects/<%SUBJECT%>/parsePage';
import { getSubject } from 'js/subjects';
import Select, {Option, OptGroup} from 'rc-select';
import {store} from "../main_entry";
import axios from 'js/utils/api'
import {showAlert} from 'js/widgets/alert';

//头部
export class ModalHeader extends React.Component{
	
	render(){
		return (
	        <div className={`modal-header ${this.props.className || ''}`}>
	        {
	        	this.props.canNext?<div><button className="btn btn-default btbCommon paiBan"   onClick={this.props.paiBan}> 保存&排版</button>
	            <button className="btn btn-default btbCommon nextTest" onClick={this.props.nextTest} > 保存&下一题 </button>	</div>
	            :<div><button className="btn btn-default btbCommon paiBan" disabled  onClick={this.props.paiBan}> 保存&排版</button>
	            <button className="btn btn-default btbCommon nextTest"  disabled onClick={this.props.nextTest} > 保存&下一题 </button>	</div>
	        }
	            <button className="close modal-btn" onClick={this.what} data-action="close">
	                <span>×</span>
	            </button>
	            {this.props.children}
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
export function ModalFooter(props) {
    return (
        <div className={`modal-footer ${props.className || ''}`}>
            {props.children}
        </div>
    );
}

//单单单
export class ModalSingle extends React.Component{
	constructor(props){
        super(props);
        this.state={
        	pageNow:1,
        	count:0,
			resHtml:[],
			todos:[],
			edu:4,
			itemid:'',
			numNow: this.props.nowNum +1,
			canNext:false,
			dis:true,
			paiId:''
        }
    }
	
    static show(comp) {
        return ReactDom.render(
            comp,
            document.getElementById('dialog-root'));
    }
	
    componentDidMount() {
    	console.log(this.state.numNow)
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

    onHidden(ev) {
        //ReactDom.render(<div />, document.getElementById('dialog-root'));
        ReactDom.unmountComponentAtNode(document.getElementById('dialog-root'));
    }

    close(ev) {
        $(this._modal).modal('hide');
        if (this.props.onClose) {
            this.props.onClose(this);
        }
    }
    
    idGoFatherFn=(resId)=>{
        this.props.callbackSingle && this.props.callbackSingle(this.props.type,resId)
    }
    
    //保存公共
    save=(fnOpen)=>{
    	let jsonData= {
    		'action':'save',
    		'data':this.back._getRawData(),
    		'paper':this.props.paperId ,
    	}
    	var thatIt=this;
		axios.post(`/api/item`, jsonData)
	    	.then(res => {
    			this.props.addNew(res);
	    		thatIt.back.clearText();
	    		this.setState({
		    		numNow:this.state.numNow+1,
		    		canNext:false,
		    		dis:false,
		    		paiId:res,
		    	})
	    		showAlert("保存成功")
	    		this.back.clear();
	    		document.getElementById('tilLeft').style.display='block';
	    		//成功后将clear置成false
	    		this.props.clearFalse()
	    		fnOpen();
	        })
	    	.catch((err)=>{
	    		console.log(JSON.stringify(err))
	    	});
    }
    
    
    //保存下一题
    nextT=()=>{
    	this.save()
    }
    
    goPai=()=>{
    	console.log(this.state.paiId)
    	window.open(`/item/${this.state.paiId}/typeset`)
    }
    
    
    //保存排版
    paiB=()=>{
    	this.save(this.goPai)
    }
    
    //预览后是否可以进行下一步
    canNext=(res)=>{
    	this.setState({
    		canNext:res
    	})
    }
    
    setDis=(res)=>{
    	this.setState({
    		dis:res 
    	})
    }
    
    render() {
    	let type=1;
        return (
            <div data-backdrop="static" className="modal fade" ref={(ref) => { this._modal = ref; }}>
                <div
                    className={`modal-dialog ${this.props.modalDialogClass}`}
                    id={this.props.id || `${(new Date()).getTime()}`}
                    style={this.props.modalDialogStyle}
                >
                    <div className="modal-content modal_LuPai">
	                    <ModalHeader canNext={this.state.canNext} nextTest={this.nextT} paiBan={this.paiB} >
		                    <h4 className="modal-title">
		                        <div class="leftTile">
		                            题目新建<span className="nowNum">第<span>{this.state.numNow}</span>题</span>
		                        </div>
		                        <div className="rightTile">
		                        	
		                        </div>
		                    </h4>
		                </ModalHeader>
		                <ModalBody>
		                    <PageModal disDiff="1" disTrue={this.setDis.bind(this)} dis={this.state.dis} canNext={this.canNext} ref={a=>this.back=a} eduu={this.state.edu} {...this.props} idGoFather={this.idGoFatherFn}/>
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

