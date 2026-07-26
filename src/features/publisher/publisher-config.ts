export const defaultPublishGatewayUrl =
  "https://benmooo-publish-gateway.benmo0802.workers.dev";

export const getPublishGatewayUrl = (
  configuredUrl: string | undefined = import.meta.env.VITE_PUBLISH_GATEWAY_URL,
) => {
  const normalizedUrl = configuredUrl?.trim().replace(/\/+$/u, "");

  return normalizedUrl || defaultPublishGatewayUrl;
};
