module test.demo1 {


  var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 1200 - margin.right - margin.left,
    height = 700 - margin.top - margin.bottom;

  var i = 0;

  var tree = d3.layout.tree()
    .size([height, width])
    .separation((a,b)=>{
        return 400;
    });

  var diagonal = d3.svg.diagonal()
    .projection(function (d) { return [d.y, d.x]; });

  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")");

  var root;


  d3.json('doc.json', (err, data) => {
    root = data;
    update(root);
  })

  // root = treeData[0];
  // update(root);


  function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function (d) {
      d.y = d.depth * 180;
    });

    // Declare the nodes…
    var node = svg.selectAll("g.node")
      .data(nodes, function (d: any) { return d.id || (d.id = ++i); });

    // Enter the nodes.
    var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
      });

    nodeEnter.append("circle")
      .attr("r", function (d: any) { return d.value; })
      .style("stroke", function (d: any) { return d.type; })
      .style("fill", function (d: any) { return d.level; });

    nodeEnter.append("text")
      .attr("x", function (d: any) {
        return d.children || d._children ?
          (d.value + 4) * -1 : d.value + 4
      })
      .attr("dy", ".35em")
      .attr("text-anchor", function (d: any) {
        return d.children || d._children ? "end" : "start";
      })
      .text(function (d: any) { return d.name; })
      .style("fill-opacity", 1);

    // Declare the links…
    var link = svg.selectAll("path.link")
      .data(links, function (d: any) { return d.target.id; });

    // Enter the links.
    link.enter().insert("path", "g")
      .attr("class", "link")
      .style("stroke", function (d) { return d.target.level; })
      .attr("d", diagonal);

  }

}
