import React from 'react'
import {showAlert} from 'js/widgets/alert';
import PropTypes from 'prop-types'
import HtmlWithTex from "../widgets/html_with_tex";
import axios from 'js/utils/api'
import {Row, Col} from 'react-flexbox-grid'
import {connect} from 'react-redux'
import {
  initComposition,
  updatePaperForm,
  addVolume,
  delVolume,
  delGroup,
  addGroup,
  asyncVolume,
  asyncGroup,
  setSelectItem,
  addGroupItem,
  delGroupItem,
  delOptionItem,
  delOption,
  addOption,
  asyncOption,
  asyncItemBefore
} from 'store/actions'
import Portal from 'js/widgets/Portal'
import 'css/paper/compositon.scss'

class Composition extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    axios.get(`api/paper/paper_view/${this.props.params.id}`).then(data => {
      data.volumes.forEach(volume => {
        volume.key = Math.round(Math.random() * 1000000)
      })
      this.props.initComposition(data)
    });
  }

  render() {
    return (
      <Row className="composition">
        <Col xs style={{backgroundColor: 'white'}}>
          <ExamItemWrap/>
        </Col>
        <div style={{width: 690, backgroundColor: 'white', marginLeft: 10}}>
          <div className="content-wrapper">
            <div className='content-body'>
              <PaperForm/>
              <VolumeWrap/>
              <OptionWrap/>
            </div>
            <div className='content-footer'>
              <CompositionOperation {...this.props}/>
            </div>
          </div>
        </div>

      </Row>
    );
  }
}

class VolumeWrap extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let {volumes} = this.props, groupIndex = 0, itemIndex = 0
    return (
      <div>
        {
          volumes.map((volume, index, array) => {
            groupIndex += index == 0 ? 0 : array[index - 1].groups.length;
            itemIndex += index == 0 ? 0 : array[index - 1].groups.reduce((acc, cur) => acc + cur.items.length, 0)
            return (<VolumeItem key={`volume${volume.key}`} random={Math.random()} volume={volume} volumeIndex={index}
                                groupIndex={groupIndex}
                                itemIndex={itemIndex}/>)
          })
        }
      </div>
    )
  }
}

VolumeWrap = connect(function (state) {
  return {
    volumes: state.composition.paper.volumes
  }
})(VolumeWrap)

var OptionWrap = ({paper}) => {
  let {choose_item, volumes} = paper;
  let itemIndex = 0;
  volumes.forEach(volume => {
    volume.groups.forEach(group => {
      itemIndex += group.items.length;
    })
  })
  return (
    <div className="group-wrap">
      {
        choose_item.map((choose, index, arry) => {
          itemIndex += index == 0 ? 0: arry[index-1].items.length;
          return <GroupItemWrap itemIndex={itemIndex} key={`options${index}`} random={Math.random()} index={index} group={choose} groupIndex={index} type="option" />
          }
        )
      }
    </div>
  )
}

OptionWrap = connect(function (state) {
  return {
    paper: state.composition.paper,

  }
})(OptionWrap)

export default connect(null, function (dispatch) {
  return {
    initComposition: (paper) => dispatch(initComposition(paper))
  }
})(Composition)

class PaperForm extends React.Component {
  constructor(props) {
    super(props)
  }

  state = {
    attention: this.props.attention,
    desc: this.props.desc
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      attention: nextProps.attention,
      desc: nextProps.desc
    })
  }

  setPaperTitle = e => {
    this.setState({
      desc: e.target.value
    })
  }
  setPaperDesc = e => {
    this.setState({
      attention: e.target.value
    })
  }

  syncPaper = e => {
    this.props.onChange(this.state)
  }

  render() {
    let {attention, desc} = this.state, {name} = this.props;
    return (
      <div className="composition-form-header">
        <div
          style={{textAlign: 'center', height: 40, lineHeight: '40px', marginBottom: 10, fontWeight: 600}}>{name}</div>
        <input className='form-control' type="text" value={desc} placeholder="说明（整份试卷的说明描述，居中显示）"
               onChange={this.setPaperTitle} onBlur={this.syncPaper}/>
        <textarea style={{textAlign: "left"}} className='form-control' type="text" value={attention} placeholder='注意事项（整份试卷的注意事项，居左对齐）'
               onChange={this.setPaperDesc} onBlur={this.syncPaper} />
      </div>
    )
  }
}

