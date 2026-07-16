import { beforeEach, describe, expect, it, vi } from "vitest";

const { importPackageMock } = vi.hoisted(() => ({
  importPackageMock: vi.fn(),
}));

vi.mock("@/editor/ProjectCloud", () => ({
  default: {
    importPackage: importPackageMock,
  },
}));

import {
  CURRICULUM_ARTIFACT_KIND,
  CURRICULUM_ARTIFACT_PLATFORM,
  importCurriculumArtifactFromSearch,
  parseCurriculumArtifactRequest,
  sha256Hex,
  validateCurriculumArtifact,
} from "@/editor/CurriculumArtifact";

function validArtifact() {
  return {
    kind: CURRICULUM_ARTIFACT_KIND,
    formatVersion: 1,
    platform: CURRICULUM_ARTIFACT_PLATFORM,
    projectPackage: {
      formatVersion: 1,
      project: {
        id: "source-project-id-must-not-be-reused",
        name: "Walking starter",
        version: "iOSv01",
        gallery: "samples",
        isgift: "1",
        thumbnail: {
          pagecount: 1,
          md5: "thumbnail.png",
        },
        json: {
          pages: ["page 1"],
          currentPage: "page 1",
          "page 1": {
            sprites: ["Marty 1"],
            layers: ["Marty 1"],
            md5: "Farm.svg",
            "Marty 1": {
              id: "Marty 1",
              type: "sprite",
              md5: "marty.svg",
              animationFrames: ["marty.svg", "marty-2.svg"],
              sounds: ["hello.wav"],
              scripts: [],
            },
          },
        },
      },
      assets: {
        "thumbnail.png": "dGh1bWI=",
        "marty.svg": "PHN2Zy8+",
        "marty-2.svg": "PHN2Zy8+",
        "hello.wav": "UklGRg==",
      },
    },
  };
}

function responseFor(value, url = "https://cdn.sanity.io/files/project/dataset/walking.json") {
  var bytes = new TextEncoder().encode(JSON.stringify(value));
  return {
    ok: true,
    url: url,
    headers: {
      get(name) {
        if (name.toLowerCase() === "content-type") {
          return "application/vnd.robotical.curriculum-code-artifact+json; charset=utf-8";
        }
        if (name.toLowerCase() === "content-length") {
          return String(bytes.byteLength);
        }
        return null;
      },
    },
    arrayBuffer: async function () {
      return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
    },
  };
}

