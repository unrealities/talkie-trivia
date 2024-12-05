// Cloud Function (or server-side logic)
const setDailyMovie = async () => {
    const today = new Date();
    const movieIndex = today.getDate() % movies.length;
    const selectedMovie = movies[movieIndex];

    await firestore().collection('dailyMovies').doc(today.toISOString().split('T')[0]).set({
        date: today,
        movieId: selectedMovie.id,
    });
};
