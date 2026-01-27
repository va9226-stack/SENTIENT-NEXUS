'use client';

import {
  generateEntityResponseAction,
  recordLearningAction,
  getLearningsAction
} from '@/lib/actions';
import type { Learning } from '@/lib/types';

type InvokeLLMInput = {
  prompt: string;
};

type CreateLearningInput = {
  entity_id: string;
  entity_name: string;
  learning_type: 'INTERACTION_PATTERN' | 'USER_FEEDBACK' | 'ANALYTICAL_INSIGHT';
  content: string;
  context: string;
  source: 'USER_INTERACTION' | 'OBSERVER_INTERFACE' | 'OBSERVER_ANALYSIS';
  confidence_score: number;
  usage_count: number;
  success_rate: number;
};

type FilterLearningInput = {
  entity_id: string;
  is_active?: boolean;
};

// This is a client-side mock that calls server actions
export const base44 = {
  integrations: {
    Core: {
      InvokeLLM: async ({ prompt }: InvokeLLMInput): Promise<string> => {
        // This is a simplified mapping. A more complex app would deconstruct the prompt
        // to fit the GenerateEntityResponseInput schema.
        const entityNameMatch = prompt.match(/You are ([\w\s]+),/);
        const entityName = entityNameMatch ? entityNameMatch[1].trim() : "Unknown Entity";

        const userInputMatch = prompt.match(/User observation\/query: (.*)\n/s);
        const userInput = userInputMatch ? userInputMatch[1].trim() : "No user input";
        
        const learningContextMatch = prompt.match(/Learned Knowledge:\n(.*)\n\nUser observation/s);
        const learningContext = learningContextMatch ? learningContextMatch[1] : '';


        return generateEntityResponseAction({
          entityName: entityName,
          entityRole: "Assistant", // Simplified
          entityOntology: "SENTIENCE_ENTITY", // Simplified
          entityCapabilities: "General analysis", // Simplified
          entityConstraints: "No special constraints", // Simplified
          entityStatus: "ACTIVE", // Simplified
          learningContext: learningContext,
          userInput: userInput
        });
      },
    },
  },
  entities: {
    EntityLearning: {
      create: async (input: CreateLearningInput): Promise<void> => {
        const isSuccessful = input.success_rate > 0.5;

        await recordLearningAction({
          entityId: input.entity_id,
          entityName: input.entity_name,
          userInput: input.context, // Mapping context to userInput for the flow
          response: input.content, // Mapping content to response for the flow
          isSuccessful: isSuccessful,
          learningType: input.learning_type,
        });
      },
      filter: async (input: FilterLearningInput): Promise<Learning[]> => {
        return getLearningsAction(input.entity_id);
      },
    },
  },
};
