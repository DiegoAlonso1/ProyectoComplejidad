<img src="https://estudiaperu.pe/wp-content/uploads/2021/04/UPC-carreras-para-gente-que-trabaja.png" width="500">

<br />

# **Complejidad Algorítmica**


### **Trabajo Final**
<br/>

### **Docente:**
Luis Martin Canaval Sánchez
<br/><br/>

### **Integrantes:**

- Diego Alonso Olivera Barrantes (u201914246)
- Elizabeth Adriana Nina Gutiérrez (u201920247)
- Manuel Alonso Aranguri Vargas (u201911572)
<br/>

### **Sección:** 
CC41

<br />

---
<br />

## **Índice**
- [Resumen ejecutivo](#resumen)
- [Área elegida](#area-el)
- [Descripción de datos consignados por calle](#datos-calle)
- [Descripción de datos consignados por intersección](#datos-inters)
- [Explicación de la elaboración del grafo](#desc-grafo)

<br />

## **Resumen ejecutivo**<a id="resumen"></a>
Este proyecto tiene como objetivo realizar un grafo mediante una lista de adyacencia con información real de las intersecciones de las calles y avenidas de algún lugar real. Esto con la intención de aplicar algoritmos de recorrido de grafos que permitan encontrar el camino más eficiente para llegar desde un punto de origen hasta un punto de destino teniendo en cuenta factores como distancia, congestión vehicular, máxima velocidad permitida por carretera, entre otros. 
<br /><br />

## **Área elegida**<a id="area-el"></a>
Para escoger el área donde recolectar la información se tuvo que buscar una que cumpliera algunos requisitos. Entre estos se encuentran que debe tener como mínimo 1 millón de habitantes y que tenga una sección que ronda las 1500 cuadras como mínimo. En este caso nuestro grupo escogió la ciudad de Lima, la cual supera los requisitos mínimos, llegando a tener más de  9 millones de habitantes.

<img src="https://elcomercio.pe/resizer/CqiDKlSbc402j9nXEqh7ZiCmk9c=/580x330/smart/filters:format(jpeg):quality(75)/arc-anglerfish-arc2-prod-elcomercio.s3.amazonaws.com/public/X36P5UQUJRCTNFFKQAM7KXWOCY.jpg" width="500px">
<br /><br />

## **Descripción de datos consignados por calle**<a id="datos-calle"></a>
Los datos consignados por calle están adjuntados como un archivo llamado “Lima-calles.csv”. En este archivo podemos encontrar la información de todas las calles de Lima donde los datos de cada calle están separados por filas. De cada calle se presentan 3 datos: el ID de la calle, el nombre de la calle y la cantidad de intersecciones que contiene esa calle.

<img src="./images/datos-calles.PNG" width="200px">
<br /><br />

## **Descripción de datos consignados por intersección**<a id="datos-inters"></a>
Los datos consignados por calle están adjuntados como un archivo llamado “Lima-intersecciones.csv”. En este archivo podemos encontrar la información de todas las intersecciones de las calles de Lima donde los datos de cada intersección están separados por filas. De cada intersección se presentan 15 datos: el ID del registro, el ID de la calle, los IDs de origen y destino de la intersección, el origen y destino de la intersección, la distancia en Km, la velocidad en Km/h, el costo, el costo inverso y las coordenadas de la intersección.

<img src="./images/datos-intersecciones.PNG" width="700px">
<br /><br />

## **Explicación de la elaboración del grafo**<a id="desc-grafo"></a>
Para la elaboración del grafo se usó una lista de adyacencia la cual se adjunta como un archivo llamado “Lima-lista_adyacencia.txt”. Para construir esta lista, primero se tuvo que recolectar los datos de las rutas e intersecciones de la ciudad elegida. Para ello, tuvimos que acudir a una herramienta externa, la cual nos generó una base de datos con la información que se necesitaba. Luego exportamos la base de datos en formato csv. Finalmente, con ayuda de python realizamos un algoritmo que lee el archivo de la base de datos y con los IDs de las calles de origen y destino genera la lista de adyacencia. El formato con el que hemos trabajado para la lista de adyacencia es indicar el ID de la calle de origen y a continuación se coloca 2 puntos y todas las calles con las que se intersecta (calles destino). 
Implementamos el siguiente algoritmo para obtener la lista de adyacencia que usaremos para construir nuestro grafo.
<br />

<img src="./images/elaboracion-grafo.PNG" width="700px">

<br />
Dando como resultado lo siguiente:

<br />

<img src="./images/elaboracion-grafo2.PNG" width="700px">
