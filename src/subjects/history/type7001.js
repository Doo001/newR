import React from 'react'
import ItemComponent from 'component/ItemComponent'
export default class Type7001 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            desc: '',
            opts: '',
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

    handleDescBlur() {
        // 尝试自动抽出选项段
        const match = /^\s*\\(one|two|four)ch/m.exec(this.state.desc);
        if (!match) {
            return;
        }
        this.setState({
            desc: this.state.desc.substring(0, match.index),
            opts: this.state.desc.substring(match.index),
        });
    }
    
    clear(){
    	this.setState({
    		desc: '',
            opts: '',
            ans: '',
            exp: '',
            step: '',
    	})
    }

    render() {
        return (
         <div className="parser-input-zone">
         <ItemComponent
        name='desc' title='题干' rows={3} onChange={this.handleChange.bind(this)}
        value={this.state.desc}
        onBlur={this.handleDescBlur.bind(this)}
    />
    <ItemComponent
        name='opts' title='选项' rows={4} onChange={this.handleChange.bind(this)}
        value={this.state.opts}
    />
    <ItemComponent
        name='ans' title='答案' rows={1} onChange={this.handleChange.bind(this)}
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