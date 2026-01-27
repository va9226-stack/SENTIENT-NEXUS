'use server';

import { 
  generateEntityResponse, 
  GenerateEntityResponseInput 
} from '@/ai/flows/generate-entity-response';
import { 
  iterativeLearningForEntity,
  IterativeLearningForEntityInput,
} from '@/ai/flows/iterative-learning-for-entity';
import type { Learning } from './types';

export async function generateEntityResponseAction(
  input: GenerateEntityResponseInput
): Promise<string> {
  try {
    const response = await generateEntityResponse(input);
    return response;
  } catch (error) {
    console.error('Error in generateEntityResponseAction:', error);
    return `[SYSTEM: Analysis failed. Error: ${error instanceof Error ? error.message : 'Unknown error'}]`;
  }
}

export async function recordLearningAction(
  input: IterativeLearningForEntityInput
): Promise<{ success: boolean; message: string }> {
  try {
    const result = await iterativeLearningForEntity(input);
    return { success: result.learningStored, message: result.message };
  } catch (error) {
    console.error('Error in recordLearningAction:', error);
    return { success: false, message: 'Failed to record learning.' };
  }
}

export async function getLearningsAction(entityId: string): Promise<Learning[]> {
  // This is a mock implementation. In a real app, you'd fetch this from a database.
  console.log(`Fetching learnings for entity ${entityId}`);
  return [
    {
      id: 'learn-1',
      entity_id: entityId,
      entity_name: 'OBSERVER',
      learning_type: 'ANALYTICAL_INSIGHT',
      content: 'Analyzed: "market trends"',
      context: 'Projected a 15% increase in sector growth.',
      source: 'OBSERVER_ANALYSIS',
      confidence_score: 0.92,
      usage_count: 5,
      success_rate: 0.9,
    },
    {
      id: 'learn-2',
      entity_id: entityId,
      entity_name: 'OBSERVER',
      learning_type: 'USER_FEEDBACK',
      content: 'Received POSITIVE feedback on response',
      context: 'What is the capital of France?',
      source: 'OBSERVER_INTERFACE',
      confidence_score: 0.9,
      usage_count: 12,
      success_rate: 1,
    },
  ];
}
