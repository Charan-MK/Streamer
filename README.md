# Streamer

A video streaming application which can stream videos to a web browser from a storage service and from a database storage.

A user can view videos which are stored in database and the storage service [current implementation of the app supports only streaming videos which are stored in the local storage i.e., device storage]

The app provides BASIC Authentication to the users, and a user with Admin privilege can upload videos to the storage service and database. Video upload limit for storage service is 100MB and for database it is limited to 15MB.

## Node JS Project Structure
<table>
    <thead>
        <tr>
            <th>Folder name</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>public</code></td>
            <td>Folder **public** contains app icon and style<td>
        </tr>
        <tr>
            <td><code>src</code></td>
            <td>Folder **src** contains directories controller, db, middlewares, and routes<td>
        </tr>
        <tr>
            <td><code>controllers</code></td>
            <td>Folder **controllers** contains bsiness logic for handing routes<td>
        </tr>
        <tr>
            <td><code>db</code></td>
            <td>Folder **db** contains database connectivity and data models for videos and users<td>
        </tr>
        <tr>
            <td><code>middlewares</code></td>
            <td>Folder **middlewares** contains configurations of multer and user authentication and authorization<td>
        </tr>
        <tr>
            <td><code>routes</code></td>
            <td>Folder **routes** contains routes of the application<td>
        </tr>
        <tr>
            <td><code>views</code></td>
            <td>Folder **views** contains app views for UI<td>
        </tr>
    </tbody>
</table>

## Requirements
For development, Node.js needs to be installed on your operating system and should have a MongoDB instance to be configured.

### Installations
- #### Node installation on windows
1. Download the installer from official Node.js website: https://nodejs.org/en

- #### MongoDB installation on windows
1. Go to official MongoDB website: https://www.mongodb.com/
2. Navigate to Products -> Community Edition
3. Select appropriate package from Select package dropdown and install the application

## Dependencies
Before you run the app, install the project dependencies by running the following command:
```bash
$ npm install
```

## Running the project
- to run the app
```bash
$ npm start
```
- to run the app in dev mode, which starts the server with nodemon
```bash
$ npm run dev
```
- to check for linting errors
```bash
$ npm run lint
```
## Environment variables required to run the app

<table>
    <tr>
        <th>Variable</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>PORT</td>
        <td>Port to run the application</td>
    </tr>
    <tr>
        <td>MONGOBD_URL</td>
        <td>MongoDB database host URL</td>
    </tr>
    <tr>
        <td>ADMIN_EMAIL</td>
        <td>Email of the user to which Admin previleges are required</td>
    </tr>
    <tr>
        <td>COOKIE_SECRET</td>
        <td>A secret of yours to create secure session for users</td>
    </tr>
</table>
