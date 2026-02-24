# Day 44 — Solidity Inheritance (Protocol-Safe Design)

This project demonstrates **safe-to-extend inheritance** in Solidity.

Instead of making public functions `virtual`, we lock core state transitions
and expose controlled extension points via internal hooks.

---

## Architecture

### BaseVault

- `deposit()` is **NOT virtual**
- Extension allowed only via:
  - `_beforeDeposit()`
  - `_afterDeposit()`

Invariant:

address(this).balance == totalDeposits


The state transition is fixed:
1. Before hook
2. Accounting update
3. Event emission
4. After hook

This prevents child contracts from:
- breaking accounting
- changing state transition order
- introducing unsafe interactions

---

### PointsVault

Overrides `_afterDeposit()` to award points.

Core accounting remains untouched.

---

## Key Concepts

- Storage linearization in inheritance
- Explicit `virtual` / `override`
- Hook pattern vs overriding public functions
- Invariant protection
- Reduced attack surface

---

## Tests

- Verifies deposit event
- Verifies accounting update
- Verifies hook-based extension

Includes force-send edge case (selfdestruct) proving that ETH can bypass public state transitions and break naive invariants.

Run:

```bash
npx hardhat test