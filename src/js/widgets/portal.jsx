import React from 'react'
import ReactDOM from 'react-dom'

export default class Portal extends React.Component {
  constructor(props) {
    super(props)
    this.el = document.createElement('div');
    this.el.className = this.props.maskClassName;
    this.container = document.createElement('div');
    let button = document.createElement('button');
    button.innerHTML = '<span aria-hidden="true">&times;</span>';
    button.className = 'close';
    button.setAttribute('type', 'button');
    button.addEventListener('click', this.closePreview);
    this.container.appendChild(button);
    this.el.appendChild(this.container);
    this.container.className = this.props.containerClassName;
    if (this.props.previewPlan) {
      this.el.className = `${this.el.className} plan-preview-show`
    }

  }

  componentDidMount() {
    document.body.appendChild(this.el)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.previewPlan) {
      this.el.classList.add('plan-preview-show')
    } else {
      this.el.classList.remove('plan-preview-show')
    }
  }

  closePreview = () => {
    if (this.props.closeHandler) {
      return this.props.closeHandler()
    }
    this.el.classList.remove('plan-preview-show')
    this.props.closePortalCallback && this.props.closePortalCallback();
  }

  componentWillUnmount() {
    document.body.removeChild(this.el)
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.previewPlan != this.props.previewPlan
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.container)
  }
}
Portal.defaultProps = {
  maskClassName: 'plan-preview-background',
  containerClassName: 'plan-preview'
}
/*
Portal.propTypes = {
  maskClassName: PropTypes.string,
  containerClassName: PropTypes.string,
  closePortalCallback: PropTypes.func,
  closeHandler: PropTypes.closeHandler
}*/
