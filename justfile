# Build the project
build:
    bun run build

# Clean dist directory
clean:
    rm -rf dist

# Rebuild from scratch
rebuild: clean build

# Bump patch version and publish (1.0.0 -> 1.0.1)
publish-patch: rebuild
    npm version patch
    bunx npm publish --access public

# Bump minor version and publish (1.0.0 -> 1.1.0)
publish-minor: rebuild
    npm version minor
    bunx npm publish --access public

# Bump major version and publish (1.0.0 -> 2.0.0)
publish-major: rebuild
    npm version major
    bunx npm publish --access public

# Publish without version bump (use after manual version change)
publish: rebuild
    bunx npm publish --access public

# Dry run publish to see what would be published
publish-dry: rebuild
    bunx npm publish --access public --dry-run
