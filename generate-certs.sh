#!/bin/bash
set -euo pipefail

# Generate a self-signed certificate and key
openssl req -new -text -passout pass:abcd -subj /CN=localhost -out server.req -keyout privkey.pem
openssl rsa -in privkey.pem -passin pass:abcd -out server.key
openssl req -x509 -in server.req -text -key server.key -out server.crt

# Set proper permissions
chmod 600 ./server.key
# Linux users need to set the correct ownership (999 is the postgres user in the container)
test $(uname -s) = Linux && chown 999 ./server.key
