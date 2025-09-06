import { z } from 'zod';

const allUsersZodSchema = z.object({
  query: z.object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
  }).strict(),
  body: z.object({}).strict().optional(),
  params: z.object({}).strict().optional(),
})

const getUserZodSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'User id is required',
    }),
  }).strict(),
  query: z.object({}).strict().optional(),
  body: z.object({}).strict().optional(),
})

const updateUserStatusZodSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'User id is required',
    }),
  }).strict(),
  query: z.object({}).strict().optional(),
  body: z.object({
    status: z.enum(['ACTIVE', 'BLOCKED', 'SUSPENDED']).optional(),
  }).strict().optional(),
})

const createConditionStatusZodSchema = z.object({
  params: z.object({}).strict(),
  query: z.object({}).strict().optional(),
  body: z.object({
    data: z.string({ required_error: "You must give the data!"})
  }).strict().optional(),
})

export const AdminValidation = {
  allUsersZodSchema,
  getUserZodSchema,
  updateUserStatusZodSchema,
  createConditionStatusZodSchema
};