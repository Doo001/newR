//常量
const ADD_JQ = '加机关枪'
const REMOVE_JQ = '减机关枪'

//reducer
export function counter(state=0,action){
	switch(action.type){
		case ADD_JQ:
			return state+1
		case REMOVE_JQ:
			return state-1
		default:
			return 10
	}
}

//action creator
export function addFn(){
	return {type:ADD_JQ}
}
export function removeFn(){
	return {type:REMOVE_JQ}
}
export function addSetTimeout(res){
	console.log(res)
	return dispatch=>{
		setTimeout(()=>{
			dispatch(addFn())
		},2000)
	}
}
