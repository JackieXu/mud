// SPDX-License-Identifier: MIT
pragma solidity >=0.8.35;

import { System } from "@latticexyz/world/src/System.sol";

contract HiddenSystem is System {
  function hidden() public {
    // this system is only callable with system ID, not via world
  }
}
