<p align="center">
  <img src="https://github.com/NiceVani/internet/blob/main/logo.png?raw=true" alt="EasyRooms Logo" width="300px" height="300px">
</p>
<h3 align="center">
  Booking Rooms. Reservation System
</h3>

## Easy Rooms Reservation.

A final group working web application project in Internet Programming class

### Web Application

#### Start Services (Run services via Docker Container)

##### Start

```bash
docker-compose up -d
```

##### Stop

```bash
docker-compose down
```

### To Open Web Page

for Docker Container Service we set directory path deployment to `src/frontend` directory

- Port `8080`: Apache Web Server serving the EasyRoom application.
- Port `8000`: phpMyAdmin for managing the MySQL database.

Example: "Open Admin Web Page"

```base
localhost:8080/admin/index.html
```

### Architecture

```bash
easyroom-reservation/
├── docker-compose.yml
├── Dockerfile
├── index.html
├── logo.png
├── easyroom.sql
├── mysql-init/
│   └── init.sql
└── src/
    ├── frontend/
    │   └── booker/
    │   └── admin/
    │   └── executive/
    └── backend/
    │   └── booker/
    │   └── admin/
    │   └── executive/
    └── shared/
        └── booking_documents/
```

### Configuration

in `docker-compose.yml`

##### Connecting DataBase

```bash
dbname: easyroom
host: easyroomhost
user: root
password: 1234
```

##### Configure DataBase Server

```bash
MYSQL_ROOT_PASSWORD="1234"
MYSQL_DATABASE=easyroom
MYSQL_USER=easyroomteam
MYSQL_PASSWORD="1234"
```

### Installation

- **Docker:** Make sure Docker is installed on your system. You can download it from [here](https://www.docker.com/get-started).
