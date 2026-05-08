# Testing Examples

This folder contains simple examples for:

- Unit testing
- E2E manual testing
- E2E automated testing
- `F.I.R.S.T` principles
- `AAA` pattern
- Mock usage

## Unit test example

- Code: `testing-examples/src/checkout-total.ts`
- Test: `testing-examples/unit/checkout-total.test.ts`

Pattern used in tests:

1. **Arrange** test data and mock objects.
2. **Act** by calling the function.
3. **Assert** expected result.

Mock is used via `vi.fn()` to isolate business logic from external dependencies.

## E2E examples

- Manual checklist: `testing-examples/e2e/manual/checklist.md`
- Automated sample: `testing-examples/e2e/automated/homepage.smoke.spec.ts`

## Commands

```bash
npm run test:unit
npm run test:unit:watch
npm run test:e2e
```

If Playwright browsers are not installed yet:

```bash
npx playwright install
```
