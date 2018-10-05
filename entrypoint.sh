#!/usr/bin/env bash
set -Eeo pipefail

file_env() {
	local var="$1"
	local fileVar="${var}_FILE"
	local def="${2:-}"
	if [ "${!var:-}" ] && [ "${!fileVar:-}" ]; then
		echo >&2 "error: both $var and $fileVar are set (but are exclusive)"
		exit 1
	fi
	local val="$def"
	if [ "${!var:-}" ]; then
		val="${!var}"
	elif [ "${!fileVar:-}" ]; then
		val="$(< "${!fileVar}")"
	fi
	export "$var"="$val"
	unset "$fileVar"
}

file_env 'NODE_ENV' 'production'
file_env 'TRUST_PROXY' 'true'
file_env 'URL' 'http://localhost'

cat >/usr/src/app/.env <<EOL
NODE_ENV=$NODE_ENV
PORT=8337
TRUST_PROXY=$TRUST_PROXY
URL=$URL
EOL

exec "$@"