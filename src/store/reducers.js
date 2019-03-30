import {
  UPDATE_RELEASE,
  UPDATE_LESSON,
  SELECT_TREE_ID,
  ADD_TARGET,
  REMOVE_TARGET,
  PREVIEW,
  ADD_LESSON,
  REMOVE_LESSON,
  MOVE_LESSON,
  ASYNC_TEXT,
  UPDATE_TARGET,
  UPDATE_PLANSTATUS,
  UPDATE_KTAG,
  UPDATE_KTAGSTATUS,
  UPDATE_FORMULA,
  UPDATE_CK_FORMULA,
  SETCOMPOSITONDATA,
  UPDATEPAPERFORM,
  DELVOLUME,
  ADDVOLUME,
  DELGROUP,
  ADDGROUP,
  ASYNCVOLUME,
  ASYNCGROUP,
  ADDGROUPITEM,
  DELETEGROUPITEM,
  SETSELECTITEM,
  DELOPTIONITEM,
  DELOPTION,
  ADDOPTION,
  ASYNCOPTION, ASYNCITEMBEFORE
} from './actions'

export default function (state = {
  editMode: false,
  lesson: {},
  release: [],
  posting: false,
  treeId: '',
  preview: {},
  planStatus: "",
  ckEditor: null,
  currentEditor: null,
  formula: {toolbar: '', latex: '', type: ''},
  composition: {
    selectAble: false,
    currentGroup: {
      volume: null,
      group: null
    },
    selectedItems: [],
    setScore: [],
    paper: {
      desc: '',
      attention: '',
      _id: '',
      item_ids: [],
      name: '',
      volumes: [],
      choose_item: []
    }
  }
}, action) {

  switch (action.type) {
    case UPDATE_RELEASE:
      return Object.assign({}, state, {release: action.release})

    case UPDATE_LESSON:
      return Object.assign({}, state, {lesson: Object.assign({}, action.lesson)});
    case REMOVE_TARGET:
      state.planStatus = "editing";
      let list = state.lesson.target_list.slice();
      list.splice(action.index, 1);
      state.lesson = Object.assign({}, state.lesson, {target_list: list})
      return Object.assign({}, state);
    case MOVE_LESSON:
      state.planStatus = "editing";
      state.lesson.content_list.splice(action.data.index, 1)
      if (action.data.up) {
        state.lesson.content_list.splice(action.data.index - 1, 0, action.data.plan)
      } else {
        state.lesson.content_list.splice(action.data.index + 1, 0, action.data.plan)
      }
      state.lesson = Object.assign({}, state.lesson, {content_list: state.lesson.content_list.slice()})
      return Object.assign({}, state);
    case PREVIEW:
      state.preview = action.data;
      return Object.assign({}, state);
    case ADD_LESSON:
      state.planStatus = "editing";
      let content_list = state.lesson.content_list.slice();
      let last = content_list.splice(-1, 1);
      content_list = content_list.concat(action.data, last);
      state.lesson = Object.assign({}, state.lesson, {content_list})
      return Object.assign({}, state);
    case ASYNC_TEXT:
      state.lesson.content_list.splice(action.index, 1, action.plan)
      return state;
    case REMOVE_LESSON:
      state.planStatus = "editing";
      state.lesson.content_list.splice(action.index, 1);
      state.lesson = Object.assign({}, state.lesson, {content_list: state.lesson.content_list.slice()})
      return Object.assign({}, state);
    case ADD_TARGET:
      state.planStatus = "editing";
      let target_list = state.lesson.target_list.slice();
      target_list.push(action.node);
      state.lesson = Object.assign({}, state.lesson, {target_list})
      return Object.assign({}, state);
    case UPDATE_TARGET:
      state.planStatus = "editing";
      state.lesson.target_list.splice(action.index, 1, action.target);
      return state;
    case UPDATE_PLANSTATUS:
      state.planStatus = action.status;
      return state;
    case UPDATE_KTAG:
      return Object.assign({}, state, {ktag: Object.assign({}, action.ktag)});
    case UPDATE_KTAGSTATUS:
      state.status.ktagStatus = action.status;
      return state;
    case SELECT_TREE_ID:
      return Object.assign({}, state, {treeId: action.id})
    case UPDATE_FORMULA:
      state.currentEditor = action.data.editor;
      state.formula = Object.assign({}, action.data.formula);
      return Object.assign({}, state);
    case UPDATE_CK_FORMULA:
      state.ckEditor = action.data.editor;
      state.formula = Object.assign({}, action.data.formula);
      return Object.assign({}, state);
    case SELECT_TREE_ID:
      return Object.assign({}, state, {treeId: action.id})
    case SETCOMPOSITONDATA:
      let composition = {...state.composition, paper: action.paper, selectedItems: action.selectedItems}
      return Object.assign({}, state, {composition: composition} )
    case UPDATEPAPERFORM:
      let paper = {...state.composition.paper, ...action.state}
      return Object.assign({}, state, {composition: {...state.composition, paper}})
    case DELVOLUME:
      let volumes = state.composition.paper.volumes.slice();
      var delVol = volumes.splice(action.index)[0];
      var dels = delVol.groups.reduce((cac,group) => {
        cac.push(...group.items)
        return cac
      }, [])
      var selectedItems = state.composition.selectedItems.filter(data => !dels.some(t => t.item_id == data.item_id))
      return Object.assign({}, state, {composition: {...state.composition, selectedItems, paper: {...state.composition.paper, volumes}}})
    case ADDVOLUME:
      return Object.assign({}, state, {composition: {...state.composition, paper: {...state.composition.paper, volumes: action.volumes}}})
    case ADDGROUP:
      let vols = [...state.composition.paper.volumes];
      vols[action.index].groups = action.groups ;
      return Object.assign({}, state, {composition: {...state.composition, paper: {...state.composition.paper, volumes: vols}}})

    case DELGROUP:
      let temp =  state.composition.paper.volumes.slice();
      let groups = temp[action.volumeIndex].groups.slice();
      var del = groups.splice(action.index, 1)[0]
      temp[action.volumeIndex].groups = groups;
      var selectedItems = state.composition.selectedItems.filter(data => !del.items.some(t => t.item_id == data.item_id))
      return Object.assign({}, state, {composition: {...state.composition, selectedItems , paper: {...state.composition.paper, volumes: temp}}})
    case ASYNCVOLUME:
      state.composition.paper.volumes[action.index].desc = action.desc;
      state.composition.paper.volumes[action.index].title = action.title;
      return state;
    case ASYNCGROUP:
      state.composition.paper.volumes[action.volumeIndex].groups[action.index].intro = action.intro;
      return state;
    case SETSELECTITEM:
      //var {group, volume} = state.composition.currentGroup
      /*if (state.composition.currentGroup.volume != null) {
        state.composition.paper.volumes[volume].groups[group].active = false;
      }*/
      state.composition.currentGroup = {
        group: action.group,
        volume: action.volume
      }
      //state.composition.paper.volumes[action.volume].groups[action.group].active = true;
      return Object.assign({}, state, {composition: {...state.composition, selectAble: true}});
    case ADDGROUPITEM:
      var temps, groups, paper;
      if (state.composition.currentGroup.volume == null) {
        temps = [...state.composition.paper.choose_item]
        groups = temps[state.composition.currentGroup.group].items.push(...action.items)
        paper = {...state.composition.paper, choose_item: temps}
      } else {
        temps = [...state.composition.paper.volumes]
        groups = temps[state.composition.currentGroup.volume].groups;
        groups[state.composition.currentGroup.group].items.push(...action.items);
        paper = {...state.composition.paper, volumes: temps}
      }
      return Object.assign({}, state, {composition: {...state.composition, selectAble: false, selectedItems: [...state.composition.selectedItems, ...action.items], paper}})
    case DELETEGROUPITEM:
      var temps = state.composition.paper.volumes.slice();
      var groups = temps[action.volume].groups;
      let item = groups[action.group].items.splice(-1, 1)[0];
      var selectedItems = state.composition.selectedItems.filter(data => data.item_id != item.item_id)
      return Object.assign({}, state, {composition: {...state.composition, selectedItems: [...selectedItems], paper: {...state.composition.paper, volumes: temps}}})
    case DELOPTIONITEM:
      var options = [...state.composition.paper.choose_item], items = [...options[action.index].items];
      var del = items.splice(-1, 1)[0];
      options[action.index].items = items;
      var selectedItems = state.composition.selectedItems.filter(data => data.item_id != del.item_id)
      return Object.assign({}, state, {composition: {...state.composition, selectedItems: [...selectedItems], paper: {...state.composition.paper, choose_item: options}}})
    case DELOPTION:
      var options = [...state.composition.paper.choose_item], opt = options.splice(action.index,1)[0]
      var selectedItems = state.composition.selectedItems.filter(data => !opt.items.some(t => t.item_id == data.item_id))
      return Object.assign({}, state, {composition: {...state.composition, selectedItems: [...selectedItems], paper: {...state.composition.paper, choose_item: options}}})
    case ADDOPTION:
      return Object.assign({}, state, {composition: {...state.composition, paper: {...state.composition.paper, choose_item: action.options}}})
    case ASYNCOPTION:
      state.composition.paper.choose_item[action.index].intro = action.intro;
      return state;
    case ASYNCITEMBEFORE:
      if (action.volume == null) {
        state.composition.paper.choose_item[action.group].items[action.index].before = action.text;
      } else {
        state.composition.paper.volumes[action.volume].groups[action.group].items[action.index].before = action.text;
      }
      return state;
    default:
      return state;

  }
}