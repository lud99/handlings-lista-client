const reducers = {
    setHistoryLists: (state, action) => ({ ...state, historyLists: action.payload }),
    addHistoryList: (state, action) => (
        {
            ...state, historyLists: [
                { ...action.payload },
                ...state.historyLists
            ]
        }
    )
}

export default reducers;