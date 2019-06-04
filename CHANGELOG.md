# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## RoadMap

### Add
 - tests
 - ability for 2-way updating linked/nested queries as optional
 - migration support
 - support Fragments
 - support/restoring storing Queries with IDs

## Unreleased

## v1.1.2
### Changed
 - _helpers / updateQueryHelper_ - added _sourceDefault_ option (details in _Readme_)
 - _utils_ - improved _get_ utility
 - _Readme_ - added _sourceDefault_ definition

## v1.1.1
### Changed
 - _Readme.md_ content link fix, fixed explanation comments' mistakes
 - _helpers_ / _updateQueryHelper_: fixed missed default `updateType`

## v1.1.0
### Changed
 **Breaking changes*
 - _`updateQueryHandler` name changed to **`updateQueryHelper`***_
 - _`updateQueryHelper` has new param **`updater`** instead of **`retriever`** in case of updating with `updateName` only!* **`retriever`** can be used in case of string with `storeName` as previously_
 - _`nestedFromArray` renamed to `nestByArrayPath`*_
 - _README.md_ - huge update with actual usage examples, types, etc
 - code documentation small updates

### Added
 - `updateQueryHelper`*
 - `nestByArrayPath`*
 - new `updateQueryHelper` param **`updater`** instead of **`retriever`** in case of updating with `updateName` only!*

### Removed
 - `updateQueryHelper`*
 - `nestedFromArray`*

### Fixed
 - utility `set` - could cause a bug with deep (2+) nesting objects into empty object

## v1.0.3
### Changed
 - utils:
   - `set()` is stable for empty array path
 - helpers:
   - `updateQueryHandler()` changed arguments structure - **Breaking changes!**
 - Improved Readme.md

## v1.0.2
### Changed
 - 1.0.1 skipped because of npm publish issue
 - renamed from `Enhanced` to `Enchanted`, just because I want and npm publish issue ;)

## v1.0.0
### Changed
 - 🐛 bug-fixes
 - improvements in Utils, Helpers, Docs & Dependencies
 - added ability for deep merge of queries

## v1.0.0-alpha - DO NOT USE!
### Added
 - initiation of all basic files
 - dependencies
 - improvements of dependencies & Docs
 - 🐛 bug-fixes
 - stable and ready for usage
