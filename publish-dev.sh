# /bin/sh

npm unpublish --force --registry http://localhost:4873/
npm version prerelease --preid=alpha  --no-git-tag-version
npm publish --registry http://localhost:4873/

cd /Users/baibonjwa/gg/ghost_go_app && yarn up ghostban