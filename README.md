# Day 44 — Solidity Inheritance (Safe to Extend)

This repo demonstrates **protocol-grade inheritance** in Solidity:  
**final public state transition + internal virtual hooks**.

## Goal

Show how to design inheritance that is:
- extensible
- but **invariant-safe**
- and predictable under dispatch (`override`)

## Architecture

### BaseVault (final public API)
- `deposit()` is **NOT virtual**
- extension is allowed only through hooks:
  - `_beforeDeposit(from, amount)`
  - `_afterDeposit(from, amount)`

This prevents child contracts from accidentally changing:
- state transition order
- event emission
- core accounting invariants

### PointsVault (safe extension)
Overrides `_afterDeposit` to award points:
- core deposit accounting remains unchanged
- extension logic is isolated and testable

## Key Concepts

- Inheritance linearizes storage: base vars first, then child vars
- `virtual/override` is explicit to avoid accidental dispatch bugs
- Hooks reduce attack surface vs overriding `deposit()`

## Tests

- verifies `Deposit` event emission
- verifies `totalDeposits` accounting
- verifies PointsVault hook effect (`points`)

Run:
```bash
npx hardhat test