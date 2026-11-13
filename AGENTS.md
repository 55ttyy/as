# Repository Guidelines

## Project Structure & Module Organization

This workspace currently contains no source files, tests, assets, or build configuration; `.git` also lacks usable repository metadata. Keep the root reserved for top-level configuration and contributor documentation.

When adding code, use a conventional layout and document it here. Separate entry points from reusable modules, place tests near the relevant source or in `tests/`, and exclude generated output from version control. Update this section when the layout changes.

## Build, Test, and Development Commands

No build, test, run, format, or lint commands are configured. Do not present placeholder commands as supported behavior.

When adding tooling, provide one canonical command per operation through a root `Makefile` or language-native scripts, then document it here. For now, inspect affected files and configuration when validating changes.

## Coding Style & Naming Conventions

No formatter or linter is configured. When adding source files, adopt the language's standard formatter and linter, commit their configuration, and run both before submitting changes.

Use lowercase, hyphen-separated documentation names, such as `contributor-guide.md`, and language conventions for identifiers. Use two-space indentation for manually maintained Markdown, YAML, and JSON; let formatters control source indentation.

## Testing Guidelines

No testing framework or coverage threshold is configured. When tests are introduced, use the standard language framework, keep names descriptive and behavior-focused, and colocate tests with modules or under `tests/`. Follow framework conventions such as `*_test.*` or `*.test.*`.

Every bug fix should include a regression test. The documented test command must pass before merge. Set coverage requirements only after a meaningful baseline exists.

## Commit & Pull Request Guidelines

This workspace has no usable Git history, so no existing commit convention can be recovered. After initialization, use concise imperative subjects such as `Add contributor guide`, keep commits focused, and explain motivation or constraints when necessary.

Pull requests should summarize behavior changes, list validation, and link issues. Include before/after screenshots for user-visible changes. Update this guide when commands, layout, or standards change.

## Configuration & Agent Notes

Store secrets in environment variables or ignored local files; never commit credentials, private keys, or service data. Before editing, inspect existing files and preserve unrelated work. Do not claim build or test coverage the repository does not provide.
