import React from 'react'
import axios from 'js/utils/api'
import HtmlWithTex from "../widgets/html_with_tex";
let optionNumMap = ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ", "Ⅹ", "Ⅺ", "Ⅻ"]
let groupNumMap = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
export default class Preview extends React.Component{

  constructor(props){
    super(props)
  }
  state = {
    paper: {}
  }
  componentDidMount() {
    axios.get(`/api/paper/paper_view/${this.props.params.id}`)
      .then(data => {
        this.setState({
          paper: data
        })
      })
  }
  render() {
    let {paper} = this.state;
    return (
        <div className="paper_preview">
          <PreviewPaper paper={paper}/>
        </div>
    )
  }
}

export class PreviewPaper extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    paper: this.props.paper
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      paper: nextProps.paper
    })
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.paper != this.state.paper
  }

  render() {
    let {paper} = this.state;
    if(!paper.name) return null;
    let groupIndex = 0, itemIndex = 0, optionItemIndex = 0;
    paper.volumes.forEach(volume => {
      volume.groups.forEach(group => {
        optionItemIndex += group.items.length;
      })
    })
    return (
      <div className="previewPaper">
        <header>{paper.name}</header>
        {
          paper.desc? <div className="desc desc1">{paper.desc}</div>: null
        }
        {
          paper.attention? <div className="desc" dangerouslySetInnerHTML={{__html:paper.attention}}></div>: null
        }
        {
          paper.volumes.map((volume,index, array) => {
            groupIndex += index == 0 ? 0 : array[index - 1].groups.length;
            itemIndex += index == 0 ? 0 : array[index - 1].groups.reduce((acc, cur) => acc + cur.items.length, 0)
            return <PaperVolume type="volume" key={`volumes${index}`} itemIndex={itemIndex} volumeIndex={index} volume={volume} groupIndex={groupIndex}></PaperVolume>
          })
        }
        {
          paper.choose_item.map((group, index, array) =>{
            optionItemIndex += index == 0 ? 0: array[index-1].items.length;
            return <PaperGroup key={`groups${index}`} type="option" itemIndex={optionItemIndex}  groupIndex={index} key={Math.random()} group={group}></PaperGroup>
          })
        }
      </div>
    )
  }

}

const PaperVolume = ({volume, volumeIndex, itemIndex, groupIndex, type}) => {
  let {groups, title, desc} = volume;
  return (
    <div className="paperVolume">
      <h2>第{optionNumMap[volumeIndex]}卷 {title}</h2>
      <p className="Volumedesc">{desc}</p>
      {
        groups.map((group, index, arry) => {
          if (index) {
            itemIndex += arry[index-1].items.length;
          }
          return <PaperGroup key={`group${groupIndex}`} itemIndex={itemIndex} type={type} volumeIndex={volumeIndex} groupIndex={index + groupIndex} group={group}></PaperGroup>
        })
      }
    </div>
  )
}

const PaperGroup = ({group, groupIndex, itemIndex, type}) => {
  let {intro, items} = group;

  return (
    <div className="paperGroup">
      {
        intro ? <p className="groupDesc"> {intro}</p>: type== "option" ? `选做题${optionNumMap[groupIndex]}`: `${groupNumMap[groupIndex]}题`
      }
      {
        items.map((item, index) => <Item key={item.item_id} item={item} itemIndex={itemIndex+index+1}/>)
      }
    </div>
  )
}

class Item extends React.Component{
  constructor(props) {
    super(props)
  }
  state = {
    html: ""
  }
  componentDidMount() {
    axios.get(`/api/item/${this.props.item.item_id || this.props.item.id }/html`)
      .then(data => {
        this.setState({
          html: data.html
        })
      })
  }
  render() {
    let { html } = this.state;
    return (
      <div className="paper-preview-item">
        <div style={{fontWeight: 'bold'}}>{this.props.item.before}</div>
        <div className="paper-preview-item-wrapper">
          <span className="count">{this.props.itemIndex}.</span>

          <HtmlWithTex html={html}/>
        </div>
      </div>

    )
  }
}