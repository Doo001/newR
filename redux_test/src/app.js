import React from 'react'
import ReactDom from 'react-dom'
import {connect} from 'react-redux'
import {addFn,removeFn,addSetTimeout} from './index.redux'

export class App extends React.Component{
	render(){
		return(<div>
			来自app
			<br/>
			当前的值是{this.props.num}
			<button onClick ={ this.props.addFn	} >申请武器</button>
			<button onClick ={ this.props.removeFn } >回收武器</button>
			<button onClick ={ ()=>this.props.addSetTimeout(33) } >过两天给</button>
			</div>)
	}
}
const mapStatetoProps = (state)=>{
	//需要的store里的状态
	return {num:state}
}
const actionCreators = {addFn,removeFn,addSetTimeout}
App = connect( mapStatetoProps,actionCreators )(App)
