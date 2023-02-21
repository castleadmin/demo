const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs } = require('@graphql-tools/merge');
const fs = require('fs');
const { print } = require('graphql');
const path = require('path');

const typesArray = loadFilesSync(path.join(__dirname, 'graphql-schemas'), {
  recursive: true,
});

const mergedSchema = mergeTypeDefs(typesArray);

fs.writeFileSync(
  path.join(__dirname, 'schema.api.graphql'),
  print(mergedSchema)
);
