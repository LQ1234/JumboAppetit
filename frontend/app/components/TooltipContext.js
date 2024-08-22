import React, { createContext, useState } from 'react';

export const TooltipContext = createContext();

export const TooltipProvider = ({ children }) => {
    const [tooltip, setTooltip] = useState({
        visible: false,
        title: '',
        text: '',
        position: { top: 0, left: 0 },
    });

    const showTooltip = (title, text, position) => {
        setTooltip({ visible: true, title, text, position });
    };

    const hideTooltip = () => {
        setTooltip({ ...tooltip, visible: false });
    };

    return (
        <TooltipContext.Provider value={{ tooltip, showTooltip, hideTooltip }}>
            {children}
        </TooltipContext.Provider>
    );
};
