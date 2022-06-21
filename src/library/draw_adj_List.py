# Inspirado en la función del repositorio del profe :)

import graphviz as gv

def adjlShow(L, labels=None, directed=False, weighted=False, path=[],
             simplepath=True,
             layout="sfdp"):
  g = gv.Digraph("G") if directed else gv.Graph("G")
  g.graph_attr["layout"] = layout
  g.edge_attr["color"] = "gray"
  g.node_attr["color"] = "orangered"
  g.node_attr["width"] = "0.1"
  g.node_attr["height"] = "0.1"
  g.node_attr["fontsize"] = "8"
  g.node_attr["fontcolor"] = "mediumslateblue"
  g.node_attr["fontname"] = "monospace"
  g.edge_attr["fontsize"] = "8"
  g.edge_attr["fontname"] = "monospace"

  keys = [*L.keys()]
  n = len(keys)

  for u in range(n):
    g.node(str(keys[u]), labels[keys[u]] if labels else str(keys[u]))
  added = set()
  path = enumerate(path) if simplepath else path

  #unsupported:
  for v, u in path:
    if u != -1:
      if weighted:
        for vi, w in L[u]:
          if vi == v:
            break
        g.edge(str(u), str(v), str(w), dir="forward", penwidth="2", color="orange")
      else:
        g.edge(str(u), str(v), dir="forward", penwidth="2", color="orange")
      added.add(f"{u},{v}")
      added.add(f"{v},{u}")
  #unsupported:
  if weighted:
    for u in range(n):
      for v, w in L[u]:
        if not directed and not f"{u},{v}" in added:
          added.add(f"{u},{v}")
          added.add(f"{v},{u}")
          g.edge(str(u), str(v), str(w))
        elif directed:
          g.edge(str(u), str(v), str(w))
  else:
    for u in range(n):
      for v in L[keys[u]]:
        if not directed and not f"{keys[u]},{v}" in added:
          added.add(f"{keys[u]},{v}")
          added.add(f"{v},{keys[u]}")
          g.edge(str(keys[u]), str(v))
        elif directed:
          g.edge(str(keys[u]), str(v))
  return g