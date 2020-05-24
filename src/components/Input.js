import React, { forwardRef } from 'react';

const Input = forwardRef((props, ref) => (
    <input type="text" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" ref={ref} { ...props} />
));

Input.defaultProps = {
    autoComplete: "off",
    autoCorrect: "off",
    autoCapitalize: "on",
    spellCheck: "false"
}

export default Input;