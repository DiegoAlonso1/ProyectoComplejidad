import psycopg2

class DB_API:
    # constants
    NONE = 0
    ID = 1
    STREET_ID = 10
    STREET_NAME = 100
    SOURCE_ID = 1000
    TARGET_ID = 10000
    DISTANCE = 100000
    MAX_SPEED = 1000000
    COST = 10000000
    REVERSE_COST = 100000000
    SOURCE_LONGITUDE = 1000000000
    SOURCE_LATITUDE = 10000000000
    TARGET_LONGITUDE = 10000000000
    TARGET_LATITUDE = 100000000000

    def __init__(self):
        self.initDbConnection()

    def initDbConnection(self):
        self.connection = psycopg2.connect(
            host="bwmc2spjnkl3asahsdwf-postgresql.services.clever-cloud.com", 
            database="bwmc2spjnkl3asahsdwf", 
            user="ui9vqx1cbdowhfoap3dq", 
            password="9wNAizIxMMQtBryr1tOZ")
        self.cur = self.connection.cursor()

    def endDbConnection(self):
        self.cur.close()
        self.connection.close()

    def __generateQueryByFlags(self, flags):
        cFlags = str(flags)
        n = len(cFlags)

        flagsForQuery = ''

        index = -1
        while index > -n - 1:
            if cFlags[index] == '1':
                flagVal = pow(10, abs(index) - 1)
                if flagVal == self.ID:
                    flagsForQuery += 'id'
                elif flagVal == self.STREET_ID:
                    flagsForQuery += 'osm_id'
                elif flagVal == self.STREET_NAME:
                    flagsForQuery += 'osm_name'
                elif flagVal == self.SOURCE_ID:
                    flagsForQuery += 'source'
                elif flagVal == self.TARGET_ID:
                    flagsForQuery += 'target'
                elif flagVal == self.DISTANCE:
                    flagsForQuery += 'km'
                elif flagVal == self.MAX_SPEED:
                    flagsForQuery += 'kmh'
                elif flagVal == self.COST:
                    flagsForQuery += 'cost'
                elif flagVal == self.REVERSE_COST:
                    flagsForQuery += 'reverse_cost'
                elif flagVal == self.SOURCE_LONGITUDE:
                    flagsForQuery += 'x1'
                elif flagVal == self.SOURCE_LATITUDE:
                    flagsForQuery += 'y1'
                elif flagVal == self.TARGET_LONGITUDE:
                    flagsForQuery += 'x2'
                elif flagVal == self.TARGET_LATITUDE:
                    flagsForQuery += 'y2'
                else:
                    continue
                flagsForQuery += '' if index == -n else ','
            index -= 1

        return flagsForQuery
    
    # getIntersectionBySourceAndTarget
    def getIntersectionBySourceAndTarget(self, source, target, flags=None):
        if not flags or flags == self.NONE:
            print('nada')
            return []

        flagsForQuery = self.__generateQueryByFlags(flags)

        query=f"SELECT {flagsForQuery} FROM \"hh_2po_4pgr\" WHERE source="+str(source)+" and target="+str(target)
  
        try:
            self.cur.execute(query)
        except Exception as e:
            self.connection.commit()
            print(e)
            return []
        
        rows = self.cur.fetchall()
        return rows[0]
    
    # getIntersectionsBySourceId
    def getIntersectionsBySourceId(self, source, flags=None):
        if not flags or flags == self.NONE:
            print('nada')
            return []

        flagsForQuery = self.__generateQueryByFlags(flags)

        query=f"SELECT {flagsForQuery} FROM \"hh_2po_4pgr\" WHERE source="+str(source)
  
        try:
            self.cur.execute(query)
        except Exception as e:
            self.connection.commit()
            print(e)
            return []
        
        rows = self.cur.fetchall()
        return rows
    
    # getIntersections
    def getIntersections(self, flags=None):
        if not flags or flags == self.NONE:
            print('nada')
            return []

        flagsForQuery = self.__generateQueryByFlags(flags)

        query=f"SELECT {flagsForQuery} FROM \"hh_2po_4pgr\""
  
        try:
            self.cur.execute(query)
        except Exception as e:
            self.connection.commit()
            print(e)
            return []
        
        rows = self.cur.fetchall()
        return rows

    # custom query
    def customQuery(self, query):
        try:
            self.cur.execute(query)
        except Exception as e:
            self.connection.commit()
            print(e)
            return []
        
        rows = self.cur.fetchall()
        return rows