PaperForm = connect(function (state) {
  return {
    attention: state.composition.paper.attention,
    name: state.composition.paper.name,
    desc: state.composition.paper.desc
  }
}, function (dispatch) {
  return {
    onChange: state => dispatch(updatePaperForm(state))
  }
})(PaperForm)


class VolumeItem extends React.Component {
  constructor(props) {
    super(props);
    this.VolumeNumMap = ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ", "Ⅹ", "Ⅺ", "Ⅻ"];
  }

  state = {
    volume: {...this.props.volume}
  }
  setVolumeTitle = e => {
    let value = e.target.value;
    this.setState(state => {
      return {volume: {...state.volume, title: value}}
    }, () => {
      this.props.asyncVolume(this.props.volumeIndex, value, this.state.volume.desc)
    })
  }
  setVolumeDesc = e => {
    let value = e.target.value;
    this.setState(state => {
      return {volume: {...state.volume, desc: value}}
    }, () => {
      this.props.asyncVolume(this.props.volumeIndex, this.state.volume.title, value)
    })
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.volume) != JSON.stringify(this.state.volume)) {
      this.setState({
        volume: {...nextProps.volume}
      })
    }
  }

  render() {
    let {volume} = this.state, {volumeIndex, groupIndex, itemIndex} = this.props;
    return <div>
      <Row middle='xs' style={{marginBottom: 10}}>
        <Col xs={4}>
          <a onClick={e => {
            this.props.addVolume()
          }} className="volume-operation">
            +添加分卷
          </a>
          {
            volumeIndex != 0 ? <a onClick={e => {
              this.props.delVolume(volumeIndex)
            }} className="volume-operation">-删除分卷</a> : null
          }
        </Col>
        <Col xs={4}>
          <Row middle='xs'>
            <div>
              第{this.VolumeNumMap[this.props.volumeIndex]}卷
            </div>
            <Col xs>
              <input className='form-control' type="text" value={volume.title} placeholder="试卷标题"
                     onChange={this.setVolumeTitle}/>
            </Col>
          </Row>
        </Col>
      </Row>
      <div>
        <input className='form-control' type="text" onChange={this.setVolumeDesc} value={volume.desc}
               placeholder="说明（第Ⅰ卷的说明描述，居中显示）"/>
      </div>
      <div className="group-wrap">
        {
          volume.groups.map((group, index, arry) => {
            if (index != 0 ) {
              itemIndex += arry[index-1].items.length;
            }
            return <GroupItemWrap random={Math.random()} index={index} key={`group${volumeIndex}${index}`}
                                  itemIndex={itemIndex} volumeIndex={volumeIndex} groupIndex={index + groupIndex}
                                  group={group}/>
          })
        }
      </div>

    </div>;
  }

}

VolumeItem.propTypes = {
  volumeIndex: PropTypes.number,
  volume: PropTypes.object,
  groupIndex: PropTypes.number,
  itemIndex: PropTypes.number

}

VolumeItem = connect(null, function (dispatch) {
  return {
    asyncVolume: (index, title, desc) => dispatch(asyncVolume(index, title, desc)),
    delVolume: index => dispatch(delVolume(index)),
    addVolume: () => dispatch(addVolume())
  }
})(VolumeItem)

class GroupItemWrap extends React.Component {
  constructor(props) {
    super(props);
    this.optionNumMap = ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ", "Ⅹ", "Ⅺ", "Ⅻ"]
    this.groupNumMap = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
  }

