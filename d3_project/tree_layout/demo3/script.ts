d3.json('doc.json', (err, data) => {
  var objRight = data['r'] ? data['r'] : {};
  var objLeft = data['l'] ? data['l'] : {};
  d3jsTree('#body', objRight, objLeft);
});

var d3jsTree = (aim, objRight, objLeft) => {
  // $(aim+' svg').remove();
  var m = [20, 120, 20, 120],
    w = 1280 - m[1] - m[3],
    h = 600 - m[0] - m[2],  //靠左
    i = 0;

  var tree = d3.layout.cluster().size([h, w]);

  var diagonal = d3.svg.diagonal()
    .source((d: any) => {
      return { "x": d.source.x, "y": d.source.y };
    })
    .target((d: any) => {
      return { "x": d.target.x, "y": d.target.y };
    });
    // .projection((d) => { return [d.y, d.x]; });

  var vis = d3.select(aim).append("svg:svg")
    .attr("width", 1200)
    .attr("class", "svg-content")
    .attr("height", h + m[0] + m[2])
    .append("svg:g")
    .attr("transform", "translate(" + h + "," + m[0] + ")"); // translate(靠左，靠上)


  var init_nodes = (left) => {
    left.x0 = h / 2;
    left.y0 = 0;
    var nodes_dic = [];
    var left_nodes = tree.nodes(left);
    return left_nodes;
  }
  var j: number = 0;
  // source : right  l : left
  var update = (source, l) => {
    var duration = d3.event && (<MouseEvent>d3.event).altKey ? 5000 : 500;

    // Compute the new tree layout.
    var nodes = init_nodes(source);
    var left_nodes = init_nodes(l);
    // if( l !=)
    var len = nodes.length;
    for (var i in left_nodes) {
      nodes[len++] = left_nodes[i];
    }

    // Normalize for fixed-depth.
    nodes.forEach((d: any) => {
      var tmp = 1;
      if (d.pos == 'l') {
        tmp = -1;
      }
      d.y = tmp * d.depth * 200;  // 线条长度，也是作于方向
      // d.x = d.l * 63;
    });


    // Update the nodes…
    var node = vis.selectAll("g.node")
      .data(nodes, (d: any) => {
        return d.id || (d.id = ++j);
      });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", (d) => { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", (d: any) => { alert(d.name); }); // 点击事件
    // .on("click", function(d) { ajax_get_server(d.name);console.log(d);toggle(d); update(d,l); });

    nodeEnter.append("svg:circle")
      .attr("r", 1e-6)
      .style("fill", (d: any) => { return d._children ? "lightsteelblue" : "#fff"; });

    nodeEnter.append("svg:text")
      .attr("x", (d: any) => { return d.children || d._children ? -10 : 10; })
      .attr("dy", ".35em")
      .attr("text-anchor", (d: any) => { return d.children || d._children ? "end" : "start"; })
      .text((d: any) => { return d.name; })
      .style("fill-opacity", 1e-6);

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", (d) => { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", (d) => { return d._children ? "lightsteelblue" : "#fff"; });

    nodeUpdate.select("text").style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", (d: any) => { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

    nodeExit.select("circle")
      .attr("r", 1e-6);

    nodeExit.select("text")
      .style("fill-opacity", 1e-6);

    // Update the links…
    var link = vis.selectAll("path.link")
      .data(tree.links(nodes), (d: any) => { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter()
      .insert("svg:path", "g")
      .attr("class", "link")
      .attr("d", (d) => {
        var o = { x: source.x0, y: source.y0 };
        return diagonal({ source: o, target: o });
      })
      .transition()
      .duration(duration)
      .attr("d", diagonal);

    // Transition links to their new position.
    link.transition()
      .duration(duration)
      .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit()
      .transition()
      .duration(duration)
      .attr("d", (d) => {
        var o = { x: source.x, y: source.y };
        return diagonal({ source: o, target: o });
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach((d: any) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }
  update(objRight, objLeft);
  // Toggle children.
  var toggle = (d) => {
    if (d.children) {
      d._children = d.children; // 闭合子节点
      d.children = null;
    } else {
      d.children = d._children; // 开启子节点
      d._children = null;
    }
  }
}

