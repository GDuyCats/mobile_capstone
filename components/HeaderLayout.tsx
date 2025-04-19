import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
interface HeaderLayoutProps {
    title: string;
    onBackPress: () => void;
    background?: string;
    fontColor?: string
}

function HeaderLayout({ title, onBackPress, background = '#fff', fontColor= "#000" }) {
    return (
        <View style={[styles.container, {backgroundColor: background}]}>
            <TouchableOpacity onPress={onBackPress}>
                <AntDesign name="leftcircleo" size={24} color = {fontColor} />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, color: fontColor }}>{title}</Text>
            <View style={{ width: 24 }} />
        </View>
    )
}

export default HeaderLayout

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop:30,
        paddingBottom: 10
    }
})
