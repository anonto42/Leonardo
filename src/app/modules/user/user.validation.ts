import { z } from 'zod';
import { GENDER } from '../../../enums/user';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    contact: z.string({ required_error: 'Contact is required' }),
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }),
    image: z.any().optional(),
  }),
});

const updateUserZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    age: z.coerce.number().optional(),
    gender: z.enum([GENDER.FEMALE,GENDER.MALE,GENDER.OTHER], {
      errorMap: () => ({ message: "Gender must be MALE, FEMALE, or OTHER" }),
    }).optional(),
    contact: z.string().optional(),
    occupation: z.string().optional(),
    nationality:  z.string().optional(),
    personality: z.string().optional(),
    image: z.string().optional(),
  }).strict()
});

const deleteUserZodSchema = z.object({
  body: z.object({
    password: z.string({ required_error: "You must give the user password to delete the user!"}),
  }).strict()
});


export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
  deleteUserZodSchema
};
