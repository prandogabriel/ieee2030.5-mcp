# IEEE 2030.5 MCP Development Guide

## Repository Structure and Navigation

The repository is organized into several key directories:

- `/src` - Main source code directory, containing:
  - `/prompts/*` - Prompts are reusable templates that help LLMs interact with your server effectively
  - `/resources/*` - Resources are how you expose data to LLMs. They're similar to GET endpoints in a REST API - they provide data but shouldn't perform significant computation or have side effects
  - `/tools/*` - Tools let LLMs take actions through your server. Unlike resources, tools are expected to perform computation and have side effects.
  - `/server.ts` - Utility modules for various functionalities (e.g., HTTP client, controller, inverter, load, metering, program, request, transformer)
  - `/services/*` Folder with utils to handle resources, tools and prompts 

**Navigation Tips:**

- When exploring a new feature, first identify which app or lib it belongs to
- Related code is typically co-located within the same directory
- Check existing implementations before creating new ones

## Coding Standards Reference

**IMPORTANT: I must ALWAYS read the full coding standards at the beginning of EACH session using this command:**

```bash
cat .cursor/rules/*
```

The rules in `.cursor/rules/*` contain detailed guidelines for:

- Git commit conventions
- Rust coding style (type system, async patterns, function arguments, etc.)
- Documentation practices (structure, links, error documentation, etc.)
- Error handling with error-stack
- Testing strategy and assertions
- Tracing and instrumentation

These full guidelines contain critical nuances and details that cannot be summarized. Reading the complete rules is essential for ensuring code quality and consistency.

## Documentation Best Practices

When documenting Rust code, follow these guidelines:

1. **Function Documentation Structure**:
   - Begin with a clear, single-line summary of what the function does
   - Include a detailed description of the function's behavior
   - For simple functions (0-2 parameters), describe parameters inline in the main description
   - For complex functions (3+ parameters), use an explicit "# Arguments" section with bullet points
   - Always describe return values in the main description text, not in a separate section
   - Document error conditions with an explicit "# Errors" section

2. **Type Documentation**:
   - Begin with a clear, single-line summary of what the type represents
   - Explain the type's purpose, invariants, and usage patterns
   - Document struct fields with field-level doc comments
   - Document enum variants clearly

3. **Examples**:
   - Include practical examples for public APIs
   - Ensure examples compile and demonstrate typical usage patterns
   - For complex types/functions, show multiple usage scenarios

This balanced approach maintains readability while providing necessary structure for complex APIs.

## Common Commands

### Starting Services

- pnpm dev to start development server

### Linting and Fixing

- Build: `pnpm build`
- Code format: `pnpm lint`

### For Specific Packages

When working on a specific package, use:

# PR Review Guide

When reviewing a Pull Request, follow these steps to provide comprehensive feedback:

## 1. Initial Information Gathering

Always collect the following information first:

- PR content (description, title, etc.)
- Diff changes (show ALL the changes – don't pipe them into head. Don't use --name-only)
- Existing comments and conversation

Use the following commands:

**1a. View PR metadata, description, general comments and changed files**

```bash
gh pr view <PR_NUMBER> --comments
gh pr diff <PR_NUMBER>
```

**1b. View comments on the diff**

```bash
gh api \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  /repos/OWNER/REPO/pulls/PULL_NUMBER/comments
```

## 2. Check Referenced Linear Issues

- Look for Linear issue references in the PR title or description (format: H-XXXX)
- Fetch each referenced Linear issue to understand the original requirements
- Use these requirements as the baseline for your review

```bash
# Example of fetching a Linear issue
mcp__linear__get_issue --issueId "H-XXXX"
```

## 3. Provide Code Quality Feedback

- Be precise about the location and nature of issues
- Include suggestions for improvement when possible
- Reference relevant code standards from the repository