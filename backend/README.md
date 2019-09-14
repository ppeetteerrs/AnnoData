## Overview
This module is the Server code for the MOSCATO Project. The UI is written in typescript and uses Express and MongoDB.

### Setup
- Run `npm install` or `yarn install`

### Run
#### Development Mode
- Run `yarn start` and `yarn start:db` in the `./server` directory for live-reloading
#### Production Mode
- Run `pm2 start ecosystem.config.js` in the project root directory (whether it works depends on the operating system setup, if it does not work, please manually run the commands in CLI or tmux) [This will start frontend, server and database]

### Folder Structure
- `src/`
  - `db/`: Mongoose Schemas and database wrapper
  - `util/`: Simple utility functions
  - `config.ts`: Configuration file for Server (currenly only contains MongoDB credentials and server HOST + PORT), should not be committed (sample format in config.sample.ts)
  - `server.ts`: Barebone Express Server
- `dist/`: output from typescript compiler, should not be changed or committed
- `dbConfig.yml`: MongoDB settings, change to customize DB settings
