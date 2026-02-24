const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Day 44 — Inheritance (safe to extend via hooks)", function () {
  it("BaseVault: deposit updates totalDeposits and emits event", async function () {
    const [alice] = await ethers.getSigners();
    const BaseVault = await ethers.getContractFactory("BaseVault");
    const vault = await BaseVault.deploy();

    const amount = ethers.parseEther("1");

    await expect(vault.connect(alice).deposit({ value: amount }))
      .to.emit(vault, "Deposit")
      .withArgs(alice.address, amount);

    expect(await vault.totalDeposits()).to.equal(amount);
  });

  it("PointsVault: deposit also awards points via _afterDeposit hook", async function () {
    const [alice] = await ethers.getSigners();
    const PointsVault = await ethers.getContractFactory("PointsVault");
    const vault = await PointsVault.deploy();

    const amount = ethers.parseEther("1");
    await vault.connect(alice).deposit({ value: amount });

    expect(await vault.points(alice.address)).to.equal(1000n);
  });
});