# Getting Started
## Pre-requisites
- Node version manager with latest LTS version of node
- For Windows Users, install Windows Subsystem Linux 2
- For Windows Users, download Docker Desktop and install it with WSL 2 

## Clone the Project
Change to WSL using the command below for windows or use the unix based terminal on Mac
```bash
wsl
```
Fork the repository (or use this one) on Github. Then head over to the Github repository settings or Github settings and create a new SSH key or deploy key: https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent

Add your SSH private key location to the SSH config as an identity:
```bash
vim ~/.ssh/config
```
```vim
IdentityFile pathtoprivatekeyfile
IdentityFile pathtoanotherprivatekeyfile
```
Clone the repository
```bash
git clone git@github.com:charlesgohck/luncheonmeet.git
```

## Setting up environment variables
Create a new OAuth project under the Google Cloud console app. Get the google auth client id and client secret.

Set up the environment variables in the .env file. It should look something like this:
```vim
NODE_ENV=development
POSTGRES_HOST=localhost
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=enteryourpasswordhere
POSTGRES_PORT=5432
POSTGRES_DATABASE=luncheonmeet

AUTH_GOOGLE_SECRET=YOUR_GOOGLE_AUTH_PROJECT_SECRET
AUTH_SECRET=YOUR_GENERATED_PASSWORD
AUTH_GOOGLE_ID=YOUT_GOOGLE_AUTH_PROJECT_CLIENT_ID
AUTH_URL=http://localhost:3000
TZ=GMT
```

## Development
Install the npm dependencies using the following command:
```bash
npm install
```
Run the project for development
```bash
npm run dev
```

## Production: Vercel
1. Host project on Vercel Hobby
2. Create a Neon Postgres Free Plan Postgres DB
3. Hook up the environment variables