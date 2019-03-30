import React from 'react';
import Global from 'global';
import { ItemDisplay } from './display';

export default function ItemList({ ids }) {
    const lis = ids.map(id => <li key={id}><ItemDisplay id={id} /></li>);
    return (
        <ol> {lis} </ol>
    );
}

ItemList.defaultProps = {
    ids: Global.item_ids,
};
