#!/bin/bash

STAGED_FILES="$(git diff --staged --name-only --diff-filter=d)"

npm run format:affected \
&& npm run lint:workspace \
&& npm run lint:affected \
&& npm run test:affected \
&& npm run build:affected \
&& echo "$STAGED_FILES" | xargs git add
