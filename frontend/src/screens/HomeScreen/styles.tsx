import { StyleSheet } from "react-native";
import { colors } from "../../utils/globalStyles";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    button: {
        height: 48,
        width: 120,
        borderRadius: 4,
        backgroundColor: colors.highlight,
    },
    textButton: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        textAlign: 'center',
        alignContent: 'center',
        paddingVertical: 12,
        color: colors.white,
    },

});

export default styles;