describe("curriculum artifact import", () => {
  beforeEach(() => {
    importPackageMock.mockReset();
    importPackageMock.mockResolvedValue({ projectId: "42" });
  });

  it("normalizes a valid artifact into a fresh editable project package", () => {
    var result = validateCurriculumArtifact(validArtifact());

    expect(result.formatVersion).toBe(1);
    expect(result.project).toMatchObject({
      name: "Walking starter",
      version: "iOSv01",
      deleted: "NO",
      isgift: "0",
    });
    expect(result.project.id).toBeUndefined();
    expect(result.project.gallery).toBeUndefined();
    expect(Object.keys(result.assets).sort()).toEqual([
      "hello.wav",
      "marty-2.svg",
      "marty.svg",
      "thumbnail.png",
    ]);
  });

  it("rejects unsupported envelopes and packages", () => {
    var artifact = validArtifact();
    artifact.platform = "martyblocks";
    expect(() => validateCurriculumArtifact(artifact)).toThrow(/platform/);

    artifact = validArtifact();
    artifact.formatVersion = 2;
    expect(() => validateCurriculumArtifact(artifact)).toThrow(/formatVersion/);

    artifact = validArtifact();
    artifact.projectPackage.formatVersion = 2;
    expect(() => validateCurriculumArtifact(artifact)).toThrow(/projectPackage formatVersion/);
  });

  it("rejects remote, traversal and unreferenced project assets", () => {
    var artifact = validArtifact();
    artifact.projectPackage.project.json["page 1"].md5 = "https://evil.example/background.svg";
    expect(() => validateCurriculumArtifact(artifact)).toThrow(/safe relative asset identifier/);

    artifact = validArtifact();
    artifact.projectPackage.project.json["page 1"]["Marty 1"].md5 = "../marty.svg";
    expect(() => validateCurriculumArtifact(artifact)).toThrow(/safe relative asset identifier/);

    artifact = validArtifact();
    artifact.projectPackage.assets["unused.svg"] = "PHN2Zy8+";
    expect(() => validateCurriculumArtifact(artifact)).toThrow(/unreferenced asset/);

    artifact = validArtifact();
    artifact.projectPackage.project.json["page 1"]["Marty 1"].md5 = "sprites/%2e%2e/marty.svg";
    expect(() => validateCurriculumArtifact(artifact)).toThrow(/safe relative asset identifier/);
  });

  it("rejects project structures that the editor cannot safely recreate", () => {
    var artifact = validArtifact();
    delete artifact.projectPackage.project.json["page 1"].layers;
    expect(() => validateCurriculumArtifact(artifact)).toThrow(/layers/);

    artifact = validArtifact();
    artifact.projectPackage.project.json["page 1"].layers = [];
    expect(() => validateCurriculumArtifact(artifact)).toThrow(/every sprite/);

    artifact = validArtifact();
    delete artifact.projectPackage.project.json["page 1"]["Marty 1"].scripts;
    expect(() => validateCurriculumArtifact(artifact)).toThrow(/scripts/);
  });

  it("accepts only configured HTTPS URLs and loopback development URLs", () => {
    expect(parseCurriculumArtifactRequest(
      "?curriculumArtifactUrl=https%3A%2F%2Fcdn.sanity.io%2Fartifact.json" +
        "&curriculumArtifactSha256=" + "a".repeat(64),
      {
        baseUrl: "https://app.example/blocks-jr",
        allowedOrigins: ["https://cdn.sanity.io"],
      }
    ).url).toBe("https://cdn.sanity.io/artifact.json");

    expect(parseCurriculumArtifactRequest(
      "?curriculumArtifactUrl=http%3A%2F%2Flocalhost%3A3011%2Fartifact.json",
      { baseUrl: "http://localhost:3011/blocks-jr" }
    ).url).toBe("http://localhost:3011/artifact.json");

    expect(() => parseCurriculumArtifactRequest(
      "?curriculumArtifactUrl=https%3A%2F%2Fevil.example%2Fartifact.json" +
        "&curriculumArtifactSha256=" + "a".repeat(64),
      { baseUrl: "https://app.example/blocks-jr" }
    )).toThrow(/origin is not allowed/);

    expect(() => parseCurriculumArtifactRequest(
      "?curriculumArtifactUrl=https%3A%2F%2Fapp.example%2Fartifact.json" +
        "&curriculumArtifactSha256=" + "a".repeat(64),
      { baseUrl: "https://app.example/blocks-jr" }
    )).toThrow(/origin is not allowed/);

    expect(() => parseCurriculumArtifactRequest(
      "?curriculumArtifactUrl=%2Fartifact.json&curriculumArtifactSha256=" + "a".repeat(64),
      { baseUrl: "https://app.example/blocks-jr" }
    )).toThrow(/absolute URL/);
  });

  it("allows explicitly configured artifact origins", () => {
    var request = parseCurriculumArtifactRequest(
      "?curriculumArtifactUrl=https%3A%2F%2Fcontent.robotical.io%2Fartifact.json" +
        "&curriculumArtifactSha256=" + "a".repeat(64),
      {
        baseUrl: "https://app.example/blocks-jr",
        allowedOrigins: ["https://content.robotical.io"],
      }
    );
    expect(request.url).toBe("https://content.robotical.io/artifact.json");
  });

  it("requires payload integrity outside loopback development", () => {
    expect(() => parseCurriculumArtifactRequest(
      "?curriculumArtifactUrl=https%3A%2F%2Fcdn.sanity.io%2Fartifact.json",
      {
        baseUrl: "https://app.example/blocks-jr",
        allowedOrigins: ["https://cdn.sanity.io"],
      }
    )).toThrow(/required outside local development/);
  });

  it("fetches, verifies and imports a package as a new local project", async () => {
    var response = responseFor(validArtifact());
    var body = await response.arrayBuffer();
    var digest = sha256Hex(body);
    var fetchMock = vi.fn().mockResolvedValue(response);
    var result = await importCurriculumArtifactFromSearch(
      "?curriculumArtifactUrl=https%3A%2F%2Fcdn.sanity.io%2Ffiles%2Fproject%2Fdataset%2Fwalking.json" +
        "&curriculumArtifactSha256=" + digest,
      {
        baseUrl: "https://app.example/blocks-jr",
        allowedOrigins: ["https://cdn.sanity.io"],
        fetchImplementation: fetchMock,
        projectVersion: "iOSv01",
      }
    );

    expect(result).toEqual({ projectId: "42" });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://cdn.sanity.io/files/project/dataset/walking.json",
      expect.objectContaining({
        credentials: "omit",
        cache: "no-store",
        referrerPolicy: "no-referrer",
      })
    );
    expect(importPackageMock).toHaveBeenCalledTimes(1);
    expect(importPackageMock.mock.calls[0][0].project.id).toBeUndefined();
  });

  it("does not write anything when the checksum is wrong", async () => {
    var fetchMock = vi.fn().mockResolvedValue(responseFor(validArtifact()));
    await expect(importCurriculumArtifactFromSearch(
      "?curriculumArtifactUrl=https%3A%2F%2Fcdn.sanity.io%2Ffiles%2Fproject%2Fdataset%2Fwalking.json" +
        "&curriculumArtifactSha256=" + "0".repeat(64),
      {
        baseUrl: "https://app.example/blocks-jr",
        allowedOrigins: ["https://cdn.sanity.io"],
        fetchImplementation: fetchMock,
      }
    )).rejects.toThrow(/checksum/);
    expect(importPackageMock).not.toHaveBeenCalled();
  });

  it("does not write anything when a redirect crosses an allowed-origin boundary", async () => {
    var fetchMock = vi.fn().mockResolvedValue(responseFor(validArtifact(), "https://evil.example/artifact.json"));
    await expect(importCurriculumArtifactFromSearch(
      "?curriculumArtifactUrl=https%3A%2F%2Fcdn.sanity.io%2Ffiles%2Fproject%2Fdataset%2Fwalking.json" +
        "&curriculumArtifactSha256=" + "b".repeat(64),
      {
        baseUrl: "https://app.example/blocks-jr",
        allowedOrigins: ["https://cdn.sanity.io"],
        fetchImplementation: fetchMock,
      }
    )).rejects.toThrow(/redirect origin/);
    expect(importPackageMock).not.toHaveBeenCalled();
  });
});
