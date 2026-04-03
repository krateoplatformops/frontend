# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Previous changes not listed in this document can be traced using Git history.

## [1.0.16] - 2026-04-03

### Changed
- Added header when calling events

## [1.0.15] - 2026-03-31

### Fixed
- Fixed bug in `EventList` to prevent wrong call to `/events`

## [1.0.14] - 2026-03-27

### Changed
- Updated tag and pull request pipelines

## [1.0.13] - 2026-03-26

### Fixed
- Fixed bug in Notifications displaying
- Fixed bug in Login

## [1.0.12] - 2026-03-25

### Fixed
- Fixed redirect with events inside Form

## [1.0.11] - 2026-03-23

### Fixed
- Fixed logging in `useGetEvents` hook 

## [1.0.10] - 2026-03-20

### Changed
- Updated pagination handling by introducing cursor pagination

## [1.0.9] - 2026-03-13

### Changed
- **BREAKING:** Updated events format and handling for `EventList` and `Notifications`

## [1.0.8] - 2026-03-03

### Added
- Added `tableActions` property to `Table` widget

### Documentation
- Added `tableActions` documentation page

## [1.0.7] - 2026-02-13

### Added
- Added theme and logo customization

### Documentation
- Added theme customization documentation page

## [1.0.6] - 2026-01-27

### Added
- Added property to enable side menu inside `Form`
- Added add customized URL path extension property to `navigate` action
- Added tables to `Markdown` widget

### Documentation
- Added layout documentation page
- Added filters documentation page
- Added `Table` examples with `RESTAction`
- Updated guides
- Updated all documentation files

### Fixed
- Fixed UI displaying of `DataGrid` filtering
- Fixed UI displaying of label in `Autocomplete`

## [1.0.5] - 2025-12-22

### Fixed
- Fixed `Form` values and `initialValues` updates when switching context

## [1.0.4] - 2025-12-17

### Changed
- Updated type for `EventList` and `Notifications`

## [1.0.3] - 2025-12-16

### Added
- Added `initialValues` property to `Form`

## [1.0.2] - 2025-12-09

### Changed
- Updated cache clearing and `config.json` fetching logic

## [1.0.1] - 2025-12-04

### Removed
- Deprecated `payloadKey` property in `Form`

## [1.0.0] - 2025-12-04

### Added
- Added frontend examples portal