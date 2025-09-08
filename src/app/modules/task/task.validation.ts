import { z } from 'zod';

const createTaskZodSchema = z.object({
  body: z.object({
    taskName: z.string({ required_error: 'Give the name of your task' }),
    category: z.string({ required_error: 'You must give the category of your task'}),
    selectDate: z.coerce.date({ required_error: 'You must give the selected data'}),
    selectTime: z.coerce.date({ required_error: 'You must give the selected date'}),
    taskWillEnd: z.coerce.date({ required_error: 'You should give the endtime that can we update the task status'}),
    watchTime: z.coerce.number({ required_error: 'You must give your watch time on number like this [ 12 || 23 || 60 ] '}),
  }).strict(),
});

const getTaskZodSchema = z.object({
  query: z.object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional()
  }).strict(),
});

const deleteTaskZod = z.object({
  params: z.object({
    id: z.string().optional()
  }).strict(),
});

export const TaskValidation = {
  createTaskZodSchema, getTaskZodSchema, deleteTaskZod
};