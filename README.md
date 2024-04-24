# YAT
*Yet Another Tracker*\
With this application you can track your habits and evaluate your progress. Furthermore, you can create and control your day using tasks and notes.

# Run
***Docker is required! ([install](https://docs.docker.com/engine/install/))***
## Run With Docker
Uses nginx to serve the built react app and a django server to handle the backend.
### Environment Variables
Create a `.env` file in the root directory, use the `.env.template` file as a template. (For `POSTGRES_HOST` use `host.docker.internal` if your database is running on the same machine alongside the backend).
Do not forget to edit `postgresql.env` file if you need to change the database credentials.

```shell
docker-compose up
```
Go to http://localhost:80 to see the UI.

To see emails sent by the server, use:
```shell
docker cp team-9-backend-1:backend/sent_emails .
```
And view all emails in the `sent_emails` directory.

# dev

## Run database
```shell
docker run --name yat-db --detach -p 5432:5432 -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -e -d postgres:16
```

## Install dependencies
```shell
pip install -r requirements/dev.txt
```

## Run formatters
```shell
black --color .
```

```shell
flake8 .
```

## Run tests
```shell
cd yat
python manage.py test
```

You can also see coverage by running:
```shell
cd yat
coverage run .\manage.py test
coverage report
```

## Run all
```shell
cd yat
python manage.py runserver
```
In another terminal:
```shell
cd yat-ui
npm install
npm start
```