  state = {
    group: this.props.group
  }
  setGroupDesc = e => {
    let {index, volumeIndex, type, asyncGroup, asyncOption} = this.props;
    this.setState({
      group: Object.assign({}, {...this.state.group}, {intro: e.target.value})
    }, () => {
      if (type == 'volume') {
        asyncGroup(volumeIndex, index, this.state.group.intro)
      } else {
        asyncOption(index, this.state.group.intro)
      }

    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      group: {...nextProps.group}
    })
  }
  removeItem = e => {
    let {index, volumeIndex, type, delGroupItem, delOptionItem} = this.props;
    e.stopPropagation();
    if (type == 'volume') {
      delGroupItem(volumeIndex, index)
    } else {
      delOptionItem(index)
    }
  }
  setSelectItem = e => {
    let {index, volumeIndex, type, setSelectItem} = this.props;
    if (type == 'volume'){
      setSelectItem(volumeIndex, index)
    } else {
      setSelectItem(null, index)
    }
  }
  delGroup = e => {
    e.stopPropagation();
    let {groupIndex, index, volumeIndex, type, delGroup, delOption} = this.props;
    if (type == 'volume') {
      delGroup(volumeIndex, index)
    } else {
      delOption(index)
    }
  }
  addGroup = e => {
    e.stopPropagation();
    let {groupIndex, index, volumeIndex, type, addGroup, addOption} = this.props;
    if (type == 'volume') {
      addGroup(volumeIndex)
    } else {
      addOption()
    }
  }
  render() {

    let {group} = this.state, text;
    let {groupIndex, index, volumeIndex, itemIndex, type} = this.props;
    switch (type) {
      case 'volume': text = '大题';break
      default: text = '选做题组'
    }
    return (
      <div>
        <Row>
          <Col xs>
            <a onClick={this.addGroup} className="group-operation">
              +添加{text}
            </a>
            {
              index != 0 ? <a onClick={this.delGroup}
                              className="group-operation">-删除{text}</a> : null
            }
            <label htmlFor="">
              {type == 'volume' ? `第${this.groupNumMap[groupIndex]}大题：`: `选做题组${this.optionNumMap[groupIndex]}`}

            </label>
          </Col>
        </Row>
        <div>
          <input className='form-control' type="text" onChange={this.setGroupDesc} value={group.intro}
                 placeholder={ type == 'volume' ? `第${this.groupNumMap[groupIndex]}大题的详细描述`: `选做题组${this.optionNumMap[groupIndex]}的详细描述`}/>
        </div>
        {
          group.items.map((item, i) => <GroupItem type={type} random={Math.random()} volumeIndex={ type == 'volume'? volumeIndex: null} groupIndex={index} key={`group${item.item_id}`} item={item}
                                                      index={i} itemIndex={itemIndex+i+1}/>)
        }

        <Row className="groupOperations" end='xs'>
          {
            group.items.length ? <a className="btn" onClick={this.removeItem}>删除</a> : null
          }
          <a className="btn" onClick={this.setSelectItem}>选题</a>
        </Row>
      </div>);
  }

}

GroupItemWrap.defaultProps = {
  index: 0,
  type: "volume",
  group: {}
}
GroupItemWrap.propTypes = {
  index: PropTypes.number,
  groupIndex: PropTypes.number,
  itemIndex: PropTypes.number,
  group: PropTypes.object,
  volumeIndex: PropTypes.number
}

GroupItemWrap = connect(null, function (dispatch) {
  return {
    delOptionItem: index => dispatch(delOptionItem(index)),
    addOption: () => dispatch(addOption()),
    delOption: index => dispatch(delOption(index)),
    asyncOption: (index, intro) => dispatch(asyncOption(index, intro)),
    delGroupItem: (volume, group) => dispatch(delGroupItem(volume, group)),
    setSelectItem: (volume, group) => dispatch(setSelectItem(volume, group)),
    addGroup: (index) => dispatch(addGroup(index)),
    delGroup: (volumeIndex, index) => dispatch(delGroup(volumeIndex, index)),
    asyncGroup: (volumeIndex, index, intro) => dispatch(asyncGroup(volumeIndex, index, intro))
  }
})(GroupItemWrap)

