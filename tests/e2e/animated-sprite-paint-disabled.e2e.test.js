import { afterAll, beforeAll, describe, expect, it } from "vitest";
import puppeteer from "puppeteer";
import { spawn } from "child_process";
import http from "http";

const PORT = 3018;
const HOST = `http://localhost:${PORT}`;

let server;

async function waitForServer(maxAttempts = 20) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const ok = await new Promise((resolve) => {
      const req = http.get(`${HOST}/`, (res) => {
        res.destroy();
        resolve(true);
      });
      req.on("error", () => resolve(false));
    });
    if (ok) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("Local server did not start in time");
}

beforeAll(async () => {
  server = spawn("python3", ["-m", "http.server", `${PORT}`, "--directory", "editions/free/src"], {
    stdio: "ignore",
  });
  await waitForServer();
}, 30_000);

afterAll(() => {
  if (server) {
    server.kill();
  }
});

async function openEditor() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  const errors = [];

  page.on("pageerror", (err) => errors.push(err.message || String(err)));
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });

  await page.goto(`${HOST}/editor.html?mode=edit`, { waitUntil: "networkidle2", timeout: 30_000 });
  await page.waitForFunction(
    () => {
      const backdrop = document.getElementById("backdrop");
      return Boolean(
        window.ScratchJr
          && window.ScratchJr.stage
          && window.ScratchJr.stage.currentPage
          && backdrop
          && window.getComputedStyle(backdrop).display === "none"
          && !window.ScratchJr.onHold
      );
    },
    { timeout: 30_000 }
  );

  return { browser, page, errors };
}

async function dragBlockToScripts(page, categorySelector, blockSelector, blockType) {
  const blockCount = await page.evaluate(() => window.ScratchJr.getBlocks().length);
  await page.click(categorySelector);
  await page.waitForSelector(blockSelector, { visible: true });

  const source = await page.$eval(blockSelector, (node) => {
    const rect = node.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  });
  const target = await page.$eval("#scripts", (node) => {
    const rect = node.getBoundingClientRect();
    return {
      x: rect.left + Math.min(220, rect.width / 2),
      y: rect.top + Math.min(170, rect.height / 2),
    };
  });

  await page.mouse.move(source.x, source.y);
  await page.mouse.down();
  await page.mouse.move(target.x, target.y, { steps: 12 });
  await page.mouse.up();

  await page.waitForFunction(
    (before, type) => window.ScratchJr.getBlocks().length > before
      && window.ScratchJr.getBlocks().some((block) => block.blocktype === type),
    { timeout: 30_000 },
    blockCount,
    blockType
  );
}

async function getSelectedSpritePaintState(page) {
  return page.evaluate(() => {
    const sprite = window.ScratchJr && window.ScratchJr.getSprite();
    const thumb = sprite && sprite.thumbnail;
    const brush = thumb && thumb.querySelector(".brush");
    if (!sprite || !thumb || !brush) {
      throw new Error("Selected sprite paint controls were not found");
    }
    return {
      md5: sprite.md5,
      thumbClass: thumb.className,
      brushDisplay: window.getComputedStyle(brush).display,
      blockTypes: window.ScratchJr.getBlocks().map((block) => block.blocktype),
    };
  });
}

