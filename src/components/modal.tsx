import React from 'react'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'

import { colors } from '../styles/global'
import Facts from './facts'

interface MovieModalProps {
    movie: Movie
    show: SetStateAction
    toggleModal: SetStateAction
}

const MovieModal = (props: MovieModalProps) => {
    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.show}
                onRequestClose={() => {
                    props.toggleModal(false)
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Facts movie={props.movie} />
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => props.toggleModal(false)}>
                            <Text style={styles.textStyle}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        justifyContent: 'center'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: colors.secondary,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 16,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: colors.primary,
    },
    buttonClose: {
        backgroundColor: colors.primary,
    },
    textStyle: {
        color: colors.background,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    }
})

export default MovieModal
