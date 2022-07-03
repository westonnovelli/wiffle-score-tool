import React from "react";

// copied from https://usehooks.com/useHistory/

interface HistoryState<T> {
    past: T[];
    present: T;
    future: T[];
}

type Action<T> =
    { type: 'UNDO' }
    | { type: 'REDO' }
    | { type: 'SET', newPresent: T }
    | { type: 'CLEAR', initialPresent: T };

// Initial state that we pass into useReducer
const initialHistory = <T>(initialValue: T): HistoryState<T> => ({
    // Array of previous state values updated each time we push a new state
    past: [],
    // Current state value
    present: initialValue,
    // Will contain "future" state values if we undo (so we can redo)
    future: [],
});

// Our reducer function to handle state changes based on action
function reducer<T>(state: HistoryState<T>, action: Action<T>): HistoryState<T> {
    const { past, present, future } = state;

    switch (action.type) {
        case "UNDO":
            const previous = past[past.length - 1];
            const newPast = past.slice(0, past.length - 1);
            return {
                past: newPast,
                present: previous,
                future: [present, ...future],
            };
        case "REDO":
            const next = future[0];
            const newFuture = future.slice(1);
            return {
                past: [...past, present],
                present: next,
                future: newFuture,
            };
        case "SET":
            const { newPresent } = action;
            if (newPresent === present) {
                return state;
            }
            return {
                past: [...past, present],
                present: newPresent,
                future: [],
            };
        case "CLEAR":
            const { initialPresent } = action;
            return initialHistory({...initialPresent});
        default:
            return state;
    }
};

interface HistoryResult<T> {
    state: HistoryState<T>;
    set: (newT: T) => void;
    undo: () => void;
    redo: () => void;
    clear: (newT?: T) => void;
    canUndo: boolean;
    canRedo: boolean;
}

// Hook
const useHistory = <T>(initialPresent: T): HistoryResult<T> => {
    const [state, dispatch] = React.useReducer<typeof reducer<T>, HistoryState<T>>(
        reducer,
        initialHistory(initialPresent),
        () => initialHistory(initialPresent)
    );

    const canUndo = state?.past?.length !== 0;
    const canRedo = state?.future?.length !== 0;

    const undo = React.useCallback(
        () => { if (canUndo) dispatch({ type: "UNDO" });
    }, [canUndo, dispatch]);

    const redo = React.useCallback(
        () => { if (canRedo) dispatch({ type: "REDO" });
    }, [canRedo, dispatch]);

    const set = React.useCallback(
        (newPresent: T) => dispatch({ type: "SET", newPresent }),
        [dispatch]
    );

    const clear = React.useCallback(
        (newInitial?: T) => {
            const newInitialValue = newInitial ? newInitial : initialPresent;
            dispatch({ type: "CLEAR", initialPresent: newInitialValue })
        }, [
        dispatch,
        initialPresent,
    ]);

    return { state, set, undo, redo, clear, canUndo, canRedo };
};

export default useHistory;
