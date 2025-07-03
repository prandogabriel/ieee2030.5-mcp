I need you to write comprehensive tests for the file $ARGUMENTS

When writing tests (unit, integration, or property-based), follow these principles:

- **Coverage**: Ensure all public functions, methods, and edge cases are tested. Cover both typical and boundary scenarios.
- **Clarity**: Write tests that are easy to read and understand. Use descriptive test names and clear assertions.
- **Isolation**: Each test should be independent. Use mocks, stubs, or fixtures to isolate dependencies and side effects.
- **Maintainability**: Organize tests logically (by module, feature, or behavior). Use helper functions or fixtures to reduce duplication.
- **Idiomatic Style**: Follow the testing conventions of the language and framework (e.g., `#[test]` in Rust, `describe/it` in JavaScript/TypeScript).
- **Documentation**: Add comments to explain the intent of complex tests or non-obvious scenarios.
- **Performance**: Keep tests fast. Avoid unnecessary setup or teardown. Use parallel execution if supported.
- **Preservation**: Do not remove or alter any existing tests unless explicitly instructed. All current test coverage must be preserved and extended.

**Process:**
1. Analyze the file and identify all functions, methods, and behaviors that require testing.
2. Propose a test plan, listing the scenarios and edge cases to be covered.
3. Suggest the structure and organization of the test file(s).
4. Ask clarifying questions if requirements or intent are unclear.
5. Only proceed with writing tests after confirming the plan and structure.

**Remember:**
- Always think like a senior engineer: robust, maintainable, and meaningful tests are the goal.
- Never remove or weaken existing tests unless explicitly told to do so.
- If the code is hard to test, recommend and implement refactoring for better testability. 