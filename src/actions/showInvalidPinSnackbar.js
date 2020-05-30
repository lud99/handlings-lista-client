export const SET_SHOW_INVALID_PIN_SNACKBAR = "SET_SHOW_INVALID_PIN_SNACKBAR";

export const setShowInvalidPinSnackbar = (flag) => {
    return {
        type: SET_SHOW_INVALID_PIN_SNACKBAR,
        flag: flag
    }
}