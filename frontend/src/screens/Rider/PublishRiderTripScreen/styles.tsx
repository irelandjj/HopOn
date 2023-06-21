import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../../../utils/globalStyles";

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    inputContainer: {
        height: 125,
        width: '100%',
        backgroundColor: colors.white,
        position: 'relative'
    },
    textInput: {
        padding: 5,
        height: 50,
        backgroundColor: '#eee',
        marginVertical: 5,
        marginLeft: 20,
        color: colors.primaryText,
    },
    originIcon: {
        width: 8,
        height: 8,
        backgroundColor: colors.foreground,
        borderRadius: 5,
        position: 'absolute',
        top: 33,
        left: 12
    },
    line: {
        width: 1,
        height: 33,
        backgroundColor: colors.foreground,
        position: 'absolute',
        top: 45,
        left: 15.5
    },
    destinationIcon: {
        position: 'absolute',
        fontSize: 20,
        top: 80,
        left: 6,
        color: colors.foreground
    },
    map: {
        flex: 1
    },
    backIcon: {
        position: 'absolute',
        bottom: 15,
        left: 5,
        zIndex: 100,
    },
    activityIndicator: {
        position: 'absolute',
        bottom: 15,
        alignSelf: 'center',
    }
});

export default styles;