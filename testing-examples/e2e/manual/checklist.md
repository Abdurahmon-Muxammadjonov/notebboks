# E2E Manual Checklist

## Scenario: User opens shop and browses products

1. Open `http://localhost:3000`.
2. Confirm top navigation is visible.
3. Click `Products` in navbar.
4. Confirm product cards are listed.
5. Click one product card.
6. Confirm product detail page opens.
7. Click `Add to cart`.
8. Open cart page.
9. Confirm selected product appears in cart.
10. Confirm quantity and price are visible.

## F.I.R.S.T reminder for test design

- **F - Fast**: Keep scenarios short and focused.
- **I - Isolation**: Validate one user flow per scenario.
- **R - Re-produce**: Same data and steps every run.
- **S - Self validating**: Expected result must be clear.
- **T - Thorough**: Cover happy path and key edge path.
