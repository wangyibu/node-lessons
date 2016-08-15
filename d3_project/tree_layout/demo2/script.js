/// <reference path="../../typings/tsd.d.ts" />
var margin = { top: 20, right: 120, bottom: 20, left: 120 }, rectW = 100, rectH = 40, width = 1200, height = 700;
var i = 0, duration = 750, root;
var zm;
//Redraw for zoom
var redraws = function () {
    //console.log("here", d3.event.translate, d3.event.scale);
    svg.attr("transform", "translate(" + d3.event.translate + ")"
        + " scale(" + d3.event.scale + ")");
};
zm = d3.behavior.zoom().scaleExtent([0.5, 10]).on("zoom", redraws);
zm.translate([width / 2 - margin.right - margin.left - rectW, height / 2 - margin.top]);
// var tree = d3.layout.tree().size([height/2, width/2]);
var tree = d3.layout.tree().nodeSize([70, 30]);
var diagonal = d3.svg.diagonal()
    .projection(function (d) {
    return [d.y + rectW / 2, d.x + rectH / 2]; // 二次调整 参数
});
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(zm)
    .append("g")
    .attr("transform", function (d) {
    return "translate(" + (width / 2 - margin.right - margin.left - rectW) + "," + (height / 2 - margin.top) + ")";
});
d3.json("doc.json", function (error, data) {
    if (error)
        throw error;
    root = data;
    root.x0 = 0; // 最开始的起点展开前x0坐标
    root.y0 = 0; // 最开始的起点展开前y0坐标
    // 转化  root 节点 children 字节点 _children
    var collapse = function (d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    };
    data.children.forEach(collapse);
    update(root);
});
var update = function (source) {
    // Compute the new tree layout. 计算父布局并返回一组节点 / 计算树节点的父-子连接。
    var nodes = tree.nodes(root).reverse(), links = tree.links(nodes);
    // Normalize for fixed-depth.  改变各个层级的距离
    nodes.forEach(function (d) {
        //  d.y = d.depth * 180;
        d.y = d.depth * 180; // translate(180)  0 180 360
    });
    // Update the nodes…
    var node = svg.selectAll("g.node")
        .data(nodes, function (d) {
        return d.id || (d.id = ++i);
    });
    // Enter any new nodes at the parent's previous position.  操作之后移动横纵坐标的位置 绑定click事件
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
    });
    nodeEnter.append('rect')
        .attr("width", rectW)
        .attr("height", rectH)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("fill", function (d) {
        return d._children ? "lightsteelblue" : "#fff";
    });
    //添加节点 如果有字节点颜色加深
    nodeEnter.append("rect")
        .attr("x", function (datum, index, outerIndex) {
        return rectW;
    })
        .attr("y", function (datum, index, outerIndex) {
        return rectH / 2 - 5;
    })
        .attr("width", 10)
        .attr("height", 10)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("fill", function (d) {
        return d._children ? "lightsteelblue" : "#fff";
    })
        .on("click", click);
    // 增加文本   节点文字显示左侧还是右侧
    nodeEnter.append("text")
        .attr("x", function (d) {
        // return d.children || d._children ? -10 : 10;
        return rectW / 2;
    })
        .attr("y", function (d) {
        return rectH / 2;
    })
        .attr("dy", ".35em")
        .attr("text-anchor", function (d) {
        // return d.children || d._children ? "end" : "start";
        return "middle";
    })
        .text(function (d) {
        return d.name;
    })
        .style("fill-opacity", 1e-6);
    // Transition nodes to their new position.  // 增加动画延时
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
    });
    nodeUpdate.select("circle")
        .attr("r", 4.5)
        .style("fill", function (d) {
        return d._children ? "lightsteelblue" : "#fff";
    });
    nodeUpdate.select('rect')
        .style("fill", function (d) {
        return d._children ? "lightsteelblue" : "#fff";
    });
    nodeUpdate.select("text")
        .style("fill-opacity", 1);
    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function (d) {
        return "translate(" + source.y + "," + source.x + ")";
    })
        .remove();
    nodeExit.select("circle")
        .attr("r", 1e-6);
    nodeExit.select("text")
        .style("fill-opacity", 1e-6);
    // Update the links…
    var link = svg.selectAll("path.link")
        .data(links, function (d) {
        return d.target.id;
    });
    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function (d) {
        var o = { x: source.x0, y: source.y0 };
        return diagonal({ source: o, target: o });
    });
    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);
    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
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
// Toggle children on click.
var click = function (d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    }
    else {
        d.children = d._children;
        d._children = null;
    }
    update(d);
};
