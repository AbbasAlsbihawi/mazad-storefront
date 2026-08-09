export const ROUTES = {
  home: '/',
  auctions: '/auctions',
  auctionDetail: (id: string) => `/auctions/${id}`,
  store: (id: string) => `/stores/${id}`,
  login: '/login',
  register: '/register',
  account: '/account',
  addressesList: '/account/addresses',
  myBids: '/account/bids',
  watchlistList: '/account/watchlist',
  following: '/account/following',
  sellerProfile: (id: string) => `/sellers/${id}`,
} as const;
