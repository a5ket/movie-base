# movie-base

Simple backend API for managing movies and actors using Node.js, Express, Sequelize, and SQLite.


## Setup

### Environment Variables

- APP_PORT (required) — port for the server to listen on (e.g., 8050)  
- JWT_SECRET (optional) — secret key for JWT authentication  

### Without Docker

1. Clone the repo:

```bash
git clone git@github.com:A5KET/movie-base.git  
cd movie-base
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

4. Run migrations:

```bash
npm run migrate
```

5. Set environment variables and start the server:

```bash
export APP_PORT=8050  
export JWT_SECRET=your_jwt_secret_here # optional  
npm start
```

### Using Docker

Build the Docker image:

```bash
docker build -t movies .
```

Run the container with environment variables:

```bash
docker run -p 8050:8050 -e APP_PORT=8050 -e JWT_SECRET=your_jwt_secret_here movies
```
