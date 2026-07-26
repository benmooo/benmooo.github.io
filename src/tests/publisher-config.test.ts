import { describe, expect, it } from "vitest";

import {
  defaultPublishGatewayUrl,
  getPublishGatewayUrl,
} from "~/features/publisher/publisher-config";

describe("publisher config", () => {
  it("uses the deployed gateway when no build-time override exists", () => {
    expect(getPublishGatewayUrl(undefined)).toBe(defaultPublishGatewayUrl);
  });

  it("normalizes a configured gateway override", () => {
    expect(
      getPublishGatewayUrl(" https://publisher.example.com/// "),
    ).toBe("https://publisher.example.com");
  });
});
