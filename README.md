# team-9

## Run database
```bash
docker run --name yat-db --detach -p 5432:5432 -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -e -d postgres:16
```

## Run formatters
```bash
black --color .
```

```bash
flake8 .
```

## Run tests
```bash
cd yat
python manage.py test
```

## Run all
```bash
cd yat
python manage.py runserver
```
In another terminal:
```bash
cd yat-ui
npm start
```