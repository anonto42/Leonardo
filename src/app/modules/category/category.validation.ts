import { z } from 'zod';
import { TCategoryCoinAcction } from '../../../enums/category';

const AllTCategoryCoinAcctionZodSchema = z.object({
  query: z.object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
  }).strict().optional(),
});

const createCategoryZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    action: z.enum([TCategoryCoinAcction.ADD, TCategoryCoinAcction.REMOVE], {
      required_error: 'Action is required',
    }),
    coin: z.coerce.number({
      required_error: 'Coin is required',
    }),
  }).strict(),
});

const updateCategoryZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    action: z.string().optional(),
    coin: z.coerce.number().optional(),
  }),
});

const ACategoryZodSchema = z.object({
  params: z.object({
    id: z.string({ required_error: "Yout must give id to get the category!"})
  }).strict()
});

export const CategoryValidation = {
  AllTCategoryCoinAcctionZodSchema,
  createCategoryZodSchema,
  updateCategoryZodSchema,
  ACategoryZodSchema
};
