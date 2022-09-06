import { APP_ENVIRONMENTS, getAppEnvString } from '@pooltogether/hooks'
import { NETWORK } from '@pooltogether/utilities'

export const useSupportedNetworks = () => {
  const appEnv = getAppEnvString()
  return appEnv === APP_ENVIRONMENTS.mainnets
    ? [NETWORK.mainnet, NETWORK.polygon]
    : [NETWORK.rinkeby]
}
