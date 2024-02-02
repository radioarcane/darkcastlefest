
import { getEntry } from "astro:content";
import dayjs from 'dayjs';

const domain = "https://www.darkcastlefest.com";

export async function locationSchema (slug: string) {
    const location = await getEntry("locations", slug);

    return {
        "@type": "Place",
        name: location?.data.title,
        address: {
           '@type': 'PostalAddress',
           streetAddress: `${ location?.data.address } ${ location?.data.address2 || ''}`.trim() || null,
           addressLocality: location?.data.city || null,
           addressRegion: location?.data.stateLong || location?.data?.state || null,
           postalCode: location?.data.zipcode,
           addressCountry: 'US'
         },
         hasMap: location?.data.mapUrl || null,
         sameAs: [
           location?.data.website,
           location?.data.facebook,
           location?.data.instagram,
         ].filter((value) => value)
    };
}

export async function performerSchema (slug: string) {
    const performer = await getEntry("performers", slug);

    return {
        "@type": "MusicGroup",
        "@id": performer?.data?.ref || null,
        name: performer?.data.name,
        description: performer?.data?.description || null,
        logo: performer?.data?.logo ? {
            "@type": "ImageObject",
            url: `${domain}${performer.data.logo}`
        } : null,
        image: {
            "@type": "ImageObject",
            url: `${domain}${performer?.data?.image}`
        },
        genre: performer?.data?.genres || [],
        url: performer?.data?.links?.official || null,
        sameAs: [
            performer?.data?.links?.bandcamp,
            performer?.data?.links?.youtube,
            performer?.data?.links?.spotify,
            performer?.data?.links?.facebook,
            performer?.data?.links?.instagram,
            performer?.data?.links?.twitter,
            performer?.data?.links?.soundcloud,
            performer?.data?.links?.linktree,
            performer?.data?.links?.mixcloud,
            performer?.data?.links?.twitch,
        ].filter((value) => value)
    };
}

export async function musicEventSchema (slug: string) {
    const musicEvent = await getEntry("events", slug);
    const bands = musicEvent?.data?.bands || [];
    const djs = musicEvent?.data?.djs || [];
    const performing = [...bands, ...djs];
    const performers = [];

    for (const { slug } of performing) {
        const performer = await performerSchema(slug);
        performers.push(performer);
    }

    const locationSlug = musicEvent?.data?.location?.slug;

    return {
        "@context": "https://schema.org",
        "@type": "MusicEvent",
        name: "Dark Castle Fest",
        url: domain,
        startDate: musicEvent?.data?.startDatetime || null,
        endDate: musicEvent?.data?.endDatetime || null,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        image: musicEvent?.data?.image ? {
            "@type": "ImageObject",
            url: `${domain}${musicEvent?.data.image}`
        } : null,
        description: 'Radio Arcane presents Dark Castle Fest: A Gothic Music & Dark Arts Festival',
        sameAs: [
            "https://www.facebook.com/dark.castle.fest",
            "https://www.instagram.com/dark.castle.fest",
        ],
        location: locationSlug ? await locationSchema(locationSlug) : null,
        offers: {
            "@type": "Offer",
            description: musicEvent?.data?.ticketDescription || null,
            url: musicEvent?.data?.ticketsUrl || null,
            price: musicEvent?.data?.ticketPrice ? parseInt(musicEvent.data.ticketPrice.toString().replace(/[^\d.]/g, '')) : null,
            priceCurrency: "USD",
            availability: dayjs().isBefore(dayjs(musicEvent?.data.endDatetime)) ? "https://schema.org/InStock" : "http://schema.org/Discontinued",
            validFrom: musicEvent?.data?.endDatetime ? musicEvent?.data?.endDatetime.split("T").shift() : null
         },
        performer: performers,
        organizer: {
            "@type": "Organization",
            name: "Radio Arcane",
            logo: "https://www.radio-arcane.com/img/radio-arcane.jpg",
            url: "https://www.radio-arcane.com",
            sameAs: [
               "https://www.facebook.com/RadioArcaneEvents",
               "https://www.instagram.com/radio_arcane",
               "https://www.youtube.com/@RadioArcane",
               "https://www.twitch.tv/radio_arcane_tv",
               "https://twitter.com/Radio_Arcane",
               "https://open.spotify.com/show/1agKdqPjtH92Gw33dcLbS1",
               "https://www.mixcloud.com/Radio-Arcane",
               "https://soundcloud.com/radio_arcane"
            ]
         },
    };
};