// This requirement belongs to generators, not consumers of the published library.
const [major, minor] = process.versions.node.split('.').map(Number);
if (!(major === 22 && minor >= 18 || major >= 24)) {
  console.error(`IRONMAW generators require Node ^22.18.0 || >=24.0.0; found ${process.versions.node}.`);
  process.exit(1);
}
