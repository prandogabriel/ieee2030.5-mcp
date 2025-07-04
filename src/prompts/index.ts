// Export all prompt-related functionality

import type { Prompt } from '@modelcontextprotocol/sdk/types.js';
import {
  getNavigationGuideHandler,
  ieee2030NavigationPrompt,
} from './ieee2030-navigation-guide.js';

export type PromptName = 'ieee2030_navigation_guide';

export type PromptHandler = () => Promise<{ content: Array<{ type: 'text'; text: string }> }>;

export type PromptRegistry = Record<PromptName, PromptHandler>;

/**
 * Creates the complete prompt registry with all IEEE 2030.5 prompts
 */
export const createPromptRegistry = (): PromptRegistry => {
  return {
    ieee2030_navigation_guide: getNavigationGuideHandler(),
  };
};

/**
 * Gets the list of available prompts
 */
export const getAvailablePrompts = (): Prompt[] => {
  return [ieee2030NavigationPrompt];
};

export {
  getNavigationGuideHandler,
  ieee2030NavigationPrompt,
} from './ieee2030-navigation-guide.js';
