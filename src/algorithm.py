import json
import random as r
import math
import heapq as hq
import numpy as np
from library.database_api import DB_API

def getWeightByHour(cost, hour):
    hourFactor=[0.5833333,1,6.8,12.6,18.4,24.2,30,26,22,18,14,10,9.25,8.5,7.75,7,12.75,18.5,24.25,30,25.16666667,20.333333,15.5,10.6666667]
    return cost * hourFactor[hour]

def myGraphCoords():
  dbApi = DB_API()
  query = 'SELECT source, table1.x1, table1.y1 FROM hh_2po_4pgr table1 union SELECT target, table2.x2, table2.y2 FROM hh_2po_4pgr table2'
  rows = dbApi.customQuery(query)
  nodes_coords = []
  nodes_coords.append((-12.0459308, -77.0427831))

  for row in rows:
      nodes_coords.append((row[2], row[1]))
      
  dbApi.endDbConnection()
  return nodes_coords

def myGraphNodes():
  dbApi = DB_API()
  flags = DB_API.SOURCE_ID + DB_API.TARGET_ID + DB_API.COST
  rows = dbApi.getIntersections(flags)
  sources_targets = [[] for _ in range(96510)]

  for src, target, cost in rows:
      sources_targets[src].append((target, cost))

  dbApi.endDbConnection()
  return sources_targets

def bfs(G, s):
  n = len(G)
  visited = [False]*n
  path = [-1]*n # parent
  queue = [s]
  visited[s] = True

  while queue:
    u = queue.pop(0)
    for v, _ in G[u]:
      if not visited[v]:
        visited[v] = True
        path[v] = u
        queue.append(v)

  return path

def dfs(G, s):
  n = len(G)
  path = [-1]*n
  visited = [False]*n
  
  stack = [s]
  while stack:
    u = stack.pop()
    if not visited[u]:
      visited[u] = True
      for v, _ in G[u]:
        if not visited[v]:
          path[v] = u
          stack.append(v)

  return path

def dijkstra(G, s, hour=1):
    n = len(G)
    visited = [False]*n
    path = [-1]*n
    cost = [math.inf]*n

    cost[s] = 0
    pqueue = [(0, s)]
    while pqueue:
        g, u = hq.heappop(pqueue)
        if not visited[u]:
            visited[u] = True
            for v, w in G[u]:
                w = getWeightByHour(w, hour)
                if not visited[v]:
                    f = g + w
                    if f < cost[v]:
                        cost[v] = f
                        path[v] = u
                        hq.heappush(pqueue, (f, v))

    return path, cost

# G, Loc = transformGraph()
G = myGraphNodes()
Loc = myGraphCoords()

def graph():
    return json.dumps({"loc": Loc, "g": G})


def paths(s, t, hour):
    bestpath, _ = dijkstra(G, s, 1)
    path1 = bfs(G, s)
    path2 = dfs(G, s)

    return json.dumps({"bestpath": bestpath, "path1": path1, "path2": path2})
    # return json.dumps({"bestpath": bestpath, "path1": path1})
