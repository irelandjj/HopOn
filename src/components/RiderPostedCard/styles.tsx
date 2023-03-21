import { StyleSheet } from "react-native";
import { colors } from "../../utils/globalStyles";


const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        padding: 10,
        backgroundColor: colors.white,
        marginBottom: 10,
    },
    directions: {
        flexDirection: "column",
        padding: 5,
    },
    address: {
        fontWeight: "bold",
        color: colors.primaryText,
    },
    riderInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    riderName: {
        padding: 5,
        color: colors.primaryText,
    },
    tripInfo: {
        justifyContent: "center",
    },
    tripCost: {
        justifyContent: "center",
        color: colors.primaryText,
    },
    riderAndTripInfo: {
        flexDirection: "row",
        padding: 5,
        justifyContent: "space-between",
    }
});

export default styles;