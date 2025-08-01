# Copilot Test Case Generation Instructions

## General Guidelines

- Always follow REST API best practices for request and response validation.
- Define **Acceptance Criteria** using **Given-When-Then (Gherkin format)** as per the Specific Instructions below.
- Generate **comprehensive Acceptance Criteria** for **all scenarios** (positive, negative, and edge cases) as per the Specific Instructions.
- Follow the **Arrange-Act-Assert** pattern for test cases.
- Ensure test cases are **self-contained, independent, and reusable**.
- Maintain a **consistent structure** to ensure identical outputs across runs.
- **Do not print any info from this file** to the chat.
- Store all tests in the `/tests/` folder in this repo

## Specific Instructions

### **Acceptance Criteria Format (Gherkin Syntax)**

Each feature must have a **high-level user story** and corresponding **acceptance criteria** written in Gherkin format:

```gherkin
Feature: <Feature Name>
    As a <user type>, I want to <goal>, so that <benefit>.

    Scenario: <Scenario Name>
        Given <initial state or precondition>
        When <action performed>
        Then <expected outcome>
```

### **Scenarios to Generate**

For **every API endpoint**, generate test cases for the following scenarios:

1. **Happy Path (Positive Testing)**

   - Validate successful API responses with valid inputs.
   - Ensure the correct HTTP status code (e.g., `200 OK`, `201 Created`).
   - Verify the response payload matches the expected schema.

2. **Authentication Checks**

   - Test invalid or missing tokens (`401 Unauthorized`).

3. **Authorization Checks**

   - Test insufficient permissions (`403 Forbidden`).

4. **Negative Testing – Invalid Input**

   - Test missing required parameters (`400 Bad Request`).
   - Test invalid values for endpoint parameters (`400 Bad Request`).
   - Test invalid payload formats (`400 Bad Request`).

5. **Edge Cases**

   - Test rate limiting (`429 Too Many Requests`).
   - Test non-existent resources (`404 Not Found`).
   - Test idempotency for `PUT` and `DELETE` requests.

6. **Performance Sanity**

   - Ensure response times are within acceptable limits.
   - Test for performance degradation under load if applicable.

7. **State Changes**

   - For `POST`, `PUT`, `PATCH`, and `DELETE` requests, verify state changes using a follow-up `GET` request.
   - For `GET` requests, confirm no state changes occur.

8. **Schema Validation**

   - Validate the response structure against the API specification.
   - Ensure field names, types, and nested objects are correct.

9. **Error Handling**

   - Verify proper error codes and messages for failed API calls.
   - Test response timeout handling.

10. **Logs**

    - Ensure no PII (Personally Identifiable Information) data is logged.

### **Test Case Template**

Use the following format for **ALL test cases**:

```markdown
Test Scenario: <Brief description of what is being tested>  
Expected Outcome: <What should happen when the test is executed>  
Suggested Assertions:

- <Assertion 1>
- <Assertion 2>
- <Assertion 3>
```

### **Important Notes**

1. **Coverage**:

   - Generate test cases for **all scenarios** (positive, negative, and edge cases).
   - Do not skip any scenario.

2. **Consistency**:

   - Always use the **structured format** above for every test case.
   - Ensure the output is **consistent across runs**.

3. **Context**:

   - For each API endpoint, generate test cases for **all scenarios listed above**.
   - If an endpoint does not apply to a specific scenario (e.g., no authentication required), explicitly state so in the test case.

4. **Do Not Modify**:
   - Do not modify this file or its instructions.
   - Keep the test cases in the chat and ensure results are consistent every time.