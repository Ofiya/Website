#!/bin/bash

# This is a static HTML site - serve files directly
echo "Starting static website server..."

# Create a simple HTTP server if needed, or let Azure handle static files
if [ -f "index.html" ]; then
    echo "Static website found. Ready to serve."
    exit 0
else
    echo "Error: index.html not found"
    exit 1
fi