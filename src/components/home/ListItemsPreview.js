import React from 'react';

import Utils from '../../Utils';

const ListItemsPreview = ({ listCompleted, items }) => {
    // Filter out the items with no text
    const filteredItems = items.filter(item => item.text !== "");

    return (
        <ul className="listItemsPreview">
            <li>{ filteredItems.length > 0 ? 

                // There are items
                filteredItems.map((item, i) => {
                    const style = { color: (item.completed && !listCompleted) ? "#5e982a" : "#313131" };

                    const text = Utils.capitalize((i < filteredItems.length - 1) ? `${item.text}, ` : item.text); 

                    return <span style={style} key={item._id}>{text}</span>
                }) : 

                // There are no items
                "Inga föremål" }</li>
        </ul>
    )
}

export default ListItemsPreview;