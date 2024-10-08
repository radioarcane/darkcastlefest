import { z, reference } from 'astro:content';

export const performerSchema = z.object({
    name: z.string(),
    _type: z.enum(["band", "dj", "performance"]),
    path: z.string().startsWith("/").toLowerCase(),
    image: z.string().startsWith("/"),
    logo: z.string().startsWith("/").nullable(),
    event: reference('events'),
    location: z.string(),
    performanceDate: z.string().datetime().nullable(),
    genres: z.array(z.string()),
    links: z.object({
      bandcamp: z.optional(z.string().url().nullable()),
      youtube: z.optional(z.string().url().nullable()),
      spotify: z.optional(z.string().url().nullable()),
      facebook: z.optional(z.string().url().nullable()),
      instagram: z.optional(z.string().url().nullable()),
      twitter: z.optional(z.string().url().nullable()),
      soundcloud: z.optional(z.string().url().nullable()),
      linktree: z.optional(z.string().url().nullable()),
      official: z.optional(z.string().url().nullable()),
      mixcloud: z.optional(z.string().url().nullable()),
      twitch: z.optional(z.string().url().nullable()),
    }),
    description: z.string(),
    seoDescription: z.optional(z.string().nullable()),
    ref: z.string().url().nullable(),
    canceled: z.optional(z.boolean()).default(false),
  });

export const locationSchema = z.object({
    title: z.string(),
    address: z.string(),
    address2: z.string().nullable(),
    city: z.string(),
    state: z.string().length(2),
    stateLong: z.string(),
    zipcode: z.string().length(5),
    mapUrl: z.string().url(),
    website: z.string().url().nullable(),
    facebook: z.string().url().nullable(),
    instagram: z.string().url().nullable(),
});

export const eventSchema = z.object({
    title: z.string(),
    archive: z.boolean(),
    year: z.number().int().gte(2022),
    image: z.string().startsWith("/"),
    startDatetime: z.string().datetime().nullable(),
    endDatetime: z.string().datetime().nullable(),
    location: reference('locations'),
    facebookEvent: z.string().url().nullable(),
    ticketsUrl: z.optional(z.string().url().nullable()),
    ticketPrice: z.optional(z.string().nullable()),
    ticketDescription: z.optional(z.string().nullable()),
    spotifyPlaylist: z.optional(z.string().url().nullable()),
    bands: z.array(reference('performers')),
    djs: z.array(reference('performers')),
    performances: z.array(reference('performers')),
});

export const sponsorSchema = z.object({
  name: z.string(),
  _type: z.enum(["sponsor"]),
  image: z.string().startsWith("/").nullable(),
  description: z.string(),
  links: z.object({
    official: z.optional(z.string().url().nullable()),
    facebook: z.optional(z.string().url().nullable()),
    instagram: z.optional(z.string().url().nullable()),
    twitter: z.optional(z.string().url().nullable()),
  }),
});

export const vendorsSchema = z.object({
  name: z.string(),
  _type: z.enum(["vendor"]),
  image: z.string().startsWith("/").nullable(),
  description: z.string().nullable(),
  links: z.object({
    official: z.optional(z.string().url().nullable()),
    facebook: z.optional(z.string().url().nullable()),
    instagram: z.optional(z.string().url().nullable()),
    twitter: z.optional(z.string().url().nullable()),
  }),
});