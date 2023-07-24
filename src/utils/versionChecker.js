import semverGt from "semver/functions/gt";
import semverEq from "semver/functions/eq";

export default function isVersionGreater(v1, v2) {
  try {
    return semverGt(v1, v2);
  } catch (e) {
    console.log(e, v1, v2);
    return false;
  }
}

export function isVersionEqual(v1, v2) {
  try {
    return semverEq(v1, v2);
  } catch (e) {
    console.log(e, v1, v2);
    return false;
  }
}