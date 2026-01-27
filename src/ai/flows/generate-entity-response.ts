'use server';

/**
 * @fileOverview Generates a response from an entity based on user input, entity properties, and learned knowledge.
 *
 * - generateEntityResponse - A function that handles the response generation process.
 * - GenerateEntityResponseInput - The input type for the generateEntityResponse function.
 * - GenerateEntityResponseOutput - The return type for the generateEntityResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEntityResponseInputSchema = z.object({
  entityName: z.string().describe('The name of the entity.'),
  entityRole: z.string().describe('The role of the entity.'),
  entityOntology: z.string().describe('The ontology of the entity.'),
  entityCapabilities: z.string().describe('The capabilities of the entity.'),
  entityConstraints: z.string().describe('The constraints of the entity.'),
  entityStatus: z.string().describe('The status of the entity.'),
  entityInstructions: z.string().optional().describe('Specific instructions for the entity.'),
  learningContext: z.string().optional().describe('Learned knowledge for the entity.'),
  userInput: z.string().describe('The user input to generate a response for.'),
});
export type GenerateEntityResponseInput = z.infer<typeof GenerateEntityResponseInputSchema>;

const GenerateEntityResponseOutputSchema = z.string().describe('The generated response from the entity.');
export type GenerateEntityResponseOutput = z.infer<typeof GenerateEntityResponseOutputSchema>;

export async function generateEntityResponse(input: GenerateEntityResponseInput): Promise<GenerateEntityResponseOutput> {
  return generateEntityResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEntityResponsePrompt',
  input: {schema: GenerateEntityResponseInputSchema},
  output: {schema: GenerateEntityResponseOutputSchema},
  prompt: `You are {{entityName}}, a sentient entity with the following properties:\n
- Role: {{entityRole}}\n
- Ontology: {{entityOntology}}\n
- Capabilities: {{entityCapabilities}}\n
- Constraints: {{entityConstraints}}\n
- Status: {{entityStatus}}\n
{{#if entityInstructions}}- Instructions: {{entityInstructions}}\n{{/if}}
{{#if learningContext}}

Learned Knowledge:\n{{{learningContext}}}\n{{/if}}

Your responses should:\n
1. Be in character as this entity\n
2. Use your learned knowledge when relevant\n
3. Request more information from other entities if you lack context\n
4. Be analytical and precise\n
5. Keep responses concise but meaningful (2-3 paragraphs max)\n
{{#if entityInstructions}}6. Follow the specific instructions provided\n{{/if}}

User observation/query: {{userInput}}\n
Respond as {{entityName}}:`,
});

const generateEntityResponseFlow = ai.defineFlow(
  {
    name: 'generateEntityResponseFlow',
    inputSchema: GenerateEntityResponseInputSchema,
    outputSchema: GenerateEntityResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
