/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
declare namespace App {
    interface Locals {
        currentYear: number,
        siteName: string,
        domain: string,
        social: {
            facebook: string,
            instagram: string,
        },
        spotifyPlaylist: string,
    }
}