/// <reference path="../../typings/tsd.d.ts" />

// d3.layout.tree - 整齐地排列树节点。
// tree.children - 取得或设置孩子访问器。
// tree.links - 计算树节点的父-子连接。
// tree.nodeSize - 为每个节点指定一个固定的尺寸。
// tree.nodes - 计算父布局并返回一组节点。
// tree.separation - 取得或设置相邻节点的间隔函数。
// tree.size - 用x和y指定树的尺寸。
// tree.sort - 控制遍历顺序中兄弟节点的顺序。
// tree - tree.nodes的别名。

interface point {
    name: string;
    children: point[];
}

var margin = { top: 20, right: 120, bottom: 20, left: 120 },
    width = 700,
    height = 700;

var i = 0,
    duration = 750,
    root;
var zm;

//Redraw for zoom
var redraws = () => {
    //console.log("here", d3.event.translate, d3.event.scale);
    svg.attr("transform",
        "translate(" + (<d3.ZoomEvent>d3.event).translate + ")"
        + " scale(" + (<d3.ZoomEvent>d3.event).scale + ")");
}

zm = d3.behavior.zoom().scaleExtent([0.5, 10]).on("zoom", redraws);
zm.translate([width/2, height/2]);

// var tree = d3.layout.tree().size([height/2, width/2]);
var tree = d3.layout.tree().nodeSize([70, 30]);

var diagonal = d3.svg.diagonal()
    .projection((d) => {
        return [d.y, d.x];
    });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(zm)
    .append("g")
    .attr("transform", "translate(" + width/2 + "," + height/2 + ")");


d3.json("doc.json", (error, data: point) => {
    if (error) throw error;
    root = data;
    root.x0 = 0;   // 最开始的起点展开前x0坐标
    root.y0 = 0;   // 最开始的起点展开前y0坐标


    // 转化  root 节点 children 字节点 _children
    var collapse = (d) => {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    data.children.forEach(collapse);
    update(root);
});

var update = (source) => {

    // Compute the new tree layout. 计算父布局并返回一组节点 / 计算树节点的父-子连接。
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

    // Normalize for fixed-depth.  改变各个层级的距离
    nodes.forEach((d) => {
        //  d.y = d.depth * 180;
        d.y = d.depth * 180;     // translate(180)  0 180 360
    });

    // Update the nodes…
    var node = svg.selectAll("g.node")
        .data<any>(nodes, (d) => {
            return d.id || (d.id = ++i);
        });

    // Enter any new nodes at the parent's previous position.  操作之后移动横纵坐标的位置 绑定click事件
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", (d) => {
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on("click", click);

    //添加节点 如果有字节点颜色加深
    nodeEnter.append("circle")
        .attr("r", 1e-6)
        .style("fill", (d) => {
            return d._children ? "lightsteelblue" : "#fff";
        });

    // 增加文本   节点文字显示左侧还是右侧
    nodeEnter.append("text")
        .attr("x", (d) => {
            return d.children || d._children ? -10 : 10;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", (d) => {
            return d.children || d._children ? "end" : "start";
        })
        .text((d) => {
            return d.name;
        })
        .style("fill-opacity", 1e-6);

    // Transition nodes to their new position.  // 增加动画延时
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", (d) => {
            return "translate(" + d.y + "," + d.x + ")";
        });

    nodeUpdate.select("circle")
        .attr("r", 4.5)
        .style("fill", (d) => {
            return d._children ? "lightsteelblue" : "#fff";
        });

    nodeUpdate.select("text")
        .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", (d) => {
            return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

    nodeExit.select("circle")
        .attr("r", 1e-6);

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);

    // Update the links…
    var link = svg.selectAll("path.link")
        .data<any>(links, (d) => {
            return d.target.id;
        });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", (d) => {
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

// Toggle children on click.
var click = (d) => {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    update(d);
}