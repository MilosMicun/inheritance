const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Day 44 — Inheritance (safe to extend via hooks)", function () {

  it("BaseVault: deposit updates totalDeposits and emits event", async function () {
    const [alice] = await ethers.getSigners();

    const BaseVault = await ethers.getContractFactory("BaseVault");
    const vault = await BaseVault.deploy();

    const amount = ethers.parseEther("1");

    await expect(
      vault.connect(alice).deposit({ value: amount })
    )
      .to.emit(vault, "Deposit")
      .withArgs(alice.address, amount);

    expect(await vault.totalDeposits()).to.equal(amount);
    expect(await vault.invariantHolds()).to.equal(true);
  });


  it("PointsVault: deposit also awards points via _afterDeposit hook", async function () {
    const [alice] = await ethers.getSigners();

    const PointsVault = await ethers.getContractFactory("PointsVault");
    const vault = await PointsVault.deploy();

    const amount = ethers.parseEther("1");
    await vault.connect(alice).deposit({ value: amount });

    // earned = amount / 1e15 => 1 ETH / 0.001 ETH = 1000
    expect(await vault.points(alice.address)).to.equal(1000n);
    expect(await vault.invariantHolds()).to.equal(true);
  });


  it("Edge case: ETH can be force-sent, breaking invariant", async function () {
    const [deployer] = await ethers.getSigners();

    const BaseVault = await ethers.getContractFactory("BaseVault");
    const vault = await BaseVault.deploy();

    // normal deposit
    const amount = ethers.parseEther("1");
    await vault.deposit({ value: amount });

    expect(await vault.invariantHolds()).to.equal(true);

    // deploy attacker with 1 ETH
    const ForceSend = await ethers.getContractFactory("ForceSend");
    const bomber = await ForceSend.deploy({
      value: ethers.parseEther("1")
    });

    // selfdestruct -> sends ETH without calling deposit()
    await bomber.boom(await vault.getAddress());

    // invariant breaks because balance increased
    // but totalDeposits did not
    expect(await vault.invariantHolds()).to.equal(false);
  });

});