describe("sprite paint editing availability", () => {
  it(
    "keeps Marty paint editing disabled after dropping a block",
    async () => {
      const { browser, page, errors } = await openEditor();

      try {
        const beforeDrop = await getSelectedSpritePaintState(page);
        expect(beforeDrop.md5).toBe("Sprites_Marty.svg");
        expect(beforeDrop.thumbClass).toContain("martynoneditable");
        expect(beforeDrop.brushDisplay).toBe("none");

        await dragBlockToScripts(page, "#sprite-motion", "#forward_block", "forward");

        const afterDrop = await getSelectedSpritePaintState(page);
        expect(afterDrop.thumbClass).toContain("martynoneditable");
        expect(afterDrop.brushDisplay).toBe("none");
        expect(afterDrop.blockTypes).toContain("forward");

        const paintFrameVisible = await page.evaluate(() => {
          const brush = window.ScratchJr.getSprite().thumbnail.querySelector(".brush");
          brush.dispatchEvent(new PointerEvent("pointerdown", {
            bubbles: true,
            cancelable: true,
            pointerType: "mouse",
          }));
          return window.getComputedStyle(document.getElementById("paintframe")).display !== "none";
        });
        expect(paintFrameVisible).toBe(false);
        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    60_000
  );

  it(
    "disables paint editing for the animated bee in the library and sprite panel",
    async () => {
      const { browser, page, errors } = await openEditor();

      try {
        await page.click("#addsprite");
        await page.waitForSelector("#libframe.appear #BeeSprite1\\.svg", { timeout: 30_000 });
        await page.click("#BeeSprite1\\.svg");
        await page.waitForFunction(
          () => document.getElementById("library_paintme").getAttribute("aria-disabled") === "true",
          { timeout: 30_000 }
        );

        const libraryState = await page.evaluate(() => {
          const paintButton = document.getElementById("library_paintme");
          return {
            ariaDisabled: paintButton.getAttribute("aria-disabled"),
            opacity: paintButton.style.opacity,
            hasClickHandler: typeof paintButton.onclick === "function",
          };
        });

        expect(libraryState).toEqual({
          ariaDisabled: "true",
          opacity: "0",
          hasClickHandler: false,
        });

        await new Promise((resolve) => setTimeout(resolve, 250));
        await page.click("#BeeSprite1\\.svg");
        await page.waitForFunction(
          () => {
            const sprite = window.ScratchJr && window.ScratchJr.getSprite();
            return Boolean(sprite && sprite.animationFrames && sprite.animationFrames.length === 3);
          },
          { timeout: 30_000 }
        );

        const beeThumbId = await page.evaluate(() => window.ScratchJr.getSprite().thumbnail.id);
        await page.click(`[id="${beeThumbId}"]`);
        await page.waitForFunction(
          () => window.ScratchJr.getSprite().thumbnail.className.includes("paintnoneditable"),
          { timeout: 30_000 }
        );

        const spriteState = await page.evaluate(() => {
          const sprite = window.ScratchJr.getSprite();
          const thumb = sprite.thumbnail;
          const brush = thumb.querySelector(".brush");
          const paintFrame = document.getElementById("paintframe");
          brush.dispatchEvent(new PointerEvent("pointerdown", {
            bubbles: true,
            cancelable: true,
            pointerType: "mouse",
          }));
          return {
            thumbClass: thumb.className,
            brushDisplay: window.getComputedStyle(brush).display,
            paintFrameVisible: window.getComputedStyle(paintFrame).display !== "none",
          };
        });

        expect(spriteState.thumbClass).toContain("paintnoneditable");
        expect(spriteState.brushDisplay).toBe("none");
        expect(spriteState.paintFrameVisible).toBe(false);
        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    60_000
  );

  it(
    "keeps paint editing available and contained within ordinary sprite cards",
    async () => {
      const { browser, page, errors } = await openEditor();

      try {
        await page.click("#addsprite");
        await page.waitForSelector("#libframe.appear #Star\\.svg", { timeout: 30_000 });
        await page.click("#Star\\.svg");
        await page.waitForFunction(
          () => {
            const star = document.getElementById("Star.svg");
            const paintButton = document.getElementById("library_paintme");
            return Boolean(
              star
                && star.className.includes("on")
                && paintButton.getAttribute("aria-disabled") === "false"
                && typeof paintButton.onclick === "function"
            );
          },
          { timeout: 30_000 }
        );

        await new Promise((resolve) => setTimeout(resolve, 250));
        await page.click("#Star\\.svg");
        await page.waitForFunction(
          () => {
            const sprite = window.ScratchJr && window.ScratchJr.getSprite();
            return Boolean(sprite && sprite.md5 === "Star.svg");
          },
          { timeout: 30_000 }
        );

        const starThumbId = await page.evaluate(() => window.ScratchJr.getSprite().thumbnail.id);
        await page.click(`[id="${starThumbId}"]`);
        await page.waitForFunction(
          () => window.ScratchJr.getSprite().thumbnail.className.includes("on"),
          { timeout: 30_000 }
        );

        const layoutState = await page.evaluate(() => {
          const visibleThumbs = Array.from(document.querySelectorAll("#spritecc .spritethumb"))
            .filter((thumb) => window.getComputedStyle(thumb).display !== "none");
          const selectedThumb = visibleThumbs.find((thumb) => thumb.getAttribute("aria-pressed") === "true");
          const unselectedThumb = visibleThumbs.find((thumb) => thumb.getAttribute("aria-pressed") === "false");
          const addSpriteButton = document.getElementById("addsprite");
          const name = selectedThumb && selectedThumb.querySelector(".sname");
          const brush = selectedThumb && selectedThumb.querySelector(".brush");

          if (!selectedThumb || !unselectedThumb || !addSpriteButton || !name || !brush) {
            throw new Error("Sprite card layout controls were not found");
          }

          const rectFor = (element) => {
            const rect = element.getBoundingClientRect();
            return {
              top: rect.top,
              right: rect.right,
              bottom: rect.bottom,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            };
          };
          const selectedStyle = window.getComputedStyle(selectedThumb);

          return {
            selected: rectFor(selectedThumb),
            unselected: rectFor(unselectedThumb),
            addSprite: rectFor(addSpriteButton),
            name: rectFor(name),
            brush: rectFor(brush),
            selectedBackgroundImage: selectedStyle.backgroundImage,
            selectedBackgroundSize: selectedStyle.backgroundSize,
          };
        });

        expect(layoutState.selected.width).toBeCloseTo(layoutState.unselected.width, 1);
        expect(layoutState.selected.width).toBeCloseTo(layoutState.addSprite.width, 1);
        expect(layoutState.selected.height).toBeCloseTo(layoutState.unselected.height, 1);
        expect(layoutState.selectedBackgroundImage).toContain("viewOnCompact.png");
        expect(layoutState.selectedBackgroundSize).toBe("100% 100%");
        expect(layoutState.name.right).toBeLessThanOrEqual(layoutState.brush.left + 0.5);
        expect(layoutState.brush.left).toBeGreaterThanOrEqual(layoutState.selected.left);
        expect(layoutState.selected.right - layoutState.brush.right)
          .toBeGreaterThanOrEqual(layoutState.brush.width * 0.1);
        expect(layoutState.brush.top).toBeGreaterThanOrEqual(layoutState.selected.top);
        expect(layoutState.brush.bottom).toBeLessThanOrEqual(layoutState.selected.bottom);

        const editableState = await page.evaluate(() => {
          const sprite = window.ScratchJr.getSprite();
          const thumb = sprite.thumbnail;
          const brush = thumb.querySelector(".brush");
          brush.dispatchEvent(new PointerEvent("pointerdown", {
            bubbles: true,
            cancelable: true,
            pointerType: "mouse",
          }));
          return {
            thumbClass: thumb.className,
            brushDisplay: window.getComputedStyle(brush).display,
          };
        });

        await page.waitForFunction(
          () => {
            const paintFrame = document.getElementById("paintframe");
            return paintFrame && window.getComputedStyle(paintFrame).display !== "none";
          },
          { timeout: 30_000 }
        );

        expect(editableState.thumbClass).not.toContain("paintnoneditable");
        expect(editableState.brushDisplay).not.toBe("none");
        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    60_000
  );
});

describe("animated Bee movement direction", () => {
  it(
    "faces toward horizontal movement while all animation frames remain active",
    async () => {
      const { browser, page, errors } = await openEditor();

      try {
        const frameOrientations = await page.evaluate(async () => {
          const frames = ["BeeSprite1.svg", "BeeSprite2.svg", "BeeSprite3.svg"];

          return Promise.all(frames.map(async (frame) => {
            const image = new Image();
            image.src = `/svglibrary/${frame}`;
            await image.decode();

            const canvas = document.createElement("canvas");
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            const context = canvas.getContext("2d");
            context.drawImage(image, 0, 0);
            const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
            let leftYellowPixels = 0;
            let rightYellowPixels = 0;

            for (let index = 0; index < pixels.length; index += 4) {
              const red = pixels[index];
              const green = pixels[index + 1];
              const blue = pixels[index + 2];
              const alpha = pixels[index + 3];
              if (alpha <= 200 || red <= 200 || green <= 130 || green >= 230 || blue >= 140) {
                continue;
              }
              const x = (index / 4) % canvas.width;
              if (x < canvas.width / 2) {
                leftYellowPixels += 1;
              } else {
                rightYellowPixels += 1;
              }
            }

            return { frame, leftYellowPixels, rightYellowPixels };
          }));
        });

        frameOrientations.forEach((frame) => {
          expect(frame.rightYellowPixels).toBeGreaterThan(frame.leftYellowPixels * 2);
        });

        await page.evaluate(() => {
          window.ScratchJr.stage.currentPage.addSprite(0.35, "BeeSprite1.svg", "Bee");
        });
        await page.waitForFunction(
          () => {
            const sprite = window.ScratchJr && window.ScratchJr.getSprite();
            return Boolean(
              sprite
                && sprite.md5 === "BeeSprite1.svg"
                && sprite.animationFrameDataUrls
                && sprite.animationFrameDataUrls.length === 3
            );
          },
          { timeout: 30_000 }
        );

        await page.click("#sprite-motion");
        await page.waitForSelector("#forward_block", { visible: true });

        const runMotion = async (blockType, expectedFlip, direction) => {
          const startX = await page.evaluate((type) => {
            const sprite = window.ScratchJr.getSprite();
            const script = window.ScratchJr.getActiveScript();
            script.owner.keyboardTargetBlock = null;
            const paletteBlock = document.getElementById(`${type}_block`);
            window.Palette.insertBlockFromKeyboard(
              paletteBlock,
              new Event("bee-facing-direction-test")
            );
            const matchingBlocks = window.ScratchJr.getBlocks().filter(
              (block) => block.blocktype === type && block.prev === null
            );
            window.ScratchJr.runtime.addRunScript(
              sprite,
              matchingBlocks[matchingBlocks.length - 1]
            );
            return sprite.xcoor;
          }, blockType);

          await page.waitForFunction(
            (flip, initialX, sign) => {
              const sprite = window.ScratchJr.getSprite();
              return sprite.flip === flip
                && (sprite.xcoor - initialX) * sign > 0
                && window.ScratchJr.runtime.inactive();
            },
            { timeout: 10_000 },
            expectedFlip,
            startX,
            direction
          );

          return page.evaluate(() => {
            const sprite = window.ScratchJr.getSprite();
            return {
              x: sprite.xcoor,
              flip: sprite.flip,
              scaleX: new WebKitCSSMatrix(window.getComputedStyle(sprite.div).transform).a,
              animationFrames: sprite.animationFrames.length,
            };
          });
        };

        const moveRight = await runMotion("forward", false, 1);
        const moveLeft = await runMotion("back", true, -1);

        expect(moveRight.x).toBeGreaterThan(moveLeft.x);
        expect(moveRight.flip).toBe(false);
        expect(moveRight.scaleX).toBeGreaterThan(0);
        expect(moveRight.animationFrames).toBe(3);
        expect(moveLeft.flip).toBe(true);
        expect(moveLeft.scaleX).toBeLessThan(0);
        expect(moveLeft.animationFrames).toBe(3);
        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    60_000
  );
});
