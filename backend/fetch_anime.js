require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

const anime = [
    'Naruto', 'One Piece', 'Dragon Ball', 'Bleach', 'Frieren: Beyond Journey\'s End',
    'Jujutsu Kaisen', 'Hunter x Hunter', 'Attack on Titan', 'Dr. Stone',
    'Vinland Saga', 'Monster', 'Assassination Classroom', 'Another',
    'Mob Psycho 100', 'One Punch Man', 'Horimiya', 'Fullmetal Alchemist: Brotherhood'
];

async function run() {
    let output = '';
    for (const q of anime) {
        try {
            const res = await axios.get('https://api.themoviedb.org/3/search/tv', {
                params: { api_key: process.env.TMDB_API_KEY, query: q }
            });
            if (res.data.results && res.data.results.length > 0) {
                const bestMatch = res.data.results[0];
                output += `${q}: ${bestMatch.id} (${bestMatch.name})\n`;
            } else {
                output += `${q}: NOT FOUND\n`;
            }
        } catch (e) {
            output += `${q}: ERROR (${e.message})\n`;
        }
    }
    fs.writeFileSync('anime_ids.txt', output);
    console.log('Results written to anime_ids.txt');
}

run();
