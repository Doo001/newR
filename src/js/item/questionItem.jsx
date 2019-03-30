import React from 'react'
import HtmlWithTex from 'js/widgets/html_with_tex'
import { Q } from 'js/quantum'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'js/widgets/modal';
import ItemParsing from 'subjects/<%SUBJECT%>/parsePage';
import { Grid, Row, Col } from 'react-flexbox-grid';
import PropTypes from 'prop-types';
import Select, {Option, OptGroup} from 'rc-select';
import 'rc-select/assets/index.css';


export class QuestionItem extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        type: this.props.node.type,
        node: this.props.node,
        index: this.props.index,
        html:"",
        upAble:this.props.upAble,
        downAble: this.props.downAble
      }

    }
    componentDidMount(){
		  this.getQuestionContentById(this.state.node.data.content);
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        type: nextProps.node.type,
        node: nextProps.node,
        index: nextProps.index,
        upAble:nextProps.upAble,
          //html: nextProps.node.html,
        downAble: nextProps.downAble
      });
      this.getQuestionContentById(nextProps.node.data.content);
    }

   /**
   *根据题的id得到内容
   * @param id  题的id
   */
    getQuestionContentById(itemId){
      if (!itemId.toString()||itemId.toString()=='') {
        this.setState({ html: '' });
        return;
      }
      Q.get(`/api/item/${itemId.toString()}/html`)
       .done(result => {
           this.state.node.html = result.html;
         this.setState({ html: result.html });
       })
    }


    onChange = (e) => {
      let value;
      let title;
      if (e && e.target) {
        value = e.target.value;
        title = this.state.titles.filter(obj => obj.type===e.target.value);
      } else {
        value = e;
        title = this.state.titles.filter(obj => obj.type===e);
      }
      this.state.node.data.type = value;
      this.state.node.data.title = title[0].title;
      this.forceUpdate()
      //this.props.syncPlanNode(this.props.index,this.state.node);
    };

    render() {
       // let {node} = this.props;

      let titles = [];
      if(this.state.node.data.type == 1 || this.state.node.data.type == 2){
        titles = [
          {title:'经典例题',type:1},
          {title:'巩固练习',type:2}
        ];
      }else if(this.state.node.data.type == 3 || this.state.node.data.type == 4) {
        titles = [
          {title:'拓展例题',type: 3},
          {title: '拓展练习',type: 4}
        ];
      }
      this.state.titles = titles;

        return (
            <div key={this.state.node.data.content} id={this.state.node.data.content} className="questionItem paper-border paper-item">
                <div className="plan-tabs">
                  <Select
                   id="my-select"
                   value={this.state.node.data.type}
                   placeholder="请选标题"
                   dropdownMenuStyle={{ maxHeight: 400 }}
                   style={{ width: 120 }}
                   onBlur={this.onBlur}
                   onFocus={this.onFocus}
                   optionLabelProp="children"
                   optionFilterProp="text"
                   onChange={this.onChange}
                   backfill
                  >
                    {titles.map((i) => {
                      return <Option key={i.type} value={i.type} text={String(i.title)}>{i.title}</Option>;
                    })}
                  </Select>
                  <span className="closeIt" onClick={() => {this.props.removePlan(this.state.index,this.state.node)}}>+</span>

                </div>
                <div className={`item-display ${[1,2].indexOf(this.state.node.data.type) != -1 ?"regularQ":"expandQ"}`}>
                    <HtmlWithTex html={this.state.html} />
                </div>
                <div className="general-info">
                    <span className="label no-click code"> {this.state.node.data.content} </span>
                    &nbsp;

                    <a href={`/item/${this.state.node.data.content}`} target='_blank'> 查看 </a>
                    &nbsp;
                    <a href={`/item/${this.state.node.data.content}/tag`} target='_blank'> 标注 </a>
                    &nbsp;
                    <a href={`/item/${this.state.node.data.content}/typeset`} target='_blank'> 排版 </a>
                    &nbsp;
                    <a href={`/item/${this.state.node.data.content}/cluster`} target='_blank'> 聚类 </a>
                </div>
                <div className="btns">
                    <button
                        className={`btn-icon up ${this.state.upAble== false?'hidebtn':''}`}
                        onClick={() => {
                            this.props.movePlan(true, this.state.index, this.state.node);
                        }}>上移
                    </button>
                    <button className={`btn-icon down ${this.state.downAble== false?'hidebtn':''}`}
                        onClick={() => {
                            this.props.movePlan(false, this.state.index, this.state.node);
                        }}>下移
                    </button>
                </div>

            </div>
        )
    }
}

QuestionItem.propTypes = {
  downAble: PropTypes.bool,
  upAble: PropTypes.bool,
  node: PropTypes.object,
  index: PropTypes.number,
  movePlan: PropTypes.func,
  syncPlanNode: PropTypes.func,
  removePlan: PropTypes.func
}
