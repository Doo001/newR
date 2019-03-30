import React from 'react';


export function KtItems(props) {
    const ktags = props.ktags;
    const tagAttr = props.tagAttr || "path";
    return (
        <ul className="kt-items">
            {
                ktags.map(t =>
                    <KtItem
                        ktag={t}
                        key={t.get('path')}
                        tagAttr={tagAttr}
                        removeKtagEvent={props.removeKtagEvent}
                        type={props.type}
                    />
                )
            }
        </ul>
    );
}

class KtItem extends React.Component {
    clickHandler(kid) {
        if (this.props.removeKtagEvent) {
            this.props.removeKtagEvent(kid);
        }
    }
    render() {
        const ktag = this.props.ktag;
        const tagAttr = this.props.tagAttr;
        return (
            <li>
                <span>{ktag.get(tagAttr)}</span>
                <a
                    className="tool-icon-wrapper"
                    onClick={this.clickHandler.bind(this, ktag.get('id'))}
                >
                    <span className="glyphicon glyphicon-remove" />
                </a>
            </li>
        );
    }
}
