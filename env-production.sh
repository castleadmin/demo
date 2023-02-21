#!/bin/bash

npx nx run-many --all --target=extract-graphql --configuration=production \
&& npx nx run-many --all --target=merge-graphql --configuration=production \
&& npx nx run-many --all --target=terraform-init-infrastructure --configuration=production \
&& rm -f .env.local && npx nx run-many --all --target=terraform-to-env-infrastructure --configuration=production \
&& npx nx run-many --all --target=terraform-init --configuration=production \
&& npx nx run-many --all --target=terraform-to-env --configuration=production
