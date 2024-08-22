import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { TooltipContext } from './TooltipContext';
import Tooltip from './Tooltip';

const TooltipOverlay = () => {
    const { tooltip, hideTooltip } = useContext(TooltipContext);

    if (!tooltip.visible) return null;

    return (
        <TouchableOpacity
            style={styles.globalTouchArea}
            activeOpacity={1}
            onPress={hideTooltip}
        >
            <Tooltip />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    globalTouchArea: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1, // Ensure it's on top
    },
});

export default TooltipOverlay;
