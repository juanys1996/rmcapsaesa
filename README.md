# Saesa RMCap

- Angular 8
- Angular CLI 8.0.6
- Nodejs 12.11.1
- npm 6.11.3

## Configuración

- Configurar la dirección del backend en src/assets/config/config.json:
```
{
    "backend": {
        "host": "ip donde esta saesa-rmcapBack",
        "port": "puerto (por defecto 8082)"
    }
}
```

## Ambiente local

- Instalar las dependencias del proyecto:
```
$ npm ci
```

- Levantar el proyecto con:
```
$ ng serve --open
```

## Deploy

- Generar paquete entregable con:
```
$ ng build --prod --base-href /saesa-rmcap/
```

- Cambiar en el index.html dentro de dist/saesa-rmcapFront/ el tag "base" a:
```
<base href="/saesa-rmcap/">
```

- Cambiar valores de dist/assets/config/config.json por valores de ejemplo 
(ej.: "host": "IP")

- Renombrar carpeta dist/saesa-rmcapFront/ a saesa-rmcap y copiarla a 
webapps/ del Tomcat

### Tomcat

- Dentro de la carpeta donde esta instalado el Tomcat ir al archivo 
conf/web.xml, luego dentro del tag "webapp" poner:
```
<error-page>
    <error-code>404</error-code>
    <location>/index.html</location>
</error-page>
```

- Para levantar el Tomcat se puede correr el archivo bin/startup.bat, 
o se lo puede configurar como un servicio de windows y correrlo desde ahí.

## git workflow

### feature/fix
Por cada feature/fix que se desarrolle se crea una nueva rama desde develop. 
Una vez llegado a un punto deseado y estable se hace un merge a develop.

- Asegurarse de hacer el merge con --no-ff para generar el commit 
  del merge

- Una vez terminado el desarrollo eliminar la rama

### develop
Es la rama con todo el trabajo más actual y donde se van a mergear todos 
los ultimos cambios. Cuando se llega a un punto deseado y estable 
se hace un merge a master.

- Asegurarse de hacer el merge con --no-ff para generar el commit 
del merge

### master
Es la rama que solo va a tener las versiones estables que se vayan 
deployando. Cada vez que se hace un merge a master hay que taggear 
el commit con la version correspondiente.

- Asegurarse de hacer el merge con --no-ff para generar el commit 
del merge

## Versioning

[Semantic Versioning 2.0.0](https://semver.org/)

**x.y.z (hasta public release)**

- **x:** 0 hasta public release
- **y:** numero de demo
- **z:** deploy