class GroupItem extends React.Component {
  constructor(props) {
    super(props)
  }

  state = {
    editing: false,
    item: this.props.item
  }

  componentDidMount() {
    if (this.props.item.html == undefined) {
      axios.get(`/api/item/${this.props.item.item_id || this.props.item.id }/html`)
        .then(data => {
          this.setState({item: {...this.state.item, html: data.html}})
        })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.item.item_id != nextProps.item.item_id) {
      this.setState({
        item: {...nextProps.item}
      })
    }

  }

  setDesc = e => {
    e.stopPropagation();
    let {volumeIndex, groupIndex, index} = this.props;
    this.setState({
      item: {...this.state.item, before: e.target.value}
    }, () => {
      this.props.asyncItemBefore(volumeIndex, groupIndex, index , this.state.item.before)
    })
  }
  switchEdit = e=> {
    e.stopPropagation();
    this.setState({
      editing: true
    })
  }
  removeBefore = e => {
    let {volumeIndex, groupIndex, index} = this.props;
    e.stopPropagation();
    this.setState({
      editing: false,
      item: {...this.state.item, before: ""}
    }, () => {
      this.props.asyncItemBefore(volumeIndex, groupIndex, index , this.state.item.before)
    })
  }
  render() {
    let {item, editing} = this.state;
    let {itemIndex} = this.props;

    return (
      <div className="group-item-wrap">
        <div className='group-item-operation'>
          {
            editing ?
              <div>
                <input value={item.before} className='form-control' type="text" onChange={this.setDesc}/>
                <a className="remove" onClick={this.removeBefore} title="删除说明">X</a>
              </div> :
              <a title="添加题目描述" onClick={this.switchEdit} className="group-item-add"><span className="glyphicon glyphicon-plus-sign"></span></a>
          }
        </div>
        <div className="group-item-count">
          <span className="count">{itemIndex}、</span>
          <HtmlWithTex html={item.html}/>
        </div>

      </div>
    )
  }
}

GroupItem.proptypes = {
  type: PropTypes.string,
  volumeIndex: PropTypes.number,
  groupIndex: PropTypes.number,
  index: PropTypes.number,
  item: PropTypes.object
}

GroupItem = connect(null, function (dispatch) {
  return {
    asyncItemBefore: (volume, group, index, text) => dispatch(asyncItemBefore(volume, group, index, text))
  }
})(GroupItem)

class ExamItemWrap extends React.Component {
  constructor(props) {
    super(props)
    this.originItems = [];
  }

  state = {
    items: []
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.paperIds.length != this.props.paperIds.length) {
      this.getPaperALlItems(nextProps.paperIds)
    } else {
      if (JSON.stringify(nextProps.selectData) != JSON.stringify(this.props.selectData)) {
        let items = this.mixItems(this.originItems.slice(), nextProps.selectData)
        this.setState({
          items
        })
      }
    }

  }

  mixItems(originData, selectData) {
    let temps = originData.reduce((cac, item) => {
      if (!selectData.some(data => data.item_id == item.id)) {
        cac.push(item)
      }
      return cac
    }, [])
    return temps
  }

  getPaperALlItems(paperIds) {
    axios.get(`/api/item/${paperIds.toString()}/htmls`).then(data => {
      data.forEach((item, index) => {
        item.index = index +1;
        item.before = "";
      })
      this.originItems = data.slice();
      this.setState({
        items: this.mixItems(data, this.props.selectData)
      })
    });
  }

  componentDidMount() {
    if (this.props.paperIds.length) {
      this.getPaperALlItems(this.props.paperIds)
    }
  }

  addGroupItem = e => {
    let {currentGroup, addGroupItem} = this.props;
    if (currentGroup.group == undefined) return;
    let items = this.state.items.reduce((cac, item) => {
      if (item.checked) {
        item.item_id = item.id;
        cac.push(item)
      }
      item.checked = false;
      return cac
    }, [])
    if (!items.length) return;
    addGroupItem(items)
  }
  selectItem = (item, index) => {
    item.checked = !item.checked;

    this.setState(state => {
      state.items[index] = item;
      return {
        items: state.items.slice()
      }
    })
  }


  render() {
    let {items} = this.state, {selectAble} = this.props;
    return (
      <div className="content-wrapper">
        <div className={ `content-body ${!selectAble? 'disabled': '' }`}>
          {
            items.map((item, index) => <ExamItem key={`exam${item.id}`} onChange={this.selectItem} index={index}
                                                 item={item}/>)
          }
        </div>
        <div className='content-footer'>
          <Row end='xs' style={{marginTop: 10}}>
            <button className="btn" disabled={!selectAble || items.filter(item => item.checked).length == 0} onClick={this.addGroupItem}>添加</button>
          </Row>
        </div>
      </div>
    )
  }
}

