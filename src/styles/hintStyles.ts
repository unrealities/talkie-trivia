import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const hintStyles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: responsive.scale(10),
        marginTop: responsive.scale(10),
    },
    hintButtons: {
        flexDirection: "row",
        alignItems: "center",
    },
    hintButton: {
        borderRadius: responsive.scale(15),
        padding: responsive.scale(6),
        minWidth: responsive.scale(30),
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: responsive.scale(3),
    },
    buttonText: {
        color: colors.secondary,
        fontSize: responsive.responsiveFontSize(16),
        textAlign: "center",
    },
    disabled: {
        opacity: 0.5,
    },
    hintText: {
        color: colors.secondary,
        fontFamily: "Arvo-Regular",
        fontSize: responsive.responsiveFontSize(14),
        marginLeft: responsive.scale(12),
        textAlign: "center",
    },
});

