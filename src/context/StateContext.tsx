import React, { createContext, useContext, useState, useEffect } from "react";

type State = "All India" | "Telangana" | "Andhra Pradesh" | "Karnataka" | "Tamil Nadu" | "Maharashtra" | "Kerala";

interface StateContextType {
    selectedState: State;
    setSelectedState: (state: State) => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedState, setSelectedState] = useState<State>("All India");

    return (
        <StateContext.Provider value={{ selectedState, setSelectedState }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => {
    const context = useContext(StateContext);
    if (context === undefined) {
        throw new Error("useStateContext must be used within a StateProvider");
    }
    return context;
};
