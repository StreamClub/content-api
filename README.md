# content-api

[![codecov](https://codecov.io/gh/StreamClub/content-api/graph/badge.svg?token=is8WGD9XcA)](https://codecov.io/gh/StreamClub/content-api)

Para correr ejecutar:

```
sudo docker compose up --no-attach mongo
```

Para matarlo ejecutar el siguiente comando:

```
sudo docker ps
```

De ahi tomar el CONTAINER ID de la uapi y ejecutar:

```
sudo docker kill <container id>
```

Si por algun motivo tienen que borrar todas las imagenes ejecutar:

```
sudo docker system prune -a --volumes
```

## Requisitos:

Node: v20.11.0
