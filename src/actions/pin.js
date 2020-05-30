export const SET_PIN = "SET_PIN";

export const setPin = (pin) => {
    return {
        type: SET_PIN,
        pin: pin
    }
}