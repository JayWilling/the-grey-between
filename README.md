# The Grey Between

## Dev Environment Setup

The Grey Between is a web application running:
- React Frontend
- Mongo DB database
- Node Backend Server

To get the full project up and running you will want to do the following (We will run under the assumption that everything necessary for the above is already installed along with VS Code):
1. Navigate to the `/website` directory in the project.
2. Run `npm run start`. The Frontend should now be running on `http://localhost:3000`

To get the server running
1. Open up an additional terminal or VS Code workspace
2. Navigate to the `/server` directory in the project.
3. Run `npm start`. The backend Node server should now be running on `port: 5000`

There is a serverless demo currently running through github pages.

## Commit Conventions
When working on any issues, make sure that ALL commits are tagged with the related issue ID. For example:

`[GREY-55] Updated README`

## Working with Jira

- All new issues should be added added under the `TO DO` column.
- Any new ideas, features or expansions on existing tasks are to be added under the `Ideas` column.
- Move `Ideas` into `TO DO` once a detailed description, task list and testing steps have been added.

Moving forward, each step in the process should have automated checklists so that we can put the pen down and take a break whenever we need to. If you see a way to make a process cleaner and more efficient you can:
- Add automations
- Define card templates
- Branch and create merge requests (This will be necessary as we introduce new features).