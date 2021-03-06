d3.json('doc.json', function (err, data) {
    var objRight = data['r'] ? data['r'] : {};
    var objLeft = data['l'] ? data['l'] : {};
    d3jsTree('#body', objRight, objLeft);
});
var d3jsTree = function (aim, objRight, objLeft) {
    // $(aim+' svg').remove();
    var m = [20, 120, 20, 120], w = 1280 - m[1] - m[3], h = 600 - m[0] - m[2], //靠左
    i = 0;
    var tree = d3.layout.cluster().size([h, w]);
    var diagonal = d3.svg.diagonal()
        .source(function (d) {
        return { "x": d.source.x, "y": d.source.y };
    })
        .target(function (d) {
        return { "x": d.target.x, "y": d.target.y };
    });
    // .projection((d) => { return [d.y, d.x]; });
    var vis = d3.select(aim).append("svg:svg")
        .attr("width", 1200)
        .attr("class", "svg-content")
        .attr("height", h + m[0] + m[2])
        .append("svg:g")
        .attr("transform", "translate(" + h + "," + m[0] + ")"); // translate(靠左，靠上)
    var init_nodes = function (left) {
        left.x0 = h / 2;
        left.y0 = 0;
        var nodes_dic = [];
        var left_nodes = tree.nodes(left);
        return left_nodes;
    };
    var j = 0;
    // source : right  l : left
    var update = function (source, l) {
        var duration = d3.event && d3.event.altKey ? 5000 : 500;
        // Compute the new tree layout.
        var nodes = init_nodes(source);
        var left_nodes = init_nodes(l);
        // if( l !=)
        var len = nodes.length;
        for (var i in left_nodes) {
            nodes[len++] = left_nodes[i];
        }
        // Normalize for fixed-depth.
        nodes.forEach(function (d) {
            var tmp = 1;
            if (d.pos == 'l') {
                tmp = -1;
            }
            d.y = tmp * d.depth * 200; // 线条长度，也是作于方向
            // d.x = d.l * 63;
        });
        // Update the nodes…
        var node = vis.selectAll("g.node")
            .data(nodes, function (d) {
            return d.id || (d.id = ++j);
        });
        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("svg:g")
            .attr("class", "node")
            .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
            .on("click", function (d) { alert(d.name); }); // 点击事件
        // .on("click", function(d) { ajax_get_server(d.name);console.log(d);toggle(d); update(d,l); });
        nodeEnter.append("svg:circle")
            .attr("r", 1e-6)
            .style("fill", function (d) { return d._children ? "lightsteelblue" : "#fff"; });
        nodeEnter.append("svg:text")
            .attr("x", function (d) { return d.children || d._children ? -10 : 10; })
            .attr("dy", ".35em")
            .attr("text-anchor", function (d) { return d.children || d._children ? "end" : "start"; })
            .text(function (d) { return d.name; })
            .style("fill-opacity", 1e-6);
        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });
        nodeUpdate.select("circle")
            .attr("r", 4.5)
            .style("fill", function (d) { return d._children ? "lightsteelblue" : "#fff"; });
        nodeUpdate.select("text").style("fill-opacity", 1);
        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function (d) { return "translate(" + source.y + "," + source.x + ")"; })
            .remove();
        nodeExit.select("circle")
            .attr("r", 1e-6);
        nodeExit.select("text")
            .style("fill-opacity", 1e-6);
        // Update the links…
        var link = vis.selectAll("path.link")
            .data(tree.links(nodes), function (d) { return d.target.id; });
        // Enter any new links at the parent's previous position.
        link.enter()
            .insert("svg:path", "g")
            .attr("class", "link")
            .attr("d", function (d) {
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
            .attr("d", function (d) {
            var o = { x: source.x, y: source.y };
            return diagonal({ source: o, target: o });
        })
            .remove();
        // Stash the old positions for transition.
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    };
    update(objRight, objLeft);
    // Toggle children.
    var toggle = function (d) {
        if (d.children) {
            d._children = d.children; // 闭合子节点
            d.children = null;
        }
        else {
            d.children = d._children; // 开启子节点
            d._children = null;
        }
    };
};