ExamItemWrap.propTypes = {
  selectAble: PropTypes.bool,
  currentGroup: PropTypes.object,
  selectData: PropTypes.array.isRequired,
  paperIds: PropTypes.array.isRequired,
};

ExamItemWrap = connect(function (state) {
  return {
    selectAble: state.composition.selectAble,
    currentGroup: state.composition.currentGroup,
    paperIds: state.composition.paper.item_ids,
    selectData: state.composition.selectedItems
  }
}, function (dispatch) {
  return {
    addGroupItem: items => dispatch(addGroupItem(items))
  }
})(ExamItemWrap)
const ExamItem = ({item, index, onChange}) => {
  return (
    <div className={`composition-exam-item ${item.checked ? 'active' : ''}`} onClick={e => {
      onChange(item, index)
    }}>
      <a className="checkbox"></a>
      <div className="count">
        {item.index}、
      </div>
      <HtmlWithTex html={item.html}/>
    </div>
  )
}

class CompositionOperation extends React.Component {
  constructor(props) {
    super(props)
    this.groups = []
    this.options = []
  }

  state = {
    saved: false,
    showSetScore: false,
    showConfirm: false
  }
  computerScore = () => {
    this.options =[]
    this.groups = []
    let empty = false;
    let {paper} = this.props, index = 1;
    paper.volumes.forEach(volume => {
      volume.groups.forEach(group => {
        let obj = {group: [], score: '',average: "", equal: true, count: 0}, equal = true, subnum, count = 0, type;
        if (!group.items.length) {
          empty = true;
          return;
        }
        group.items.forEach(item => {
          subnum == undefined ? subnum = item.subnum : item.subnum != subnum ? equal = false : null;
          type == undefined ? type = item.type: item.type != type ? equal = false: null;
          count += item.score.length;
          obj.group.push({
            index: index,
            subnum: item.subnum,
            score: item.score,
            count: item.score.length,
            total: item.score.reduce((t, c) => t + c)
          })
          index++;
        })
        obj.average = equal && obj.group[0] ? obj.group[0].total: "" ;
        obj.count = count;
        obj.equal = equal;
        this.groups.push(obj)
      })
    })
    paper.choose_item.forEach((group, i, array) => {
      let obj = {group: [], score: '', average: "", equal: true, count: 0}, equal = true, subnum, count = 0, type;
      if (!group.items.length && array.length == 1) {
        return ;
      }
      if (array.length == 1) {
        if (!group.items.length) return ;
      }
      if (!group.items.length) {
        empty = true;
        return;
      }

      group.items.forEach(item => {
        subnum == undefined ? subnum = item.subnum : item.subnum != subnum ? equal = false : null;
        type == undefined ? type = item.type: item.type != type ? equal = false: null;
        count += item.score.length;
        obj.group.push({
          index: index,
          subnum: item.subnum,
          score: item.score,
          count: item.score.length,
          total: item.score.reduce((t, c) => t + c)
        })
        index++;
      })
      obj.average = equal && obj.group[0] ? obj.group[0].total: "" ;
      obj.count = count;
      obj.equal = equal;
      this.options.push(obj)
    })

    if (empty) {
      showAlert("试卷题目分配不合理", 'danger');
    } else {
      this.setState({
        showSetScore: true
      })
    }
  }
  setScore = e => {
    this.computerScore();
  }

