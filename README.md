# CraftBrewManager_Group7

# README

## Introduction

Local Application for a Database for Craft Brewery Manager

## Requirements

This code has been run and tested on:

- Express - 4.18.2
- PostgreSQL - 13.3
- Nodejs - v16.9.1
- Windows 10

## External Deps

- pgAdmin 4 - https://www.pgadmin.org
- Git - Download latest version at https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
- GitHub Desktop (Not needed, but HELPFUL) at https://desktop.github.com/

# Pre-requisites

## Installing PostgresSQL

Please go to https://www.postgresql.org/download/ and download the most recent version for the desired platform.
Once downloaded, follow the Download Wizard to complete the process.

For the purposes of this project, the port the database will be set on will be the default {PORT : 5432}.

## Installing Node.js

Please go to https://nodejs.dev/en/download/ and download the most recent stable version for the desired platform.
once downloaded, in the terminal, the term `node` will be accessible.

## Installing Express

Assuming Node.js is installed, create a directory to hold the application, and make that the working directory.

`$ mkdir myapp`
`$ cd myapp`
Use the npm init command to create a package.json file for the application. For more information on how package.json works, see Specifics of npm’s package.json handling.

`$ npm init`
This command prompts for a number of things, such as the name and version of the application. For DEFAULT, simply hit RETURN.

Now install Express in the myapp directory and save it in the dependencies list. For example:

`$ npm install express`

## Installation

Download this code repository by using git:

`git clone https://github.com/Summer23-CSCE-310-Database-Systems/CraftBrewManager_Group7.git`

## Execute Code and Run the app

Run the following code in Powershell if using windows or the terminal using Linux/Mac

`cd CraftBrewManager_Group7`

`node index.js {dbname} {password} `

dbname - refers to the desired database.

password - the password to access said database.

The application can be seen using a browser and navigating to http://localhost:5000/

### Getting Started

1. To establish the connection to the database, click the "Connect" button.
For the purposes of this project, this also resets the database to allow for a constant testing experience.
Please connect to the database before attempting to access data.

2. At any time, disconnection from the database by clicking the "Disconnect" button.

3. To reconnect to the database after disconnecting, relaunch the application.

4. Once connected, the server will auto-populate the necessary databases and their relevant informations.

5. From here, it is now possible to access different pages and utilize their CRUD features.

## Support

The support of this app is currently under development and there are small changes left to reach it's final version. The future goals of this application:

- Cloud-based deployment
- TBD
