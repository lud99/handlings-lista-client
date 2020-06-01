import React, { useState, useEffect } from 'react';


    /* 
    full:
transform: none; transition: transform 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;


    from:
transform: scale(0); transition: transform 195ms cubic-bezier(0.4, 0, 0.2, 1) 0ms; visibility: hidden;
    */

const Zoom = ({ doAnimation, enabled, children }) => {
    const [animate, setAnimate] = useState(enabled);

    useEffect(() => setAnimate(!animate), [enabled]);

    var style = {};

    if (animate && doAnimation) {
        style = {
            transform: "scale(0)",
            transition: "transform 195ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            
            //visibility: "hidden"
        }
    } else {
        style = {
            transform: "none",
            transition: "transform 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"
        }
    }

    return (
        <div style={style}>
            {children}
        </div>
    )
}

export default Zoom;