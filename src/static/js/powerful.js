(async function () {
  console.log("Toda la alegría del mundo.");

  // Data
  const urlgraph = "graph";
  const graph = await d3.json(urlgraph);

  const s = Math.floor(Math.random() * graph.g.length);
  var t = Math.floor(Math.random() * graph.g.length);
  const urlpaths = `paths/${s}/${t}`
  const paths = await d3.json(urlpaths);
  console.log('s: ' + s + ', t: ' + t);
  var excludeList = [];

  // config

  const margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  };
  const box = {
    width: 1100,
    height: 1000,
    bwidth: 1100 - margin.left - margin.right,
    bheight: 1000 - margin.top - margin.bottom,
  };

  // Canvas y elementos

  const ctx = document.querySelector("#canvitas").getContext("2d");
  if (!ctx) {
    console.log("something terribly wrong is going on here");
    return;
  }
  ctx.canvas.width = box.width;
  ctx.canvas.height = box.height;

  const extentx = d3.extent(graph.loc, d => d[0]);
  const extenty = d3.extent(graph.loc, d => d[1]);
  const w = extentx[1] - extentx[0];
  const h = extenty[1] - extenty[0];

  let size = 0, xpro = 1, ypro = 1;
  size = (w > h) ? (box.bwidth - margin.right) : (box.bheight - margin.bottom);
  xpro = (w > h) ? 1 : (w / h);
  ypro = (w > h) ? (h / w) : 1;

  scalex = d3.scaleLinear()
    .domain(extentx)
    .range([margin.left, size * xpro]);
  scaley = d3.scaleLinear()
    .domain(extenty)
    .range([size * ypro, margin.top]);

  const [lon, lat] = [d => scalex(d[0]), d => scaley(d[1])];
  const x = d => lon(d);
  const y = d => lat(d);

  function render(points, color, lw) {
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.strokeStyle = color;
    for (const point of points) {
      ctx.moveTo(x(point[0]), y(point[0]));
      ctx.lineTo(x(point[1]), y(point[1]));
    }
    ctx.stroke();
  }

  const edges = [];
  let i = 0;
  for (const u in graph.g) {
    for (const [v, _] of graph.g[u]) {
      edges.push([graph.loc[u], graph.loc[v]])
    }
    i++;
  }
  render(edges, 'white', 2)

  function dealWithPath(path, color, lw) {
    excludeList = [];
    console.log(color + ', ' + path);
    // la base de datos de nuestros nodos incluye nodos que no están en la pista, por lo que puede darse el caso 
    // de que no se encuentre un camino entre un nodo origen y el destino, por ello reasignamos el nodo destino
    while ((path[t] === -1 || excludeList.includes(t)) && excludeList.length != 90000) {
      excludeList.push(t);
      t = t < 96509 ? t + 1 : t - 1;
    }

    drawPoints();
    let head = t;
    points = []
    while (path[head] != -1) {
      points.push([graph.loc[head], graph.loc[path[head]]]);
      head = path[head];
    }
    render(points, color, lw)
  }

  dealWithPath(paths.path2, "red", 2)
  dealWithPath(paths.path1, "orange", 6)
  dealWithPath(paths.bestpath, "darkgreen", 3)

  function drawPoints() {
    ctx.fillStyle = "LimeGreen";
    ctx.fillRect(x(graph.loc[s]) - 5, y(graph.loc[s]) - 5, 10, 10)
    ctx.strokeStyle = "Green";
    ctx.strokeRect(x(graph.loc[s]) - 5, y(graph.loc[s]) - 5, 10, 10)
    ctx.fillStyle = "Orange";
    ctx.fillRect(x(graph.loc[t]) - 5, y(graph.loc[t]) - 5, 10, 10)
    ctx.strokeStyle = "OrangeRed";
    ctx.strokeRect(x(graph.loc[t]) - 5, y(graph.loc[t]) - 5, 10, 10)
  }

  // Funciones y eventos

  // Empezamos

})();

/* vim: set tabstop=2:softtabstop=2:shiftwidth=2:noexpandtab */

