# Activity narration

Activity instructions use the same Azure endpoint, voice settings and persistent
server cache as MartyBlocks 4.0.80. No Azure credentials are included in Blocks Jr.

The activity toolbar keeps its device Read aloud control and shows a Marty icon
when a verified physical Marty is available. With multiple Martys, the selected
device is used; an ambiguous selection does not expose a robot narration action.
Cog, simulated and unverified connections are excluded. Displayed instructions
and hints are converted to plain text and read in the current application locale.

Azure is tried first for both outputs. Device failures silently use the browser's
normal speech voice. Marty failures use the existing speech-block service and
keep playback on the robot. That provider's 128-character requests are split and
joined without truncating instructions. Normal Marty synthesis still needs an
internet connection. Fallback recordings do not replace the cached Azure audio.

The pinwheel eye command starts before the robot audio stream. Stop, normal
completion and playback failure clear the eyes. LED commands are best effort so
robots without the LED-eye add-on can narrate. A disconnected or replacement
connection cannot receive an old recording or cleanup command. Robot completion
uses decoded duration plus an 800 ms margin, rather than a firmware playback-end
event.

Switching speakers, changing steps, hints or language, opening activity media,
leaving the activity, hiding the page and losing the selected robot connection
cancel the relevant narration. Pending responses are discarded after cancellation.
Each control owns its state callback, so an old activity cannot stop a new one.

## Browser and native compatibility

This feature is shared with the React Native WebView. It uses the existing
`RAFT_STREAM_AUDIO` and `RAFT_SEND_REST` contracts without changing discovery,
pairing, verification or payloads. The MP3 encoder honours the host's
`getSoundStreamingProfile()` bitrate, sample rate and ABR setting, matching Blocks.
Host lookup supports nested iframe and object documents and tolerates inaccessible
cross-origin windows.

Both web-app and native-wrapper connectors must cancel the outgoing stream before
forwarding `audio/stop`. The matching native-wrapper change is required for a
mobile rollout. Physical robot and phone playback, disconnect/reconnect and
background/foreground still require hardware validation; mocked browser tests do
not establish physical compatibility.

## Validation

```sh
npx vitest run tests/tutorial
npm run build-prod:copy
npx vitest run tests/e2e/tutorial-narration.e2e.test.js tests/e2e/tutorial-startup.e2e.test.js
```

The narration browser tests use a declared mock robot in
`tests/fixtures/narration-host.html` and intercept Azure with deterministic audio
and quota responses. Encoder tests use the real MP3 implementation. Run the
companion wrapper's tests, typecheck, lint and iOS/Android bundle checks before a
mobile release, following the web app's compatibility guide.

For local host testing, copy the generated `app.bundle.js` and its license file,
`css/tutorial.css`, `localizations/en.json` and `licenses/lamejs-LGPL-2.1.txt` into
the corresponding files under `marty-web-app/public/MartyBlocksJR`. A production
web-app build then includes those local assets. Running the web app's normal
package-copy preparation restores assets from its installed npm package.
