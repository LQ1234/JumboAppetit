import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TooltipContext } from './TooltipContext';

const Tooltip = () => {
    const { tooltip } = useContext(TooltipContext);
    const [tooltipWidth, setTooltipWidth] = useState(0);
    const [tooltipHeight, setTooltipHeight] = useState(0);

    const onLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        setTooltipWidth(width);
        setTooltipHeight(height);
    };

    if (!tooltip.visible) return null;

    // Calculate the final position based on the tooltip's dimensions
    const finalPosition = {
        top: tooltip.position?.top - tooltipHeight - 10 || 0,
        left: tooltip.position?.left - tooltipWidth / 2 || 0,
    };

    return (
        <View style={[styles.absoluteTooltipContainer, finalPosition]} onLayout={onLayout}>
            <View style={styles.tooltip}>
                <Text style={styles.tooltipTitle}>{tooltip.title}</Text>
                <Text style={styles.tooltipText}>{tooltip.text}</Text>
            </View>
            <View style={styles.tooltipNotchContainer}>
                <View style={styles.tooltipNotch} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    absoluteTooltipContainer: {
        position: 'absolute',
        alignItems: 'center',
    },
    tooltip: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    tooltipNotchContainer: {
        position: 'absolute',
        bottom: -7,
        left: '50%',
        transform: [{ translateX: -7.5 }],
        width: 15,
        height: 15,
    },
    tooltipNotch: {
        width: 15,
        height: 15,
        backgroundColor: '#fff',
        transform: [{ rotate: '-45deg' }],
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        position: 'absolute',
        zIndex: -1,
    },
    tooltipTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    tooltipText: {
        fontSize: 14,
        color: '#000',
        textAlign: 'center',
    },
});

export default Tooltip;
