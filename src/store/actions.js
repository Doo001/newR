import Q from '../js/quantum'
import $ from 'jquery'
import showAlert from 'js/widgets/alert'
// 更改当前选中的教案节点
export const CHANGE_LESSON = 'CHANGE_LESSON';
// 移动教案切片
export const MOVE_LESSON = 'MOVE_LESSON';
// 删除教案切片
export const REMOVE_LESSON = 'REMOVE_LESSON';
// 添加单题
export const ADD_SINGLE_ITEM = 'ADD_SINGLE_ITEM';
// 添加备用题库
export const ADD_BACKUP_ITEM = 'ADD_BACKUP_ITEM';
// 添加大题库
export const ADD_MAIN_ITEM = 'ADD_MAIN_ITEM';
// 添加文本
export const ADD_LESSON = 'ADD_LESSON';
// 请求服务器
export const REQUEST_DATA = 'REQUEST_DATA';
export const ASYNC_TEXT = 'ASYNC_TEXT';
export const SAVE_LESSON = 'SAVE_LESSON'

export const UPDATE_LESSON = 'UPDATE_LESSON';

export const UPDATE_RELEASE = 'UPDATE_RELEASE';
export const SELECT_TREE_ID = 'SELECT_TREE_ID';
export const ADD_TARGET = 'ADD_TARGET';
export const REMOVE_TARGET = 'REMOVE_TARGET';
export const UPDATE_TARGET = 'UPDATE_TARGET';
//预览教案预览教材
export const PREVIEW = 'PREVIEW';
export const UPDATE_lOCK = 'UPDATE_lOCK'
export const UPDATE_PLANSTATUS = 'UPDATE_PLANSTATUS'
export const UPDATE_KTAG = 'UPDATE_KTAG'
export const UPDATE_KTAGSTATUS = 'UPDATE_KTAGSTATUS'

export const UPDATE_FORMULA = 'UPDATE_FORMULA'
export const UPDATE_CK_FORMULA = 'UPDATE_CK_FORMULA'

export const SETCOMPOSITONDATA = 'SETCOMPOSITONDATA'
export const OPENSETSCOREMODAL = 'OPENSETSCOREMODAL'
export const SAVESETSCOREMODAL = 'SAVESETSCOREMODAL'
export const ADDGROUPITEM = 'ADDGROUPITEM'
export const DELETEGROUPITEM = 'DELETEGROUPITEM'
export const UPDATEPAPERFORM = 'UPDATEPAPERFORM'
export const DELVOLUME = 'DELVOLUME'
export const ADDVOLUME = 'ADDVOLUME'
export const DELGROUP = 'DELGROUP'
export const ADDGROUP = 'ADDGROUP'
export const ASYNCVOLUME = 'ASYNCVOLUME'
export const ASYNCGROUP = 'ASYNCGROUP'
export const SETSELECTITEM = 'SETSELECTITEM'
export const SAVECOMPOSITON = 'SAVECOMPOSITON'
export const DELOPTIONITEM = 'DELOPTIONITEM'
export const DELOPTION = 'DELOPTION'
export const ADDOPTION = 'ADDOPTION'
export const ASYNCOPTION = 'ASYNCOPTION'
export const ASYNCITEMBEFORE = 'ASYNCITEMBEFORE'

export function updateEditor(latex, type) {
  return function (dispatch, getState) {
    let {currentEditor, ckEditor} = getState();
    if (type == 'editor') {
      currentEditor.updateLatex(latex)
    } else {
      ckEditor.updateLatex(latex)
    }

  }
}

export function setFormula(data) {
  return {
    type: UPDATE_FORMULA,
    data
  }
}

export function setCKFormula(data) {
  return {
    type: UPDATE_CK_FORMULA,
    data
  }
}

export function requestData(posting) {
  return {
    type: REQUEST_DATA,
    status: posting
  }
}

export function updateRelease(release) {
  return {
    type: UPDATE_RELEASE,
    release
  }
}

