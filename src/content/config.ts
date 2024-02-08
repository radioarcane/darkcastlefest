import { defineCollection } from 'astro:content';
import { performerSchema, eventSchema, locationSchema } from '../schemas';

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

export const collections = {
  events, performers, locations,
};