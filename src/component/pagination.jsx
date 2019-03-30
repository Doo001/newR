import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Select, {Option} from 'rc-select'
import 'component/css/pagination.scss'
class Pagination extends Component {
    constructor(props) {
        super(props)
        this.pages = []
        this.jumpPages = []
    }
    updatePage = (total, current, count)=> {
        this.pages = [];
        this.jumpPages = []
        for(let j = 1; j <= total; j++) {
            this.jumpPages.push(j)
        }
        if (total <= count) {
            for (let i = 1; i <= total; i++) {
                this.pages.push(i)
            }
            return
        }
        if (current < count) {
            for (let j = 1; j <= count; j++) {
                this.pages.push(j)
            }
            return
        }
        let middle = Math.floor(count/2), max = Math.min(total, current + middle), min = Math.max(1,current - middle)
        for (; min <= max; min++) {
            this.pages.push(min)
        }
        return
    }
    state = {
        current: this.props.current
    }
    componentDidMount() {
        this.updatePage(this.props.total, this.state.current, this.props.count);
        this.forceUpdate()
    }
    componentWillReceiveProps(nextProps) {
        this.updatePage(nextProps.total,nextProps.current, nextProps.count);
        this.setState({
            current: nextProps.current
        });
    }
    changePage = (value) => {
        this.updatePage(this.props.total, value, this.props.count)
        this.setState({
            current: value
        }, () => {
            this.props.changePage(value)
        })
    }
    jumpPage = value => {
        this.setState({
            current: value
        }, () => {
            this.props.changePage(value)
        })
    }
    render() {
        if (!this.props.total) return null;
        let { current } = this.state;
        let options = this.pages.map((page, index) =><li key={`page${index} `}  className={`page ${page == current ? 'active': ''}`}><button  disabled={current == page ? true: false} onClick={e=>this.changePage(page)}>{page}</button></li>)
        options.unshift(<li key={`pagefirst`}><button onClick={e=>this.changePage(current-1)} disabled={current == this.pages[0] ? true: false }>{'<'}</button></li>)
        options.push(<li key={`pagelast`}><button onClick={e=>this.changePage(current+1)} disabled={current == this.props.total ? true: false }>{'>'}</button></li>)
        this.props.showPageJump && options.push(<li className="jumpPage" key='jumpPage' >跳转到 <Select style={{width: 70}} onChange={this.jumpPage} showSearch={false} optionLabelProp="children"  value={current}>
            {this.jumpPages.map((item, index) =><Option key={`jump${index}`} value={item}>{item}</Option>)}
            </Select></li>)
        return (
            <div className='pagination-wrapper'>
                <ul>
                    {
                        options
                    }
                </ul>
            </div>
        )
    }
}
Pagination.protypes = {
    total: PropTypes.number.isRequired,
    current: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    changePage: PropTypes.func.isRequired,
    showPageJump: PropTypes.bool
}

Pagination.defaultProps = {
    count: 10,
    showPageJump: true
}
export default Pagination