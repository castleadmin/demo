BODY="{ \
  \"name\": \"adventials\", \
  \"gitSource\": { \
    \"type\": \"github\", \
    \"org\": \"castleadmin\", \
    \"repo\": \"castleadmin\", \
    \"ref\": \"$BRANCH\" \
  }, \
  \"target\": \"production\", \
  \"installCommand\": \"npm ci\", \
  \"buildCommand\": \"npx nx build adventials -c production\", \
  \"outputDirectory\": \"dist/apps/adventials/.next\" \
}"

curl -X POST "https://api.vercel.com/v13/deployments" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$BODY"
