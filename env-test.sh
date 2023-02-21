#!/bin/bash

npx nx run-many --all --target=extract-graphql --configuration=test \
&& npx nx run-many --all --target=merge-graphql --configuration=test \
&& npx nx run-many --all --target=terraform-init-infrastructure --configuration=test \
&& rm -f .env.local && npx nx run-many --all --target=terraform-to-env-infrastructure --configuration=test \
&& npx nx run-many --all --target=terraform-init --configuration=test \
&& npx nx run-many --all --target=terraform-to-env --configuration=test
