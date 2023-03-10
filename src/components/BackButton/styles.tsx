import { StyleSheet } from "react-native";
import { colors } from "../../../utils/globalStyles";

const styles = StyleSheet.create({
    arrowColor: {
        backgroundColor: colors.foreground,
        height: 40,
        width: 40,
        margin: 8,
        borderRadius: 25,
    },
    buttonFill: {
        position: 'absolute',
        top: 0,
        left: 0,
        shadowOpacity: 0.5,
        shadowRadius: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowColor: colors.foreground,
    }
});

export default styles;
