import fs from 'fs';

import performers from "./darkcastlefest-main/src/html/_data/performers.json" assert { type: "json" };


performers.performers.forEach((item) => {

    console.log(item.links);

    let s = "---\n";

    s += `_type: "${item.type}"\n`;
    s += `name: "${item.name}"\n`;
    s += `slug: "${item.slug}"\n`;
    s += `path: "${item.path}"\n`;
    s += `image: "${item.image}"\n`;

    if (item.logo) {
        s += `logo: "${item.logo}"\n`;
    }
    else {
        s += `logo: null\n`;
    }

    s += `event: "dark-castle-fest-${item.year}"\n`;
    s += `location: "${item.location}"\n`;
    s += `performanceDate: "${item.date}T00:00:00Z"\n`;
    s += `genres:\n`;
    
    item.genres.forEach(genre => {
        s += `   - ${genre}\n`;
    });

    s += `links:\n`;
    
    const social = [
        'bandcamp', 'youtube', 'spotify', 'facebook', 'instagram', 'twitter',
        'soundcloud', 'linktree', 'official', 'mixcloud', 'twitch',
    ];

    social.forEach(key => {
        if (item.links.hasOwnProperty(key) && item.links[key]) {
            s += `   ${key}: "${item.links[key] }"\n`;
        }
        else {
            //s += `   ${key}: null\n`;
        }
    });

    s += `description: "${item.description}"\n`;

    

    if (item["@id"]) {
        s += `ref: "${item["@id"]}"\n`;
    }
    else {
        s += `ref: null\n`;
    }
    
    s += `---\n\n`;

    const contentLen = item.content.length;
    const lastIndex = contentLen - 1;

    item.content.forEach((content, i) => {
        s += `${ content.text }`;

        if ( i !== lastIndex ) {
            s += `\n\n\n\n`;
        }
        else {
            s += `\n`;
        }
    });

    fs.writeFileSync(`./src/content/performers/${item.slug}.md`, s);
});

/*
---
genres:
  - Gothic Rock
  - Darkwave
  - Post-Punk
links:
   bandcamp: "https://officialastarinite.bandcamp.com"
   youtube: "https://www.youtube.com/@AstariNite"
   spotify: "https://open.spotify.com/artist/1Kct3q55cU3hJXomNTjMGo"
   facebook: "https://www.facebook.com/astarinitemusic"
   instagram: "http://instagram.com/astarinite43"
   twitter: "https://twitter.com/astarinite"
   soundcloud: "https://soundcloud.com/astariniteofficial"
   linktree: "https://linktr.ee/AstariNite"
   official: null
   mixcloud: null
   twitch: null
description: "Short desc..."
"@id": "https://musicbrainz.org/artist/87770db3-ed30-424e-9bea-d79011c7189e"
---

Astari Nite crosses an obscure mix between Gothic Rock, Post-Punk and Darkwave, exploring themes of death, love, and the occult.


Haivng performed alongside acts such as Peter Murphy, The Damned, Psychedelic Furs, She Wants Revenge, Cold Cave, Assemblage 23, Black Rebel Motorcycle Club, Modern English, Andy Yorke, Peter Hook and the Light, She Past Away and Bestial Mouths they have established themselves as contemporaries of the dark alternative music scene.
*/