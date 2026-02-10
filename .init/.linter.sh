#!/bin/bash
cd /home/kavia/workspace/code-generation/engineering-solutions-showcase-235338-235347/corporate_website_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

