export const CALLRAIL_COMPANY_ID = "279230533";
export const CALLRAIL_SWAP_TOKEN = "6c157f06de9cb3952db3";
export const CALLRAIL_SWAP_VERSION = "12";
export const CALLRAIL_SWAP_SRC = `https://cdn.callrail.com/companies/${CALLRAIL_COMPANY_ID}/${CALLRAIL_SWAP_TOKEN}/${CALLRAIL_SWAP_VERSION}/swap.js`;

export const CALLRAIL_ALLOWED_HOSTS = ["chirobackpain.com", "www.chirobackpain.com"] as const;

export function isCallRailHost(hostname: string): boolean {
  const normalizedHostname = hostname.toLowerCase();
  return CALLRAIL_ALLOWED_HOSTS.some((allowedHost) => allowedHost === normalizedHostname);
}
