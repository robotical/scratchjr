import { afterEach, describe, expect, it, vi } from "vitest";
import goToLink from "../src/utils/goToLink";

describe("goToLink", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps query parameters when the server redirects HTML pages to clean URLs", async () => {
    const targetWindow = { location: { href: "initial" } };
    const fetchMock = vi.fn().mockResolvedValue({ redirected: true });
    vi.stubGlobal("fetch", fetchMock);

    await goToLink(
      "http://localhost:3011/editor.html?pmd5=-1&mode=edit&tutorial=marty-jr-blocks-1",
      targetWindow
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3011/editor.html?pmd5=-1&mode=edit&tutorial=marty-jr-blocks-1"
    );
    expect(targetWindow.location.href).toBe(
      "http://localhost:3011/editor?pmd5=-1&mode=edit&tutorial=marty-jr-blocks-1"
    );
  });

  it("keeps HTML page URLs for wrapper servers that do not redirect", async () => {
    const targetWindow = { location: { href: "initial" } };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ redirected: false }));

    await goToLink("./MartyBlocksJR/editor.html?tutorial=cog-jrblocks-1", targetWindow);

    expect(targetWindow.location.href).toBe(
      "./MartyBlocksJR/editor.html?tutorial=cog-jrblocks-1"
    );
  });

  it("falls back to the HTML page URL when redirect detection is unavailable", async () => {
    const targetWindow = { location: { href: "initial" } };
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("fetch unavailable")));

    await goToLink("editor.html?tutorial=cog-and-marty-tutorial", targetWindow);

    expect(targetWindow.location.href).toBe(
      "editor.html?tutorial=cog-and-marty-tutorial"
    );
  });
});
