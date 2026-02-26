require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

const animation = [
    'BoJack Horseman', 'The Boondocks', 'Rick and Morty', 'Arcane',
    'Batman: The Animated Series', 'Adventure Time', 'Teen Titans',
    'Courage the Cowardly Dog', 'Kick Buttowski: Suburban Daredevil',
    'The Simpsons', 'Phineas and Ferb', 'Scooby-Doo, Where Are You!',
    'The Powerpuff Girls', 'Marvel\'s Spider-Man', 'Oggy and the Cockroaches',
    'Mr. Bean: The Animated Series', 'Teen Titans Go!'
];

async function run() {
    let output = '';
    for (const q of animation) {
        try {
            const res = await axios.get('https://api.themoviedb.org/3/search/tv', {
                params: { api_key: process.env.TMDB_API_KEY, query: q }
            });
            if (res.data.results && res.data.results.length > 0) {
                // Filter for best match, maybe checking air date for Batman 1992
                let bestMatch = res.data.results[0];
                if (q === 'Batman: The Animated Series') {
                    const batman92 = res.data.results.find(r => r.first_air_date && r.first_air_date.startsWith('1992'));
                    if (batman92) bestMatch = batman92;
                }
                if (q === 'Teen Titans') {
                    // Avoid Go! or other versions if possible
                    const tt = res.data.results.find(r => r.name === 'Teen Titans');
                    if (tt) bestMatch = tt;
                }
                output += `${q}|${bestMatch.id}|${bestMatch.name} (${bestMatch.first_air_date})\n`;
            } else {
                output += `${q}|NOT FOUND|NOT FOUND\n`;
            }
        } catch (e) {
            output += `${q}|ERROR|${e.message}\n`;
        }
    }
    fs.writeFileSync('animation_verified_ids.txt', output);
    console.log('Results written to animation_verified_ids.txt');
}

run();
