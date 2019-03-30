import React from 'react'
import showAlert from "../widgets/alert";
import {connect} from 'react-redux'
import {store} from 'js/main_entry'
import {Grid, Row, Col} from 'react-flexbox-grid';
import KtagTree from './tree'
import Content from './content'
export default class Ktag extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Row className="lesson-wrapper">
                <KtagTree {...this.props} />
                <Col xs>
                    <Content/>
                </Col>
            </Row>
        )
    }
}