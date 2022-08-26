#!/usr/bin/env bash

# TODO: install genhtml

projectFile=${1}

projectFileSourceRoot=$(cat ${projectFile} | jq '.sourceRoot' | tr -d '"' )

subProjectName=$(basename $(dirname ${projectFileSourceRoot}))
workspace=0
if [[ "${subProjectName}" == "." ]]; then
  subProjectName="workspace"
  workspace=1
fi

echo "USAGE: nx run <project>:<target>"
echo "e.g. nx run ${subProjectName}:help"
echo
echo "Following targets are available to run:"
cat ${projectFile} | jq '.targets | keys[]' | tr -d '\"'
