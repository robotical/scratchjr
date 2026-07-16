# Curriculum artifact import

Blocks Jr can import a versioned curriculum project as a fresh editable local
copy. This is an internal handoff for the outer Marty application. Public
Learning Site links should continue to use the Marty app's stable artifact route,
for example `/open-code?artifact=<id>&release=<id>`.

The outer registry descriptor for this payload uses integration key
`robotical-martyblocks-jr-current`, environment `martyBlocksJr`, format
`martyblocksjr-project-v1` and media type `application/json`.

The outer app resolves that stable identity and opens Blocks Jr with:

```text
curriculumArtifactUrl=<absolute URL-encoded HTTPS URL>
curriculumArtifactSha256=<64-character SHA-256 hex digest>
```

The adapter permits the digest to be omitted only for loopback development.
The outer Marty artifact resolver requires and supplies it in every deployed
environment.

Production payload origins must be explicitly configured in `settings.json`
using `curriculumArtifactAllowedOrigins`; the Marty edition allows exactly
`https://cdn.sanity.io`, where managed Learning Site file assets are published.
HTTP or HTTPS on loopback hosts is accepted for local development. Requests omit
credentials and referrer information. Redirect targets are revalidated against
the same policy.

## Version 1 envelope

```json
{
  "kind": "robotical.curriculum-code-artifact",
  "formatVersion": 1,
  "platform": "martyblocksjr",
  "projectPackage": {
    "formatVersion": 1,
    "project": {
      "name": "Walking starter",
      "version": "iOSv01",
      "thumbnail": { "pagecount": 1, "md5": "thumbnail.png" },
      "json": {
        "pages": ["page 1"],
        "currentPage": "page 1",
        "page 1": { "sprites": [], "layers": [] }
      }
    },
    "assets": {
      "thumbnail.png": "<base64>"
    }
  }
}
```

The importer checks the envelope and package versions, platform, project
structure, safe relative asset identifiers, base64 encoding, response type,
redirect origin, optional digest and resource limits before it writes anything.
Source database IDs, gallery state, timestamps and gift state are discarded.
`ProjectCloud.importPackage` creates a new local project ID, so the published
curriculum project is never edited in place.

Packaged asset identifiers should be content-addressed or otherwise unique.
Blocks Jr refuses to replace an existing local asset when the same identifier
already contains different bytes, avoiding silent corruption of either project.

The importer does not use Firebase cloud share IDs, authentication, classroom
accounts or permissions.

## Limits

- 20 MiB downloaded JSON document
- 2 MiB project JSON
- 512 packaged assets
- 8 MiB per asset and 13 MiB total decoded assets
- 64 pages and 256 sprites per page
- 128 sounds and 128 animation frames per sprite
- 15 second request timeout

After a successful import, Blocks Jr replaces the artifact query parameters in
the current editor URL with the newly allocated local `pmd5`. Reloading the
editor therefore reopens that copy instead of importing duplicate projects.
