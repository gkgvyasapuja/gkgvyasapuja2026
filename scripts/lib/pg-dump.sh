#!/usr/bin/env bash
# Resolve pg_dump binary. Client major version must be >= server major version.
#
# Override: export PG_DUMP=/path/to/pg_dump
# macOS (Homebrew): brew install postgresql@16

resolve_pg_dump() {
  if [[ -n "${PG_DUMP:-}" && -x "$PG_DUMP" ]]; then
    printf '%s\n' "$PG_DUMP"
    return 0
  fi

  local candidate
  for candidate in \
    /opt/homebrew/opt/postgresql@17/bin/pg_dump \
    /opt/homebrew/opt/postgresql@16/bin/pg_dump \
    /usr/local/opt/postgresql@17/bin/pg_dump \
    /usr/local/opt/postgresql@16/bin/pg_dump \
    "$(command -v pg_dump 2>/dev/null || true)"; do
    if [[ -n "$candidate" && -x "$candidate" ]]; then
      printf '%s\n' "$candidate"
      return 0
    fi
  done

  echo "Error: pg_dump not found." >&2
  echo "Install PostgreSQL 16+ client tools, e.g.:" >&2
  echo "  brew install postgresql@16" >&2
  echo "Then either add it to PATH or set PG_DUMP in .env:" >&2
  echo "  PG_DUMP=/opt/homebrew/opt/postgresql@16/bin/pg_dump" >&2
  return 1
}

pg_dump_version_hint() {
  local bin="$1"
  local version
  version="$("$bin" --version 2>/dev/null || true)"
  echo "Using $bin ($version)"
}
