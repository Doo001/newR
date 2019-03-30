import React from 'react'
import PropTypes from "prop-types";
import { Provider } from 'react-redux'
import { store } from "js/main_entry";
import {Grid, Row, Col} from 'react-flexbox-grid';
import {Modal, Modalbig,ModalSingle} from "../widgets/modal";
export default class AddContent extends React.Component {
    constructor(props) {
        super(props)
    }
    state = {
        change: false
    }
    //单题录入
    addSingleItem = (type)=>{
        this.ModalSingle = ModalSingle.show(
            <Provider store={store}>
                <ModalSingle id="sinId" modalDialogClass="modal-big" type={type} edu={this.props.edu} callbackSingle={this.props.addItemContent}>

                </ModalSingle>
            </Provider>
        );
        this.setState({change:false});//关入口模块
    }
    //小题库
    smallItem = (type)=>{
    	localStorage.removeItem('idArr');
    	localStorage.removeItem('dataSel');
    	
        this.modal = Modal.show(
            <Modal modalDialogClass="modal-big"  id={this.props.id} type={type} callback={this.props.addItemContent}>
            </Modal>
        );
        this.setState({change:false});//关入口模块
    }

    //大题库
    bigItem= (type)=>{
    	localStorage.removeItem('idArr');
    	localStorage.removeItem('dataSel');
    	localStorage.setItem('dataSel',JSON.stringify([]))
        this.Modalbig = Modalbig.show(
            <Modalbig modalDialogClass="modal-big" id={this.props.id} type={type} edu={this.props.edu} callbackBig={this.props.addItemContent}>
              	  
            </Modalbig>
        );
       this.setState({change:false});//关入口模块
    }
    addTarget = () => {
        this.setState({change:!this.state.change});
    }

    render() {
        let change = this.state.change;
        return (
            <Row center="xs" className="addIcon">
                <Col xs>
                    <Row center="xs" className="addbtnModel">
                        <a className={`addTarget ${change?"closeTarget":""}`} onClick={this.addTarget}></a>
                    </Row>
                    <div className={`addWrap ${change?"":" rowHide"}`}>
                        <div className="addRow">
                            <div  className="entranceCol">
                                <div>
                                    <header className="headerBlue">
                                        常规文本
                                    </header>
                                    <article>
                                        <ul>
                                            <li onClick={e=>{e.stopPropagation();this.setState({change:false});this.props.addTextContent(3)}}>教案文本</li>
                                            <li onClick={e=>{e.stopPropagation();this.setState({change:false});this.props.addTextContent(103)}}>教材文本</li>
                                        </ul>
                                    </article>
                                </div>
                            </div>
                            <div  className="entranceCol">
                                <header className="headerBlue">
                                    常规题目
                                </header>
                                <article>
                                    <ul>
                                        <li onClick={e=>{e.stopPropagation();this.addSingleItem(1)}}>单题录入</li>
                                        <li onClick={e=>{e.stopPropagation();this.bigItem(1)}}>调用大题库</li>
                                        <li onClick={e=>{e.stopPropagation();this.smallItem(1)}}>调用教案备用题</li>
                                    </ul>
                                </article>
                            </div>
                            <div  className="entranceCol">
                                <header className="headerYellow">

                                拓展文本
                                </header>
                                <article>
                                    <ul>
                                        <li onClick={e=>{e.stopPropagation();this.setState({change:false});this.props.addTextContent(4)}}>拓展讲解</li>
                                        <li onClick={e=>{e.stopPropagation();this.setState({change:false});this.props.addTextContent(5)}}>拓展小结</li>
                                        <li onClick={e=>{e.stopPropagation();this.setState({change:false});this.props.addTextContent(6)}}>无须标题</li>
                                    </ul>
                                </article>
                            </div>
                            <div  className="entranceCol">
                                <header className="headerYellow">

                                拓展题目
                                </header>
                                <article>
                                    <ul>
                                        <li onClick={e=>{e.stopPropagation();this.addSingleItem(3)}}>单题录入</li>
                                        <li onClick={e=>{e.stopPropagation();this.bigItem(3)}}>调用大题库</li>
                                        <li onClick={e=>{e.stopPropagation(); this.smallItem(3)}}>调用教案备用题</li>
                                    </ul>
                                </article>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        )
    }
}

AddContent.propTypes = {
    addTextContent: PropTypes.func,
    addItemContent: PropTypes.func
}