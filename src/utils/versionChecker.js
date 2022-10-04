import semverGt from "semver/functions/gt";

export default function isVersionGreater(v1, v2) {
  try {
    return semverGt(v1, v2);
  } catch (e) {
    console.log(e, v1, v2);
    return false;
  }
}