export function updateLesson(lesson) {
  return {
    type: UPDATE_LESSON,
    lesson
  }
}

export function updateKtag(ktag) {
  return {
    type: UPDATE_KTAG,
    ktag
  }
}

export function addTarget(node) {
  return {
    type: ADD_TARGET,
    node
  }
}

export function removeTarget(index) {
  return {
    type: REMOVE_TARGET,
    index
  }
}

export function changePlanStatus(status) {
  return {
    type: UPDATE_PLANSTATUS,
    status
  }
}

export function changeKtagStatus(status) {
  return {
    type: UPDATE_KTAGSTATUS,
    status
  }
}

export function changeKtag(id) {
  return function getKtag(dispatch, getState) {
    dispatch(requestData(true))
    return Q.get(`/api/ktag/${id}`)
      .done(ktag => {

        window.planTagManage = {
          version: ktag.version,
          id: id
        }

        dispatch(requestData(false))
        dispatch(updateKtag(ktag))
        window.ktagStatus = ''
      })
      .fail((message) => {
        showAlert('服务器出错了', 'danger')
      })

  }
}

export function changeLesson(id) {
  return function getPlan(dispatch, getState) {
    //let {treeId, planStatus} = getState();
    dispatch(requestData(true))
    dispatch({type: SELECT_TREE_ID, id})
    return $.when(Q.get(`/api/plan_tag/${id}/v1`), Q.get(`/api/plan_tag/find_area_class/${id}`))
      .done((lesson, release) => {
        window.planTagManage = {
          version: lesson.version,
          id: lesson._id
        }
        dispatch(requestData(false))
        dispatch(updateLesson(lesson))
        dispatch(updateRelease(release))
        dispatch(changePlanStatus(""))
      })
      .fail((message) => {
        showAlert('服务器出错了', 'danger')
      })


  }
}

export function saveKtag(ktag) {
  return function (dispatch, getState) {

    ktag.weight = Number.parseInt(ktag.weight, 10);
    ktag.teaching_objective.lesson_count = Number.parseFloat(ktag.teaching_objective.lesson_count, 10);
    if (!ktag.name) {
      return showAlert('名称不能为空', 'danger')
    }
    if (isNaN(ktag.weight)) {
      return showAlert('请设置权重为整数', 'danger')
    }
    if (isNaN(ktag.teaching_objective.lesson_count)) {
      return showAlert('请设置课时数为数字', 'danger')

    }
    ktag.version = window.planTagManage.version;
    return Q.patch(`/api/ktag/${ktag._id}`, {json: ktag})
      .done(data => {
        //dispatch(requestData(false));
        window.ktagStatus = "";
        window.planTagManage = {
          version: data.version,
          id: ktag._id
        }
        showAlert('保存成功', 'success');
      })
  }
}

export function saveLesson() {
  return function (dispatch, getState) {
    let {lesson, treeId} = getState();
    let list = [];
    lesson = Object.assign({}, lesson);
    for (let i = 0; i < lesson.content_list.length; i++) {
      let content = lesson.content_list[i]
      if (content.data.type == '102' && !content.data.content) {
        return showAlert('知识笔记不能为空啊！', 'danger');
      }
      if (content.data.content || [101, 102, 1, 2].indexOf(+content.data.type) != -1) {
        list.push({
          type: content.type,
          data: {
            title: content.data.title == "无须标题" ? "" : content.data.title,
            type: content.data.type,
            content: content.data.content
          }
        })
      }

    }

    lesson.content_list = list;
    lesson.version = window.planTagManage.version;
    dispatch(requestData(true))
    return Q.post(`/api/plan_tag/${treeId}/v1`, {json: lesson})
      .done(data => {
        dispatch(changePlanStatus(""))
        dispatch(requestData(false));
        window.planTagManage = {
          version: data,
          id: treeId
        }
        showAlert('保存成功', 'success');
      })
  }
}

export function moveLesson(data) {
  return {
    type: MOVE_LESSON,
    data

  }
}

