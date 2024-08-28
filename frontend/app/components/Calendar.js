import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import * as CalendarPickerModule from 'react-native-calendar-picker/CalendarPicker/makeStyles';

// Monkey patch the calendar styles
const originalMakeStyles = CalendarPickerModule.makeStyles;
CalendarPickerModule.makeStyles = (props) => {
    const { containerWidth, containerHeight, scaleFactor } = props;
    const scaler = Math.min(containerWidth, containerHeight) / scaleFactor;

    const styles = originalMakeStyles(props);

    const customStyles = {
        ...styles,
        calendar: {
            ...styles.calendar,
            backgroundColor: 'white',
        },
        dayLabels: {
            ...styles.dayLabels,
            color: 'white',
        },
        dayLabel: {
            ...styles.dayLabel,
            color: '#aaa',
        },
        dayWrapper: {
            ...styles.dayWrapper,
            width: 50 * scaler,
            height: 33 * scaler,
        },
        selectedDay: {
            ...styles.selectedDay,
            width: 45 * scaler,
            height: 30 * scaler,
        },
        dayButton: {
            ...styles.dayButton,
            width: 45 * scaler,
            height: 30 * scaler,
        },
        selectedToday: {
            ...styles.selectedToday,
            width: 45 * scaler,
            height: 30 * scaler,
            borderRadius: 3,
        },
    };

    return customStyles;
};

const Calendar = ({ onDateChange, selectedDate, calendarWidth, onMonthChange, disabledDates }) => {
    return (
        <View style={[styles.calendarWrapper, { width: calendarWidth }]}>
            <CalendarPicker
                onDateChange={onDateChange}
                selectedStartDate={selectedDate}
                onMonthChange={onMonthChange}
                disabledDates={disabledDates}
                previousComponent={
                    <Image
                        source={require('../../assets/icons/chevron-left.png')}
                        style={styles.calendarArrow}
                    />
                }
                nextComponent={
                    <Image
                        source={require('../../assets/icons/chevron-right.png')}
                        style={styles.calendarArrow}
                    />
                }
                width={calendarWidth}
                todayBackgroundColor="#999"
                selectedDayColor="#000"
                selectedDayTextColor="#FFF"
                textStyle={{
                    color: '#000',
                }}
                previousTitleStyle={{
                    color: '#FFF',
                }}
                nextTitleStyle={{
                    color: '#FFF',
                }}
                monthTitleStyle={{
                    color: '#FFF',
                    fontSize: 14,
                    fontFamily: 'Roboto',
                    fontWeight: '500',
                }}
                yearTitleStyle={{
                    color: '#FFF',
                    fontSize: 14,
                    fontFamily: 'Roboto',
                    fontWeight: '500',
                }}
                headerWrapperStyle={{
                    backgroundColor: '#000',
                    paddingBottom: 4,
                    paddingTop: 3,
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                }}
                dayLabelsWrapper={{
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                    marginTop: -13,
                    marginBottom: -9,
                }}
                selectedDayStyle={{
                    backgroundColor: 'black',
                    borderRadius: 3,
                }}
                dayShape="square"
                customDayHeaderStyles={() => ({
                    textStyle: { color: '#aaa' },
                })}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    calendarWrapper: {
        borderWidth: 1,
        borderRadius: 5,
        paddingBottom: 2,
    },
    calendarArrow: {
        width: 20,
        height: 20,
        marginBottom: 2,
    },
});

export default Calendar;
