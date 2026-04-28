#!/bin/sh
set -e

echo "Waiting for database and applying migrations..."
until npx prisma migrate deploy; do
  echo "Database not ready yet, retrying in 3 seconds..."
  sleep 3
done

echo "Starting API..."
node src/server.js
