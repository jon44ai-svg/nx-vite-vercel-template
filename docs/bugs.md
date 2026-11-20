# Bugs Log

Record confirmed bugs, root causes, and resolutions.

| ID      | Summary                                                              | Root Cause                                                                                                                     | Resolution                                                                                  | Status |
| ------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | ------ |
| BUG-001 | `apps/api-nest` TypeORM failed typecheck with `sqlite` driver option | TypeORM v1 removed the legacy `sqlite` driver union in favor of `better-sqlite3`                                               | Switched to `better-sqlite3` and added `"types": ["node"]` to `apps/api-nest/tsconfig.json` | Fixed  |
| BUG-002 | `tools/verify-template.ts` flagged non-deprecated packages           | `bun pm view <pkg> deprecated --json` returns `{ "error": "Property not found" }` JSON object when a package is not deprecated | Parsed JSON response and only treated non-empty string deprecation messages as deprecated   | Fixed  |
