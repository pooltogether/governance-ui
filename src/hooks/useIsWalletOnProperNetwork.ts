import { useGovernanceChainId } from '@pooltogether/hooks'
import { useWalletChainId } from '@pooltogether/wallet-connection'

/**
 * Checks if the connected wallet is on the proper network for the current
 * app environment. Used to disable buttons when the user is on the wrong network
 * @returns boolean
 */
export const useIsWalletOnProperNetwork = () => {
  const expectedChainId = useGovernanceChainId()
  const walletChainId = useWalletChainId()
  return Boolean(walletChainId) && walletChainId === expectedChainId
}
