"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var createTrieNode = function () { return ({
    children: {},
    isEndOfWord: false,
    movieIds: [],
}); };
var buildTrie = function (movies) {
    var root = createTrieNode();
    for (var _i = 0, movies_1 = movies; _i < movies_1.length; _i++) {
        var movie = movies_1[_i];
        var title = movie.title.toLowerCase();
        var node = root;
        for (var i = 0; i < title.length; i++) {
            var char = title[i];
            if (!node.children[char]) {
                node.children[char] = createTrieNode();
            }
            node = node.children[char];
            node.movieIds.push(movie.id);
        }
        node.isEndOfWord = true;
    }
    return root;
};
// Load movie data (make sure the path is correct)
var movies = require("../../data/basicMovies.json");
var trie = buildTrie(movies);
fs.writeFileSync("trie.json", JSON.stringify(trie), "utf8");
console.log("Trie generated and saved to trie.json");