  saveComposition = (e) => {
    e.stopPropagation();
    let {paper} = this.props, chooseItem = [...paper.choose_item], tempItem = chooseItem[chooseItem.length-1];
    //判断选做题内容是否为空
    while (tempItem && !tempItem.intro && !tempItem.items.length && chooseItem.length) {
      chooseItem.splice(-1,1)
      tempItem = chooseItem[chooseItem.length-1]
    }
    axios.post(`/api/paper/typeset_paper/${paper._id}`, {...paper, choose_item: chooseItem})
      .then(data => {
        showAlert('保存成功', 'success')
        this.setState({
          saved: true
        })
      })
  }
  confirm = e => {
    this.props.router.push(`/paper/verify/${this.props.paper._id}`)
  }
  closeModal = e => {
    this.setState({
      showSetScore: false
    })
  }
  okCallback = e => {
    this.setState({
      showSetScore: false,
      saved: true
    })
  }

  render() {
    let {paper, selectedItems} = this.props;
    let {showSetScore, saved} = this.state;
    return (
      <div>
        {
          showSetScore ?
            <Portal previewPlan={showSetScore} closeHandler={this.closeModal} maskClassName="plan-modal"
                    containerClassName="plan-modal-container">
              <SetScore paper={paper} groups={this.groups} options = {this.options} cancelCallback={this.closeModal} okCallback={this.okCallback}/>
            </Portal> : null
        }
        <Row end='xs' style={{marginTop: 10}}>
          <button className="btn" onClick={this.saveComposition}>保存</button>
          <button className="btn" onClick={this.setScore} disabled={selectedItems.length != paper.item_ids.length}>设定分值</button>
          <button className="btn" onClick={this.confirm} disabled={!saved}>核对</button>
        </Row>
      </div>
    )
  }

}

CompositionOperation = connect(function (state) {
  return {
    paper: state.composition.paper,
    selectedItems: state.composition.selectedItems
  }
})(CompositionOperation)

class SetScore extends React.Component {
  constructor(props) {
    super(props)
  }

  state = {
    total: 0, //总分,
    groups: this.props.groups,
    options: this.props.options,
  }

  componentWillReceiveProps(nextProps) {
    this.state.groups = nextProps.groups.slice()
    this.state.options = nextProps.options.slice()
    this.setTotal(this.state.groups, this.props.options)
  }

  componentDidMount() {
    this.setTotal(this.props.groups, this.props.options)
  }

  setTotal(groups, options) {
    if (options.length) {
      let temp = options[0].group[0].score.reduce((cac, cur) => cac + cur);
      if (options.some(group => group.group.some(item => temp != item.score.reduce((cac, cur) => cac + cur)))) {
        this.element.innerText = "";
        return ;
      }
    }

    let total = groups.reduce((cac, current) => {
      return cac + current.group.reduce((total, curr) => {
        return total + curr.score.reduce((t, item) => t + item)
      }, 0)
    }, 0)
    this.element.innerText = total + (options.length? options[0].group[0].score.reduce((cac ,cur) => cac +cur): 0);
  }

