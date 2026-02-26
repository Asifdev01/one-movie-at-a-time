import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';

export const HapticTab: React.FC<BottomTabBarButtonProps> = (props) => {
    const { onPress, ...rest } = props;
    const handlePress = (event: any) => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.(event);
    };

    return (
        <TouchableOpacity
            {...(rest as any)}
            onPress={handlePress}
            activeOpacity={0.7}
        />
    );
};
