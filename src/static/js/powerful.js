(async function () {
  console.log("Toda la alegría del mundo.");

  // Data
  const urlgraph = "graph";
  const graph = await d3.json(urlgraph);

  var s = Math.floor(Math.random() * graph.g.length);
  var t = Math.floor(Math.random() * graph.g.length);
  var hour = 1;
  const urlpaths = `paths/${s}/${t}/${hour}`;
  var paths = await d3.json(urlpaths);
  // console.log('s: ' + s + ', t: ' + t);
  var excludeList = [];

  // config

  const width = document.querySelector("#box").clientWidth;

  const extentx = d3.extent(graph.loc, d => d[0]);
  const extenty = d3.extent(graph.loc, d => d[1]);
  const w = extentx[1] - extentx[0];
  const h = extenty[1] - extenty[0];
  

  const margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  };
  const box = {
    width: width,
    height: width * h / w,
  };

  // Canvas y elementos

  const ctx = document.querySelector("#canvitas").getContext("2d");
  if (!ctx) {
    console.log("something terribly wrong is going on here");
    return;
  }
  ctx.canvas.width = box.width;
  ctx.canvas.height = box.height;

  scalex = d3.scaleLinear()
    .domain(extentx)
    .range([margin.left, box.width - margin.right]);
  scaley = d3.scaleLinear()
    .domain(extenty)
    .range([box.height - margin.top, margin.bottom]);

  const [lon, lat] = [d => scalex(d[0]), d => scaley(d[1])];
  const x = d => lon(d);
  const y = d => lat(d);

  function render(points, color, lw) {
    ctx.lineWidth = lw;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const point of points) {
      ctx.beginPath();
      ctx.strokeStyle = color(point);
      ctx.moveTo(x(point[0]), y(point[0]));
      ctx.lineTo(x(point[1]), y(point[1]));
      ctx.stroke();
    }
  }

  const edges = [];
  for (const u in graph.g) {
    for (const [v, w] of graph.g[u]) {
      edges.push([graph.loc[u], graph.loc[v], w])
    }
  }
  const extentw = d3.extent(edges, d => d[2]);
  console.log('extentw: ' + extentw);
  const scalecolor = d3.scaleLinear()
    .domain(extentw)
    .range([100, 0]);
  const color = d => `hsla(${scalecolor(d[2])}, 100%, 50%, 0.5)`;
  render(edges, color, 1)

  async function dealWithPath(path, color, lw) {
    excludeList = [];
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
    render(points, d => color, lw)
  }

  dealWithPath(paths.path2, "rgba(220,  20, 60, 0.5)", 2)
  dealWithPath(paths.path1, "rgba(255, 165, 0, 0.5)", 6)
  dealWithPath(paths.bestpath, "rgba(0, 128, 0, 0.5)", 3)

  function cleanCanvas() {
    ctx.clearRect(1, 1, box.width, box.height);
    render(edges, d => 'white', 1)
  }

  function drawPoints() {
    drawOriginPoint();
    drawTargetPoint();
  }

  function drawOriginPoint() {
    ctx.fillStyle = "LimeGreen";
    ctx.fillRect(x(graph.loc[s]) - 5, y(graph.loc[s]) - 5, 10, 10)
    ctx.strokeStyle = "Green";
    ctx.strokeRect(x(graph.loc[s]) - 5, y(graph.loc[s]) - 5, 10, 10)
  }
  function drawTargetPoint() {
    ctx.fillStyle = "Orange";
    ctx.fillRect(x(graph.loc[t]) - 5, y(graph.loc[t]) - 5, 10, 10)
    ctx.strokeStyle = "OrangeRed";
    ctx.strokeRect(x(graph.loc[t]) - 5, y(graph.loc[t]) - 5, 10, 10)
  }
  
  async function getNearestNode(x, y) {
    let min = 99999;
    let minNode = -1;
    for (let i = 1; i < graph.loc.length; i++) {
      let distance = Math.sqrt(Math.pow(x - graph.loc[i][0], 2) + Math.pow(y - graph.loc[i][1], 2));
      if (distance < min) {
        min = distance;
        minNode = i;
      }
    }
    return minNode;
  }

  var originBtn = document.getElementById("btn-origin");
  var targetBtn = document.getElementById("btn-target");
  var clearBtn = document.getElementById("btn-clear")
  var findBtn = document.getElementById("btn-find");
  var warningText = document.getElementById("warning-text");
  let searchingOrigin = false;
  let searchingTarget = false;
  let cleaned = false;

  originBtn.addEventListener("click", function () {
    if (searchingTarget) {
      targetBtn.click();
    }
    originBtn.blur();
    searchingOrigin = !searchingOrigin;
  });

  targetBtn.addEventListener("click", function () {
    if (searchingOrigin) {
      originBtn.click();
    }
    targetBtn.blur();
    searchingTarget = !searchingTarget;
  });

  async function onFindBtnClicked() {
    if (searchingOrigin) originBtn.click();
    if (searchingTarget) targetBtn.click();
    const newUrlpaths = `paths/${s}/${t}/${hour}`;
    paths = await d3.json(newUrlpaths);
    cleanCanvas();
    render(edges, color, 1)
    dealWithPath(paths.path2, "rgba(220,  20, 60, 0.5)", 2)
    dealWithPath(paths.path1, "rgba(255, 165, 0, 0.5)", 6)
    dealWithPath(paths.bestpath, "rgba(0, 128, 0, 0.5)", 3)
    cleaned = false;
  }

  findBtn.addEventListener("click", function () {
    onFindBtnClicked();
  });

  clearBtn.addEventListener("click", function () {
    cleanCanvas();
    cleaned = true;
    warningText.style.visibility = "hidden";
    drawOriginPoint();
    drawTargetPoint();
  });

  async function onCanvasClick(e) {
    if (!searchingOrigin && !searchingTarget) return;
    if (!cleaned) {
      warningText.style.visibility = "visible";
      return;
    }

    coordsX = d3.scaleLinear()
      .domain([margin.left, box.width - margin.right])
      .range(extentx);
    coordsY = d3.scaleLinear()
      .domain([box.height - margin.top, margin.bottom])
      .range(extenty);

    if (searchingOrigin) {
      let origin = await getNearestNode(coordsX(e.offsetX), coordsY(e.offsetY));
      // console.log('origin: ' + origin);
      s = origin;
      clearBtn.click();
      originBtn.click();
    }
    else if (searchingTarget) {
      let target = await getNearestNode(coordsX(e.offsetX), coordsY(e.offsetY));
      // console.log('target: ' + target);
      t = target;
      clearBtn.click();
      targetBtn.click();
    }
  }

  document.getElementById("canvitas").addEventListener("click", function (e) {
    onCanvasClick(e);
  });

})();