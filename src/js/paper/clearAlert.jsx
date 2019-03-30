import React from 'react';
import ReactDom from 'react-dom';
import $ from 'jquery';
import { Q } from 'js/quantum';
import axios from 'js/utils/api'

//头部
export class ModalHeader extends React.Component{
	
	
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

export class ModalBody extends React.Component{
	render(){
		return (
	        <div className={`modal-body ${this.props.className || ''}`}>
	            {this.props.children}
	        </div>
	    );
	}
    
}

export class ModalDel extends React.Component{
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
    
    render() {
    	let type=1;
        return (
            <div className="modal fade" ref={(ref) => { this._modal = ref; }} data-backdrop="static" >
                <div
                    className={`modal-dialog`}
                    id={this.props.id || `${(new Date()).getTime()}`}
                    style={this.props.modalDialogStyle}
                >
                    <div className="modal-content alertDel">
	                    <ModalHeader>
		                    <h4 className="modal-title">
		                        <div class="leftTile">{this.props.title}<span className="nowNum"></span>
		                        </div>
		                        <div className="rightTile">
		                        	
		                        </div>
		                    </h4>
		                </ModalHeader>
		                <ModalBody>
		               		<p className="con" style={{height:'22px'}}>{this.props.til}</p>
		               		<div>
		               			<button className="sureClear close modal-btn" onClick={this.props.sureDel} data-action="close">确定</button>
		                		<button className="cancelClear  close modal-btn" onClick={this.props.cancelC} data-action="close">取消</button>
		               		</div>
		                	
		                </ModalBody>
                    </div>
                </div>
            </div>
        );
    }
}