export function addLesson(data) {
  return {
    type: ADD_LESSON,
    data
  }
}

export function removeLesson(index) {
  return {
    type: REMOVE_LESSON,
    index
  }
}

export function asyncText(index, plan) {
  return {
    type: ASYNC_TEXT,
    plan,
    index
  }
}

export function asyncTarget(index, target) {
  return {
    type: UPDATE_TARGET,
    index,
    target
  }
}
export function preview(data) {
  return {
    type: PREVIEW,
    data
  }
}
function fillVolume(volumes) {
  let temp = volumes.slice();
  temp.push({
    key: new Date().getTime(),
    title: '',
    desc: '',
    groups: [
      {
        intro: '',
        items: [],
        title: '',
        desc: ''
      }
    ]
  })
  return temp
}
function fillOption(options) {
  let temp = options.slice();
  temp.push({
    intro: '',
    items: [],
    title: '',
    desc: ''
  })
  return temp
}
function fillGroup(groups) {
  let group = groups.slice();
  group.push({
    intro: '',
    items: [],
    title: '',
    desc: ''
  })
  return group
}
function filterPaperCompositionItem(volumes, chooseItem) {
  let selectData = [];
  volumes.forEach(volume => {
    volume.groups.forEach(group => {
      selectData.push(...group.items)
    })
  })
  chooseItem.forEach(Item => {
    selectData.push(...Item.items)
  })
  return selectData
}
export function updatePaperForm(state) {
  return {
    type: UPDATEPAPERFORM,
    state
  }
}
export function delVolume(index) {
  return {
    type: DELVOLUME,
    index
  }
}
export function addVolume() {
  return function (dispatch, getState) {
    let {composition} = getState();
    dispatch({
      type: ADDVOLUME,
      volumes: fillVolume(composition.paper.volumes)
    })
    return
  }

}
export function addGroup(index) {
  return function (dispatch, getState) {
    let {composition} = getState();
    dispatch({
      type: ADDGROUP,
      index,
      groups: fillGroup(composition.paper.volumes[index].groups)
    })
    return
  }
}
export function delGroup(volumeIndex, index) {
  return {
    type: DELGROUP,
    volumeIndex,
    index
  }
}
export function updateSetScore(data) {
  return {
    type:SAVESETSCOREMODAL
  }
}
export function asyncVolume(index, title, desc) {
  return {
    type: ASYNCVOLUME,
    index,
    title,
    desc
  }
}
export function asyncGroup(volumeIndex, index, intro) {
  return {
    type: ASYNCGROUP,
    volumeIndex,
    index,
    intro
  }
}
export function setSelectItem(volume, group) {
  return {
    type: SETSELECTITEM,
    volume,
    group
  }
}
export function addGroupItem(items) {
  return {
    type: ADDGROUPITEM,
    items
  }
}
export function delGroupItem(volume, group) {
  return {
    type: DELETEGROUPITEM,
    volume,
    group
  }
}
export function delOptionItem(index) {
  return {
    type: DELOPTIONITEM,
    index
  }
}
export function delOption(index) {
  return {
    type: DELOPTION,
    index
  }
}
export function addOption() {
  return function (dispatch, getState) {
    let {composition} = getState()
    let options = fillGroup(composition.paper.choose_item.slice())
    dispatch({
      type: ADDOPTION,
      options
    })
  }
}
export function asyncOption(index, intro) {
  return {
    type: ASYNCOPTION,
    index,
    intro
  }
}
export function initComposition(paper) {
  return {
    type: SETCOMPOSITONDATA,
    paper:  {...paper, volumes: paper.volumes.length? paper.volumes: fillVolume([]), choose_item: paper.choose_item.length? paper.choose_item: fillOption([])  },
    selectedItems: paper.volumes.length ? filterPaperCompositionItem(paper.volumes, paper.choose_item): []
  }
}

export function asyncItemBefore(volume, group, index, text) {
  return {
    type: ASYNCITEMBEFORE,
    volume,
    group,
    index,
    text
  }
}