  saveComposition = e => {
    let empty = false;
    e.stopPropagation();
    if (!this.element.innerText) {
      showAlert("分值设置不正确", "danger");
      return;
    }
    let {paper} = this.props, distance = 0, {groups, options} = this.state;
    for (let i =0; i < groups.length; i++) {
      if (groups[i].group.some(item => item.score.some(score => score == 0 || /\./.test(score.toString()) ))) {
        showAlert(`第${i+1}题里分值不可以为0或小数`, "danger");
        return ;
      }
    }
    for (let j = 0; j < options.length; j++) {
      if (options[j].group.some(item => item.score.some(score => score == 0 || /\./.test(score.toString()) ))) {
        showAlert(`选做题${j+1}里分值不可以为0或小数`, "danger");
        return ;
      }
    }
    paper.volumes.forEach((volume, index) => {
      distance += index == 0 ? 0:  paper.volumes[index-1].groups.length;
      volume.groups.forEach((group, pos) => {
        group.items.forEach((item, low) => {
          let cur = index == 0? pos: distance + pos;
          item.score = groups[cur].group[low].score
        })
      })
    })

    let chooseItem = [...paper.choose_item], tempItem = chooseItem[chooseItem.length-1];
    //判断选做题内容是否为空
    while (tempItem && !tempItem.intro && !tempItem.items.length && chooseItem.length) {
      chooseItem.splice(-1,1)
      tempItem = chooseItem[chooseItem.length-1]
    }
    chooseItem.forEach((choose, index) => {
      choose.items.forEach((item, pos) => {
        item.score = options[index].group[pos].score
      })
    })
    axios.post(`/api/paper/typeset_paper/${paper._id}`, {...paper, choose_item: chooseItem})
      .then(data => {
        showAlert('设定分值成功', 'success')
        this.props.okCallback()
      })
  }
  asyncScore = (index, group, type) => {
    this.state[type][index] = group;
    this.setTotal(this.state.groups, this.state.options)
  }

  render() {
    let {groups, options} = this.state;
    return (
      <div className="scoreWrapper">
        <header>设定分值</header>
        <article>
          <div style={{fontSize: '16px', color: '#363231', fontWeight: 500, marginBottom: 28}} >本试卷总分共 <span ref={ele => this.element = ele}></span> </div>

          {
            groups.map((group, index) => <ItemScore key={`groupsItemScore${index}`} type={'groups'} asyncScore={this.asyncScore} index={index} group={group}/>)
          }
          {
            options.map((group, index) => <ItemScore key={`optionsItemScore${index}`} type={'options'} asyncScore={this.asyncScore} index={index} group={group}/>)
          }
        </article>
        <footer>
          <Row end='xs'>
            <button className="btn" onClick={this.props.cancelCallback}>取消</button>
            <button className="btn" onClick={this.saveComposition}>确定</button>
          </Row>
        </footer>
      </div>
    )
  }
}

class ItemScore extends React.Component {
  constructor(props) {
    super(props)
    this.optionNumMap = ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ", "Ⅹ", "Ⅺ", "Ⅻ"]
    this.groupNumMap = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
    this.state = {
      customize: false,
      total: this.setTotal(this.props.group.group),
      average: this.props.group.average,
      group: this.props.group
    }
  }

  setCustomize = bool => {
    //取消自定义

    this.setState({
      customize: bool,
      score: {...this.state.score, score: 0},
      total: this.setTotal(this.state.group.group),
    })
  }
  setTotal = (group) => {
    let {type} = this.props;
    if (type != "options" ) {
      return group.reduce((total, cur) => total + cur.score.reduce((t, c) => t + c), 0)
    } else {
      let total = group[0].score.reduce((t,c)=>t+c);
      if(group.some(item => total!= item.score.reduce((t,c) => t+c))) {
        return ""
      } else {
        return total
      }
    }
  }
  setAverage = e => {
    let value = +e.target.value ? +e.target.value: 0 ;
    this.setState(state => {
      state.group.group.forEach(item => item.score = item.score.map(score => value))
      return {
        average: value,
        total: parseInt(value * state.group.count),
        group: {...state.group}
      }
    }, () => {
      this.props.asyncScore(this.props.index, this.state.group, this.props.type)
    })
  }

