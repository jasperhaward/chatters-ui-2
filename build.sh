echo "Installing dependencies..."
npm ci

echo "Building static files"
npm run build

# get version from package.json
version=$(cat package.json | grep -o '"version": "[^"]*' | grep -o '[^"]*$')
echo "Building docker image version '$version'"

tag_latest="jasperhaward/chatters-ui:latest"
tag_versioned="jasperhaward/chatters-ui:$version"

echo "Building docker image with tags: '$tag_latest', '$tag_versioned'"
docker build . -t "$tag_latest" -t "$tag_versioned"

echo "Pushing docker image '$tag_latest'"
docker push "$tag_latest"

echo "Pushing docker image '$tag_versioned'"
docker push "$tag_versioned"