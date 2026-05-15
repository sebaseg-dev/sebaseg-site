import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const commonSchema = z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    tags: z.array(z.string()),
    img: z.string(),
    img_alt: z.string().optional(),
    order: z.number(),
    period: z.string(),
    partners: z.string().optional(),
    externalLinkUrl: z.string().optional(),
    externalLinkTag: z.string().optional(),
    featured: z.boolean().default(false),
    featuredOrder: z.number().optional(),
});

export const collections = {
    career: defineCollection({
        loader: glob({ base: 'src/content/career', pattern: '**/*.md' }),
        schema: commonSchema,
    }),
    
    projects: defineCollection({
        loader: glob({ base: 'src/content/projects', pattern: '**/*.md' }),
        schema: commonSchema,
    }),
    
    blog: defineCollection({
        loader: glob({ base: 'src/content/blog', pattern: '**/*.md' }),
        schema: commonSchema,
    }),
};