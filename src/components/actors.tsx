import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
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

    return (
        <View style={styles.ActorContainer}>
            <Image
                source={{ uri: `${imageURI}${props.actor.profile_path}` }}
                style={styles.ActorImage}
            />
            <Text style={styles.ActorText} numberOfLines={2}>{props.actor.name}</Text>
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
        minWidth: 300,
        paddingBottom: 12,
        paddingTop: 12
    },
    ActorContainer: {
        alignItems: 'center',
        flex: 1,
        maxWidth: 90,
        minHeight: 120
    },
    ActorImage: {
        flex: 1,
        height: 90,
        width: 60
    },
    ActorText: {
        flex: 1,
        flexWrap: 'wrap',
        fontFamily: 'Arvo-Regular',
        fontSize: 12,
        paddingTop: 4,
        textAlign: 'center'
    }
})

export default Actors
