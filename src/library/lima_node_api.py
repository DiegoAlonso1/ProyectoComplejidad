# Funcion que calcula el peso de una ruta por hora
# el cost se saca directamente de la base de datos, pero la función sería cost = distancia/velocidad, solo que ya obtenemos el costo precalculado en la base de datos
def getWeightByHour(cost, hour):
    hourFactor=[0.5833333,1,6.8,12.6,18.4,24.2,30,26,22,18,14,10,9.25,8.5,7.75,7,12.75,18.5,24.25,30,25.16666667,20.333333,15.5,10.6666667]
    return cost * hourFactor[hour]
    
# Funcion que convierte una hora a formato HH:MM:SS
def convertDecimalToHourMinute(time):
    hours = int(time)
    minutes = int((time*60) % 60)
    seconds = int((time*3600) % 60)
    milisecond = 0
    if (hours==0) and (minutes==0) and (seconds ==0):
        milisecond=(time*3600) % 60

    timeFormat=[hours, minutes, seconds, milisecond]
    return timeFormat