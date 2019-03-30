// 在屏幕显示的提示条，用以给予用户操作反馈
import React from 'react';
import ReactDom from 'react-dom';
import { Q, Edu, EduDesc } from 'js/quantum';
import $ from 'jquery';

export class Modal extends React.Component {
    constructor(props){
        super(props);


    }
  // static confirm = false;
  // static resultt = false;
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

    // confirm = ()=>{
    //   Modal.confirm = true;
  //     Modal.resultt = true;
  //     return true;
  //   }
  //   cancel = ()=>{
  //     Modal.confirm = true;
  //     Modal.resultt = false;
  //     return false;
  //   }
  // static hasClicked (){
  //     if(Modal.confirm){
  //       Modal.confirm = false;
  //       return true;
  //     }
  //     return false;
  //   }


    render() {
        return (
         <div
          className="modal fade"
          ref={(ref) => { this._modal = ref; }}
         >
             <div
              className={`modal-dialog ${this.props.modalDialogClass}`}
              style={{width:'430px',height:'240px',marginTop:'50%',borderRadius:'2px'}}
              id={this.props.id || `${(new Date()).getTime()}`}
              style={this.props.modalDialogStyle}
             >
                 <div className="modal-content" style={{height:'240px',width:'430px',marginTop:'50%'}}>
                     <ModalHeader>
                         <h4 className="modal-title">{this.props.title}</h4>
                     </ModalHeader>
                      <ModalBody>
                          {this.props.content}
                      </ModalBody>
                      <ModalFooter>
                          <button
                           type="button" className="btn btn-default modal-btn cancel-btn"
                           style={this.props.showCancelBtn == false? this.props.showCancelBtnStyle: {width:'80px',
                              height:'30px',
                              padding: '0',
                              background:'rgba(255,255,255,1)',
                              borderRadius:'2px',
                              border:'1px solid rgba(225,225,225,1)',
                               fontSize:'13px',
                               color:'rgba(120,120,120,1)',
                               marginRight:'10px'
                           }}
                           onClick={this.props.cancel}
                           data-action="close"
                          >
                              取消
                          </button>
                          <button
                           type="button" className="btn btn-default modal-btn sure-btn"
                           style={{width:'80px',
                               height:'30px',
                               padding: '0',
                               background:'rgba(255,211,67,1)',
                               borderRadius:'2px',
                               fontSize:'13px',
                               color:'#787878',
                               marginRight:'10px'
                           }}
                           onClick={this.props.confirm}
                           data-action="close"
                          >
                              确定
                          </button>
                      </ModalFooter>
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
    showCancelBtnStyle: {display:'none'}
};

export function ModalHeader(props) {
    return (
     <div className={`modal-header ${props.className || ''}`} style={{height:'40px'}}>
         <button className="close modal-btn" data-action="close">
             <span>×</span>
         </button>
         {props.children}
     </div>
    );
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
         <div className={` ${this.props.className || ''}`} style={{height:'150px',padding:'40px 20px',fontSize:'16px',color:'#787878'}}>
             {this.props.children}
         </div>
        );
    }
}
export function ModalFooter(props) {
    return (
     <div className={`modal-footer ${props.className || ''}`} style={{height:'50px',border:'none',padding:'0px',textAlign:'right'}}>
         {props.children}
     </div>
    );
}

export function showAlertModal(tip,cont,showCancelBtn,confirm,cancel) {
   Modal.show(
   <Modal title={tip} content={cont} showCancelBtn={showCancelBtn} confirm={confirm} cancel={cancel}>
   </Modal>
  );

}

export default showAlertModal;