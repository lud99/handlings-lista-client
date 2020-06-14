import React, { forwardRef } from 'react';

const Input = forwardRef((props, ref) => (
    <input type="text" ref={ref} { ...props} />
));

Input.defaultProps = {
    autoComplete: "on",
    autoCorrect: "on",
    autoCapitalize: "on",
    spellCheck: "true"
}

export default Input;