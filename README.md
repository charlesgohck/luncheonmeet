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

## Create the local database
Change directory to the root of the project and create an ENV file. Add these two variables inside:
```vim
DOCKER_POSTGRES_PASSWORD=enteryourpsaswordhere
DOCKER_POSTGRES_DB=luncheonmeet
```
Create the detached docker container with the postgres db, linked to a volume.
```bash
docker-compose up -d
```
Connect to the database using Datagrip or pgAdmin4.

## Setting up environment variables
Create a new OAuth project under the Google Cloud console app. Get the google auth client id and client secret.

Set up the environment variables in the .env file. It should look something like this:
```vim
NODE_ENV=development
DB_HOST=localhost
DB_USERNAME=postgres
DB_PASSWORD=enteryourpasswordhere
DB_PORT=5432
DB_DATABASE=luncheonmeet
DB_CA_CERT=PLACEHOLDER_DONT_NEED_IN_DEVELOPMENT

AUTH_GOOGLE_SECRET=YOUR_GOOGLE_AUTH_PROJECT_SECRET
AUTH_SECRET=YOUR_GENERATED_PASSWORD
AUTH_GOOGLE_ID=YOUT_GOOGLE_AUTH_PROJECT_CLIENT_ID
AUTH_URL=http://localhost:3000
TZ=GMT

DOCKER_POSTGRES_PASSWORD=enteryourpsaswordhere
DOCKER_POSTGRES_DB=luncheonmeet
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

## Production: Digital Ocean
- Head over to Digital Ocean and create a new app under App Platform. 
- Enter the required production environment variables and encrypt the ones that are sensitive. 
- Create a managed database. The root user will be doadmin.
- Create a new read/write user on the Digital Ocean Managed Database dashboard.
- Edit the init.sql script by replacing ```postgres``` with ```doadmin```.
- It is recommended you ban all traffic to the database by default and whitelist only your static ip (if you have one) and your app platform app.
- Connect to the DB using pgAdmin4 or Datagrip. 
- Create the luncheonmeet DB and create the dbo schema under it.
- Run the init.sql script on the luncheonmeet.dbo schema
- Download the DB CA Cert from the managed DB dashboard and copy its content from BEGIN CERTIFICATE to END CERTIFICATE to an encrypted environment variable for app platform named ```DB_CA_CERT```. This will be copied into the build when the project is started.

## Production: Vercel
A similar process is used for launching the app to production on Vercel. However, you cannot whitelist Vercel IP Addresses unless you are on the Enterprise Plan. 

## Problems and Solutions
### docker-compose.yml POSTGRES_USER not postgres causes build to fail
I believe this is because POSTGRES_USER needs to be the root user which is postgres. Any other users can be created on the SQL command side later. So use ```postgres``` as the user. 