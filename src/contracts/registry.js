// Single source of truth for every deployed contract this app talks to.
// Addresses are UNCHANGED from the working baseline — do not edit without
// verifying against a fresh deployment.

import { IDENTITY_ABI } from './abis/identity'
import { REPUTATION_ABI } from './abis/reputation'
import { VALIDATION_ABI } from './abis/validation'
import { ERC20_ABI } from './abis/erc20'

export const CONTRACTS = {
  IDENTITY_REGISTRY: {
    address: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
    abi: IDENTITY_ABI,
    label: 'Identity Registry',
  },
  REPUTATION_REGISTRY: {
    address: '0x8004B663056A597Dffe9eCcC1965A193B7388713',
    abi: REPUTATION_ABI,
    label: 'Reputation Registry',
  },
  VALIDATION_REGISTRY: {
    address: '0x8004Cb1BF31DAf7788923b405b754f57acEB4272',
    abi: VALIDATION_ABI,
    label: 'Validation Registry',
  },
  ANV_TOKEN: {
    address: '0x736223037D622ed365fa641a116daAcED7A5be96',
    abi: ERC20_ABI,
    label: 'ANV Token',
  },
}

export const DEFAULT_VALIDATOR = '0xb3CF6b5a6aa8ED4E1309Fd0631DEB6cB06B7AFcA'
