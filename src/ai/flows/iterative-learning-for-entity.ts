// src/ai/flows/iterative-learning-for-entity.ts
'use server';

/**
 * @fileOverview An AI agent for storing interaction patterns and user feedback to enable iterative learning for an entity.
 *
 * - iterativeLearningForEntity - A function that handles the iterative learning process for an entity.
 * - IterativeLearningForEntityInput - The input type for the iterativeLearningForEntity function.
 * - IterativeLearningForEntityOutput - The return type for the iterativeLearningForEntity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IterativeLearningForEntityInputSchema = z.object({
  entityId: z.string().describe('The ID of the entity.'),
  entityName: z.string().describe('The name of the entity.'),
  userInput: z.string().describe('The user input or query.'),
  response: z.string().describe('The LLM-generated response.'),
  isSuccessful: z.boolean().describe('Indicates whether the response was successful or not based on user feedback.'),
  learningType: z.string().describe('The type of learning (e.g., INTERACTION_PATTERN, USER_FEEDBACK).'),
});
export type IterativeLearningForEntityInput = z.infer<typeof IterativeLearningForEntityInputSchema>;

const IterativeLearningForEntityOutputSchema = z.object({
  learningStored: z.boolean().describe('Indicates whether the learning was successfully stored.'),
  message: z.string().describe('A message indicating the outcome of the learning process.'),
});
export type IterativeLearningForEntityOutput = z.infer<typeof IterativeLearningForEntityOutputSchema>;

export async function iterativeLearningForEntity(input: IterativeLearningForEntityInput): Promise<IterativeLearningForEntityOutput> {
  return iterativeLearningForEntityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'iterativeLearningForEntityPrompt',
  input: {schema: IterativeLearningForEntityInputSchema},
  output: {schema: IterativeLearningForEntityOutputSchema},
  prompt: `You are an AI assistant that stores learning information about an entity based on user interactions and feedback.

  Entity ID: {{{entityId}}}
  Entity Name: {{{entityName}}}
  User Input: {{{userInput}}}
  Response: {{{response}}}
  Is Successful: {{{isSuccessful}}}
  Learning Type: {{{learningType}}}

  Determine whether the learning information was stored successfully and provide a message indicating the outcome.
  Return a JSON object with the "learningStored" boolean and a descriptive "message".`,
});

const iterativeLearningForEntityFlow = ai.defineFlow(
  {
    name: 'iterativeLearningForEntityFlow',
    inputSchema: IterativeLearningForEntityInputSchema,
    outputSchema: IterativeLearningForEntityOutputSchema,
  },
  async input => {
    try {
      // Simulate storing the learning information (replace with actual storage logic)
      // In a real implementation, you would store the learning information in a database or other storage system
      // based on the input parameters.
      console.log(
        `Storing learning information for entity ${input.entityName} (ID: ${input.entityId}):`,{
          userInput: input.userInput,
          response: input.response,
          isSuccessful: input.isSuccessful,
          learningType: input.learningType,
        }
      );

      // Simulate a successful storage operation
      const learningStored = true;
      const message = `Learning information stored successfully for entity ${input.entityName}.`;

      // Return the output object
      return {learningStored, message};
    } catch (error: any) {
      // Handle any errors that occur during the storage process
      console.error('Error storing learning information:', error);
      return {
        learningStored: false,
        message: `Error storing learning information for entity ${input.entityName}: ${error.message || 'Unknown error'}`,
      };
    }
  }
);
