import { defineMiddleware } from "astro/middleware";

export const siteData = defineMiddleware(({locals}, next) => {
    locals.currentYear = 2024;

    locals.siteName = "Dark Castle Fest";
    locals.domain = "https://www.darkcastlefest.com";

    locals.social = {
        facebook: "https://www.facebook.com/dark.castle.fest",
        instagram: "https://www.instagram.com/dark.castle.fest",
    };

    locals.spotifyPlaylist = "https://open.spotify.com/playlist/17htGghK3PuiiOgrAXcAPe";

    return next();
});