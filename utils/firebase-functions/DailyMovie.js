const { onSchedule } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

exports.setDailyMovie = onSchedule("every day 00:00", async (event) => {
    logger.info("Running daily movie selection cron job.");

    try {
        const db = getFirestore();
        const moviesSnapshot = await db.collection("movies").get();

        if (moviesSnapshot.empty) {
            logger.error("No movies found in the 'movies' collection. Cannot set daily movie.");
            return;
        }

        const movies = moviesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const movieIndex = dayOfYear % movies.length;
        const selectedMovie = movies[movieIndex];

        const dateId = today.toISOString().split('T')[0];

        await db.collection('dailyGames').doc(dateId).set({
            date: today,
            movieId: parseInt(selectedMovie.id, 10),
        });

        logger.info(`Successfully set daily movie for ${dateId} to movie ID: ${selectedMovie.id}`);
    } catch (error) {
        logger.error("Failed to set daily movie:", error);
    }
});
