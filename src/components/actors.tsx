import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as Linking from 'expo-linking'
import { colors } from '../styles/global'
import { Actor } from '../models/movie'

interface ActorProps {
    actor: Actor
}

interface ActorsProps {
    actors: Actor[]
}

const ActorContainer = (props: ActorProps) => {
    let imageURI = 'https://image.tmdb.org/t/p/original'
    // TODO: This link structure is incorrect. The ID we have for actor does not match the name ID
    let imdbURI = 'https://www.imdb.com/name/'

    return (
        <View style={styles.ActorContainer}>
            <TouchableOpacity onPress={() => { Linking.openURL(`${imdbURI}${props.actor.id}`) }}>
                <Image
                    source={{ uri: `${imageURI}${props.actor.profile_path}` }}
                    style={styles.ActorImage}
                />
                <Text style={styles.ActorText} numberOfLines={2}>{props.actor.name}</Text>
            </TouchableOpacity>
        </View>
    )
}

const Actors = (props: ActorsProps) => {
    return (
        <View style={styles.ActorsContainer}>
            <ActorContainer actor={props.actors[0]} />
            <ActorContainer actor={props.actors[1]} />
            <ActorContainer actor={props.actors[2]} />
        </View>
    )
}

const styles = StyleSheet.create({
    ActorsContainer: {
        color: colors.primary,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        minWidth: 240,
        paddingBottom: 12,
        paddingTop: 12
    },
    ActorContainer: {
        alignItems: 'center',
        flex: 1,
        maxWidth: 60,
        minHeight: 120
    },
    ActorImage: {
        flex: 1,
        height: 90,
        width: 60
    },
    ActorText: {
        flex: 1,
        fontFamily: 'Arvo-Regular',
        fontSize: 12,
        height: 30,
        paddingTop: 4,
        textAlign: 'center'
    }
})

export default Actors