  setSingleScore(value, item, itemIndex, isSingal = true) {
    if (value) {
      if (!isSingal) {
        let residue = value % item.count;
        item.score = item.score.map(score => Math.floor(value / item.count))
        if (residue) {
          item.score[item.count-1] += residue;
        }

      } else {
        item.score = [value]
      }

      item.total = item.score.reduce((cac,cur)=> cac + cur)
      this.setState(state => {
        state.group.group[itemIndex] = {...item};
        return {
          total: this.setTotal(state.group.group),
          group: {...state.group}
        }
      }, () => {
        this.props.asyncScore(this.props.index, this.state.group, this.props.type)
      })
    } else {
      if (!isSingal) {
        item.score = item.score.map(score => 0)
      } else {
        item.score = [0]
      }
      item.total = item.score.reduce((cac,cur)=> cac + cur)
      this.setState(state => {
        state.group.group[itemIndex] = {...item};
        return {
          total: this.setTotal(state.group.group),
          group: {...state.group}
        }
      }, () => {
        this.props.asyncScore(this.props.index, this.state.group, this.props.type)
      })
    }
  }

  setSmallScore(value, itemIndex, scoreIndex) {
    if (value) {
      this.setState(state => {
        state.group.group[itemIndex].score[scoreIndex] = value;
        state.group.group[itemIndex].total = state.group.group[itemIndex].score.reduce((cac, cur) => cac + cur);
        return {
          average: 0,
          total: this.setTotal(state.group.group),
          group: {...state.group}
        }
      }, ()=> {
        this.props.asyncScore(this.props.index, this.state.group, this.props.type)
      })
    } else {
      this.setState(state => {
        state.group.group[itemIndex].score[scoreIndex] = 0;
        state.group.group[itemIndex].total = state.group.group[itemIndex].score.reduce((cac, cur) => cac + cur);
        return {
          average: 0,
          total: this.setTotal(state.group.group),
          group: {...state.group}
        }
      })

    }
  }

  render() {
    let {group, customize, average, total} = this.state;
    let {type, index} = this.props;
    return (
      <div>
        <Row style={{marginBottom: 10}}>
          <Col xs={6}>
            {type == 'options'? `选做题组${this.optionNumMap[index]}`: `第${this.groupNumMap[index]}题`}
            {
              group.equal && !customize ?
                <span>,每小题<input type="text" value={average} onChange={this.setAverage}/> 分 </span> : null
            }
            ，共{total}分
          </Col>
          <Col xs={2} xsOffset={4}>
            {
              group.equal && !customize ? <a onClick={e => {
                this.setCustomize(true)
              }}>自定义</a> :  group.equal? <a onClick={e => {
                this.setCustomize(false)
              }}>取消自定义</a>: null
            }
          </Col>
        </Row>
        <Row className="customize-wrap">
          {
            group.equal && !customize ? null : group.group.map((item, itemIndex) => {
              if (item.subnum !=1) {
                return <Col xs={12}>
                  <Col xs={3}> <span>第 {item.index} 题</span><input type="text" value={item.total}
                                                                              onChange={e => this.setSingleScore(+e.target.value, item, itemIndex, false)}/> 分</Col>
                  {
                    item.score.map((score, scoreIndex) => {
                      return (
                        <Col xs={3}>
                          ({scoreIndex+1})<input type="text" value={score} onChange={e => this.setSmallScore(+e.target.value, itemIndex, scoreIndex)}/>
                        </Col>)
                    })
                  }
                </Col>
              } else {
                return (
                  <Col xs={3}>
                    <span>第 {item.index} 题</span>
                    <input type="text" value={item.score[0]} onChange={e => this.setSingleScore(+e.target.value, item, itemIndex)}/> 分
                </Col>)
              }
            })
          }
        </Row>
      </div>)
  }

}

ItemScore.propTypes = {
  score: PropTypes.object,
  index: PropTypes.number
}
