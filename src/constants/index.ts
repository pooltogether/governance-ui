import { APP_ENVIRONMENTS } from '@pooltogether/hooks'
import PoolWithMultipleWinnersBuilderMainnet from '@pooltogether/pooltogether-contracts/deployments/mainnet/PoolWithMultipleWinnersBuilder.json'
import PoolWithMultipleWinnersBuilderRinkeby from '@pooltogether/pooltogether-contracts/deployments/rinkeby/PoolWithMultipleWinnersBuilder.json'
import { NETWORK } from '@pooltogether/utilities'
import { getChain } from '@pooltogether/wallet-connection'

export const RPC_URLS = {
  // Ethereum
  [NETWORK.mainnet]: process.env.NEXT_PUBLIC_ETHEREUM_MAINNET_RPC_URL,
  [NETWORK.rinkeby]: process.env.NEXT_PUBLIC_ETHEREUM_RINKEBY_RPC_URL,
  [NETWORK.ropsten]: process.env.NEXT_PUBLIC_ETHEREUM_ROPSTEN_RPC_URL,
  [NETWORK.kovan]: process.env.NEXT_PUBLIC_ETHEREUM_KOVAN_RPC_URL,
  [NETWORK.goerli]: process.env.NEXT_PUBLIC_ETHEREUM_GOERLI_RPC_URL,
  // Avalanche
  [NETWORK.avalanche]: process.env.NEXT_PUBLIC_AVALANCHE_MAINNET_RPC_URL,
  [NETWORK.fuji]: process.env.NEXT_PUBLIC_AVALANCHE_FUJI_RPC_URL,
  // Polygon
  [NETWORK.polygon]: process.env.NEXT_PUBLIC_POLYGON_MAINNET_RPC_URL,
  [NETWORK.mumbai]: process.env.NEXT_PUBLIC_POLYGON_MUMBAI_RPC_URL,
  // Optimism
  [NETWORK.optimism]: process.env.NEXT_PUBLIC_OPTIMISM_MAINNET_RPC_URL,
  [NETWORK['optimism-goerli']]: process.env.NEXT_PUBLIC_OPTIMISM_GOERLI_RPC_URL,
  // Arbitrum
  [NETWORK.arbitrum]: process.env.NEXT_PUBLIC_ARBITRUM_MAINNET_RPC_URL,
  [NETWORK['arbitrum-goerli']]: process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_RPC_URL,
  // Celo
  [NETWORK.celo]: process.env.NEXT_PUBLIC_CELO_MAINNET_RPC_URL,
  [NETWORK['celo-testnet']]: process.env.NEXT_PUBLIC_CELO_TESTNET_RPC_URL
}

export const SUPPORTED_NETWORKS = Object.freeze({
  [APP_ENVIRONMENTS.mainnets]: Array.from(new Set([NETWORK.mainnet])),
  [APP_ENVIRONMENTS.testnets]: Array.from(new Set([NETWORK.rinkeby]))
})

export const SECONDS_PER_BLOCK = 13

export const SECONDS_PER_WEEK = 604800
export const SECONDS_PER_DAY = 86400
export const SECONDS_PER_HOUR = 3600

export const DEFAULT_TOKEN_PRECISION = 18

export const MAINNET_POLLING_INTERVAL = process.env.NEXT_JS_DOMAIN_NAME ? 22 * 1000 : 16 * 1000

export const MAX_SAFE_INTEGER = 9007199254740991

// cookie names
export const TRANSACTIONS_KEY = 'txs'
export const SHOW_MANAGE_LINKS = 'showManageLinks'
export const MAGIC_EMAIL = 'magicEmail'
export const SELECTED_WALLET_COOKIE_KEY = 'selectedWallet'

// strings
export const CONFETTI_DURATION_MS = 12000

export const DEFAULT_INPUT_CLASSES =
  'w-full text-inverse inline-flex items-center justify-between trans'

const domain = process.env.NEXT_JS_DOMAIN_NAME && `.${process.env.NEXT_JS_DOMAIN_NAME}`
export const COOKIE_OPTIONS = {
  sameSite: 'strict',
  secure: process.env.NEXT_JS_DOMAIN_NAME === 'pooltogether.com',
  domain
}

