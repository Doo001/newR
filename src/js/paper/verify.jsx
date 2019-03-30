import React from 'react'
import {PreviewPaper} from './preview'
import axios from 'js/utils/api'
import Portal from 'js/widgets/Portal'
import {Row, Col} from 'react-flexbox-grid'
import {showAlert} from 'js/widgets/alert';

import "css/paper/verify.scss"
let optionNumMap = ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ", "Ⅹ", "Ⅺ", "Ⅻ"]
let groupNumMap = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
export default class PaperVerify extends React.Component{
  constructor(props){
    super(props)
    this.groups = [], this.options =[];
  }
  state = {
    total: "",
    status: false,
    pending: false,
    paper: {},
    showConfirm: false
  }
  componentDidMount() {
    Promise.all([ axios.get(`/api/paper/paper_view/${this.props.params.id}`), axios.post(`/api/paper/check_paper_state/${this.props.params.id}/`)])
      .then(data => {
        this.state.status = data[1]
        this.calculation(data[0])
      })
  }

  calculation(data) {
    let total = 0;
    data.choose_item.forEach(group => {
      /*let score = group.items.reduce((cac, item) =>{
        cac += item.score.reduce((total, cur) => total + cur)
        return cac
      },0)*/
      if(group.items && group.items.length && group.items[0].score) {
        this.options.push(group.items[0].score.reduce((cac, cur) => cac + cur))
      }

    })
    data.volumes.forEach(volume => {
      volume.groups.forEach(group => {
        this.groups.push(group.items.reduce((cac, item) =>{
          cac += item.score.reduce((total, cur) => total + cur)
          return cac
        },0))
      })
    })
    total += this.groups.reduce((cac, cur)=>cac+cur);
    total += this.options.length? this.options[0]: 0
    this.setState({
      paper: data,
      total
    })
  }
  confirm = e=> {
    e.stopPropagation();
    this.setState({
      showConfirm: true
    })
  }
  goBack = e => {
    e.stopPropagation();
    if (this.state.status) {
      showAlert('此试卷已经录排完成，不可再去排版', 'danger')
    } else {
      this.props.router.push(`/paper/composition/${this.props.params.id}`)
    }
  }
  render () {
    let {showConfirm, paper, total, status} = this.state;
    return (
      <div className="verify-wrapper">
        {
          showConfirm? <Portal previewPlan={showConfirm} containerClassName="paper-modal-container"><ShowConfirm paper={paper} status={status} {...this.props} /></Portal>: null
        }
        <Row center="xs" className="verify-header">
          <Col xs={4}>
            <div style={{textAlign: "center"}}>
              <p className="wholeDesc">
                请确认系统预测分值与手动输入信息中分值是否一致
              </p>
              <p className="totalScore">本试卷总分：共{total}分</p>

            </div>
          </Col>
        </Row>
        <Row>
          {
            this.groups.map((group, index) =><Col key={`grouptotal${index}`} xs={3} className="everyScore"><span>第 {groupNumMap[index]} 题：共{group}分</span></Col>)
          }
          {
            this.options.map((option, index) => <Col key={`optiontotal${index}`} xs={3} className="everyScore"><span>选做题组{optionNumMap[index]} ：共{option}分</span></Col>)
          }
        </Row>
        <div className="verify-preview">
          <PreviewPaper paper={paper}/>
        </div>
        <div className="preview-ctr">
          <ul>
            <li>
              <a onClick={this.confirm}>确定</a>
            </li>
            <li>
              <a onClick={this.goBack}>返回修改</a>
            </li>
          </ul>

        </div>
      </div>)
  }

}

class ShowConfirm extends React.Component {
  constructor(props) {
    super(props)
  }
  jump =(type) => {
    this.props.router.push(type == 'create' ? "/<%SUBJECT%>/paper/create": "/<%SUBJECT%>/omega_papers" )
  }
  unLock = type => {
    if (this.props.status) {
      this.jump(type)
    } else {
      axios.post(`/api/paper/unlock_paper/${this.props.paper._id}`)
        .then(data => {
            this.jump(type)
          }
        )
    }
  }
  render() {
    return (
      <div>
        <header>确定操作</header>
        <article>
          您已完成当前试卷录排, 请继续下一份试卷的创建或录排
        </article>
        <footer>
          <Row>
            <Col xs={6} className="btnwrap"><a className="modelBtn" onClick={e => {this.unLock('create')}} >去创建试卷</a></Col>
            <Col xs={6} className="btnwrap"><a className="modelBtn" onClick={e => {this.unLock('list')}}>去试卷列表</a></Col>
          </Row>
        </footer>
      </div>)
  }

}