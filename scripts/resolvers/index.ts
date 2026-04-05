/**
 * RESOLVERS record — maps {{PLACEHOLDER}} names to generator functions.
 * Each resolver takes a TemplateContext and returns the replacement string.
 */

import type { TemplateContext, ResolverFn } from './types';

// Core modules
import { generatePreamble, generateTestFailureTriage } from './preamble';
import { generateLearningsSearch, generateLearningsLog } from './learnings';

// Marketing-specific modules
import { resolveBrandContext } from './brand';
import { resolveBrowseOptional } from './browse-optional';
import { resolveApiKeys } from './api-keys';

export const RESOLVERS: Record<string, ResolverFn> = {
  PREAMBLE: generatePreamble,
  TEST_FAILURE_TRIAGE: generateTestFailureTriage,
  BRAND_CONTEXT: resolveBrandContext,
  BROWSE_OPTIONAL: resolveBrowseOptional,
  API_KEYS: resolveApiKeys,
  LEARNINGS_SEARCH: generateLearningsSearch,
  OPERATIONAL_LEARNING: generateLearningsLog,
  TELEMETRY: generatePreamble,
};
