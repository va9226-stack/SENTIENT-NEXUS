'use server';
/**
 * @fileOverview An AI agent for contextual analysis of user input to improve response relevance and accuracy.
 *
 * - contextualAnalysisForResponses - A function that handles the contextual analysis process.
 * - ContextualAnalysisForResponsesInput - The input type for the contextualAnalysisForResponses function.
 * - ContextualAnalysisForResponsesOutput - The return type for the contextualAnalysisForResponses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContextualAnalysisForResponsesInputSchema = z.object({
  userInput: z.string().describe('The user input to be analyzed.'),
  entityProperties: z.string().describe('The properties of the entity providing the response.'),
  learnedKnowledge: z.string().describe('The learned knowledge of the entity.'),
});
export type ContextualAnalysisForResponsesInput = z.infer<typeof ContextualAnalysisForResponsesInputSchema>;

const ContextualAnalysisForResponsesOutputSchema = z.object({
  analysis: z.string().describe('The contextual analysis of the user input.'),
});
export type ContextualAnalysisForResponsesOutput = z.infer<typeof ContextualAnalysisForResponsesOutputSchema>;

export async function contextualAnalysisForResponses(input: ContextualAnalysisForResponsesInput): Promise<ContextualAnalysisForResponsesOutput> {
  return contextualAnalysisForResponsesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contextualAnalysisForResponsesPrompt',
  input: {schema: ContextualAnalysisForResponsesInputSchema},
  output: {schema: ContextualAnalysisForResponsesOutputSchema},
  prompt: `You are an AI assistant designed to provide contextual analysis of user input.

You will analyze the user input in the context of the entity properties and learned knowledge to provide a contextual analysis that can be used to generate more relevant and accurate responses.

User Input: {{{userInput}}}
Entity Properties: {{{entityProperties}}}
Learned Knowledge: {{{learnedKnowledge}}}

Provide a detailed contextual analysis of the user input. Focus on identifying the intent of the user and determine the scope of the user's question. Also consider the user input in the context of the available entity properties and learned knowledge.
`,
});

const contextualAnalysisForResponsesFlow = ai.defineFlow(
  {
    name: 'contextualAnalysisForResponsesFlow',
    inputSchema: ContextualAnalysisForResponsesInputSchema,
    outputSchema: ContextualAnalysisForResponsesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