export const CONTRACT_ADDRESSES = {
  1: {
    GovernorAlpha: '0xB3a87172F555ae2a2AB79Be60B336D2F7D0187f0',
    GovernanceToken: '0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e',
    PrizePoolBuilder: PoolWithMultipleWinnersBuilderMainnet.address,
    GovernanceReserve: '0xdb8E47BEFe4646fCc62BE61EEE5DF350404c124F',
    MerkleDistributor: '0xBE1a33519F586A4c8AA37525163Df8d67997016f',
    PoolPoolTicket: '0x27d22a7648e955e510a40bdb058333e9190d12d4',
    Sablier: '0xCD18eAa163733Da39c232722cBC4E8940b1D8888'

    // GovernorAlpha: '0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F',  // Uniswap Governance for testing
    // GovernanceToken: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984' // Uniswap UNI Token  for testing
  },
  3: {},
  4: {
    GovernorAlpha: '0x9B63243CD27102fbEc9FAf67CA1a858dcC16Ee01',
    GovernanceToken: '0xc4E90a8Dc6CaAb329f08ED3C8abc6b197Cf0F40A',
    MerkleDistributor: '0x5fcD21897939B09eAF9c81eF8C2C4CD64FA75558',
    PrizePoolBuilder: PoolWithMultipleWinnersBuilderRinkeby.address,
    GovernanceReserve: '0xA5224da01a5A792946E4270a02457EB75412c84c'

    // GovernorAlpha: '0x2f8bef449f3b7f1083E0173317bc26FA417C8Ae8', // OLD Governor Alpha
    // GovernanceToken: '0x4cf566d201ef144e09d2f8abe1cc0e451d79de53' // defisaver
  }
}

export const SUPPORTED_CHAINS = Object.freeze({
  [APP_ENVIRONMENTS.mainnets]: SUPPORTED_NETWORKS[APP_ENVIRONMENTS.mainnets].map(getChain),
  [APP_ENVIRONMENTS.testnets]: SUPPORTED_NETWORKS[APP_ENVIRONMENTS.testnets].map(getChain)
})

export const QUERY_KEYS = {
  retroactivePoolClaimDataQuery: 'retroactivePoolClaimDataQuery',
  claimablePoolTotal: 'claimablePoolTotal',
  accountGovernanceDataQuery: 'accountGovernanceDataQuery',
  governorAlphaDataQuery: 'governorAlphaDataQuery',
  proposalVotesQuery: 'proposalVotesQuery',
  coingeckoTokenInfoQuery: 'coingeckoTokenInfoQuery',
  delegateDataQuery: 'delegateDataQuery',
  delegatesQuery: 'delegatesQuery',
  tokenHolderQuery: 'tokenHolderQuery',
  twitterProfileQuery: 'twitterProfileQuery',
  voteDataQuery: 'voteDataQuery',
  proposalsQuery: 'proposalsQuery',
  tokenFaucetAddresses: 'tokenFaucetAddresses',
  usePools: 'usePools',
  prizePoolContractAddresses: 'prizePoolContractAddresses',
  etherscanContractAbi: 'etherscanContractAbi',
  useProposalVotesTotalPages: 'useProposalVotesTotalPages',
  poolPoolBalance: 'poolPoolBalance',
  poolPoolProposal: 'poolPoolProposal'
}

export const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY

export const PROPOSAL_STATUS = {
  pending: 'pending',
  active: 'active',
  cancelled: 'cancelled',
  defeated: 'defeated',
  succeeded: 'succeeded',
  queued: 'queued',
  expired: 'expired',
  executed: 'executed'
}

// Note: Order matches contracts
export const PROPOSAL_STATES = [
  PROPOSAL_STATUS.pending,
  PROPOSAL_STATUS.active,
  PROPOSAL_STATUS.cancelled,
  PROPOSAL_STATUS.defeated,
  PROPOSAL_STATUS.succeeded,
  PROPOSAL_STATUS.queued,
  PROPOSAL_STATUS.expired,
  PROPOSAL_STATUS.executed
]

export const VOTERS_PER_PAGE = 7
export const DELEGATES_PER_PAGE = 15

export const POOLPOOL_SNAPSHOT_URL = 'https://snapshot.org/#/poolpool.pooltogether.eth'
export const POOLTOGETHER_SNAPSHOT_URL = 'https://snapshot.org/#/pooltogether.eth'
export const POOLTOGETHER_GOV_FORUM_URL = 'https://gov.pooltogether.com'
export const DISCORD_INVITE_URL = 'https://discord.gg/hxPhPDW'
export const POOLPOOL_URL = 'https://v3.pooltogether.com/pools/mainnet/PT-stPOOL'

export const POOLPOOL_TICKET_CREATED_BLOCK = 11987787
