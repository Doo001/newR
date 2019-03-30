import React from 'react'
import ItemComponent from 'component/ItemComponent'

export default class Type1002 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            desc: '',
            ans: '',
            exp: '',
            step: '',
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
    		desc: '',
            ans: '',
            exp: '',
            step: '',
    	})
    }

    render() {
        return (
            <div className="parser-input-zone">
                <ItemComponent
                    name='desc' title='题干' rows={6} onChange={this.handleChange.bind(this)}
                    value={this.state.desc}
                />
                <ItemComponent
                    name='ans' title='答案' rows={6} onChange={this.handleChange.bind(this)}
                    value={this.state.ans}
                />
                <ItemComponent
                    name='exp' title='解析' rows={6} onChange={this.handleChange.bind(this)}
                    value={this.state.exp}
                />
                <ItemComponent
                    name='step' title='备注' rows={6} onChange={this.handleChange.bind(this)}
                    value={this.state.step}
                />
            </div>
        );
    }
}