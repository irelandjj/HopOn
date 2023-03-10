import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../../../utils/globalStyles";

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 15,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: colors.highlight,
    },
    textButton: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: colors.white,
    },
    disabledButton: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 15,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: colors.foreground,
    },
    disabledText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: colors.white,
        opacity: 0.5,
    }
});

export default styles;