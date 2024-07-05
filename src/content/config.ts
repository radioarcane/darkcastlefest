import { defineCollection } from 'astro:content';
import { performerSchema, eventSchema, locationSchema, sponsorSchema, vendorsSchema } from '../schemas';

const performers = defineCollection({
  type: 'content',
  schema: performerSchema
});

const locations = defineCollection({
  type: 'content',
  schema: locationSchema
});

const events = defineCollection({
  type: 'content',
  schema: eventSchema
});

const sponsors = defineCollection({
  type: 'content',
  schema: sponsorSchema
});

const vendors = defineCollection({
  type: 'content',
  schema: vendorsSchema
});

export const collections = {
  events, performers, locations, sponsors, vendors
};