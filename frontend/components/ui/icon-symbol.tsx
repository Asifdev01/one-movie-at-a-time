import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

// Simple mapping from SF Symbol style names to MaterialCommunityIcons names
const MAPPING = {
    'house.fill': 'home',
    'paperplane.fill': 'send',
} as const;

export type IconSymbolName = keyof typeof MAPPING;

interface IconSymbolProps {
    name: IconSymbolName;
    size?: number;
    color: string | OpaqueColorValue;
    style?: StyleProp<TextStyle>;
    weight?: string; // Not used but present in SF Symbols API
}

export const IconSymbol: React.FC<IconSymbolProps> = ({ name, size = 24, color, style }) => {
    return (
        <MaterialCommunityIcons
            name={MAPPING[name]}
            size={size}
            color={color}
            style={style}
        />
    );
};
