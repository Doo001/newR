import React from 'react';
import Immutable from 'immutable';
import { DEFAULT_PROVINCE_LIST } from 'js/quantum';

export default class ProvinceSelect extends React.Component {
    componentWillReceiveProps(nextProps) {
        this.setState({ value: nextProps.value });
    }

    handleChange(event) {
        this.props.onListChanged(
            Immutable.Seq(event.target.options).filter(option => option.selected)
            .map(option => option.value).toList());
    }

    render() {
        return (
            <select
                multiple className={this.props.className} value={this.props.value.toJS()}
                onChange={this.handleChange.bind(this)}
            >
                {DEFAULT_PROVINCE_LIST.map(p => <option value={p} key={p}>{p}</option>)}
            </select>
        );
    }
}
