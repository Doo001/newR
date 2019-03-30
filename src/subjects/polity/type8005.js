import React from 'react'
import ItemComponent from 'component/ItemComponent'
export default class Type8005 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stem: '',
            desc: '',
            ans: '',
            exp: '',
            step: ''
        };
    }

    getData() {
        return Object.assign({}, this.state);
    }

    handleChange(evt) {
        this.props.setGoodToLeave(false);
        this.setState({ [evt.target.name]: evt.target.value });
    }
    
    clear(){
    	this.setState({
    		stem: '',
            desc: '',
            ans: '',
            exp: '',
            step: ''
    	})
    }

    render() {
        return (
         <div className="parser-input-zone">
         <ItemComponent
        name='stem' title='大题题干' rows={4} onChange={this.handleChange.bind(this)}
        value={this.state.stem}
    />
    <ItemComponent
        name='desc' title='小题题干' rows={5} onChange={this.handleChange.bind(this)}
        value={this.state.desc}
    />
    <ItemComponent
        name='ans' title='小题答案' rows={5} onChange={this.handleChange.bind(this)}
        value={this.state.ans}
    />
    <ItemComponent
        name='exp' title='小题解析' rows={5} onChange={this.handleChange.bind(this)}
        value={this.state.exp}
    />
    <ItemComponent
        name='step' title='小题备注' rows={5} onChange={this.handleChange.bind(this)}
        value={this.state.step}
    />
    </div>
    );
    }
}