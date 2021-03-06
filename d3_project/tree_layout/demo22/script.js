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
// interface point {
//     name: string;
//     children: point[];
// }
var test;
(function (test) {
    var demo2;
    (function (demo2) {
        var orientations = {
            "right-to-left": {
                size: [height, width],
                x: function (d) {
                    return width - d.y;
                },
                y: function (d) {
                    return d.x;
                }
            },
            "left-to-right": {
                size: [height, width],
                x: function (d) {
                    return d.y;
                },
                y: function (d) {
                    return d.x;
                }
            }
        };
        var margin = { top: 20, right: 40, bottom: 20, left: 40 }, rectW = 200, rectH = 60, width = 1200, height = 700;
        var i = 0, duration = 750, root;
        var zm;
        //Redraw for zoom
        var redraws = function () {
            //console.log("here", d3.event.translate, d3.event.scale);
            svg.attr("transform", "translate(" + d3.event.translate + ")"
                + " scale(" + d3.event.scale + ")");
            // 滚动改变字体大小
            svg.selectAll("text")
                .style("font-size", function (d) {
                return 10 / d3.event.scale < 6 ? 6 : 10 / d3.event.scale + "px";
            });
        };
        zm = d3.behavior.zoom().scaleExtent([0.5, 10]).on("zoom", redraws);
        zm.translate([margin.left, (height - rectH) / 2]);
        // var tree = d3.layout.tree().size([height/2, width/2]);
        var tree = d3.layout.tree().nodeSize([100, 200]); //nodeSize  [height,width] height 两个点之间的垂直距离  width ?? 未知
        var diagonal = d3.svg.diagonal()
            .source(function (d) {
            return { "x": d.source.x, "y": d.source.y + rectW / 2 };
        })
            .target(function (d) {
            return { "x": d.target.x, "y": d.target.y - rectW / 2 };
        })
            .projection(function (d) {
            return [d.y, d.x]; // 二次调整 参数
        });
        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zm)
            .append("g")
            .attr("transform", function (d) {
            return "translate(" + margin.left + "," + (height - rectH) / 2 + ")";
        });
        var clip = svg.append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 200)
            .attr("height", 60)
            .attr("id", "clip1");
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
        function wrap(text, width) {
            text.each(function () {
                var text = d3.select(this), words = text.text().split(/\s+/).reverse(), word, line = [], lineNumber = 0, lineHeight = 1.1, // ems
                y = text.attr("y"), dy = parseFloat(text.attr("dy")), tspan = text.text(null).append("tspan").attr("y", y).attr("dy", dy + "em");
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan").attr("x", function (d) {
                            return d.textPadding;
                        }).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                    }
                }
            });
        }
        var update = function (src) {
            // Compute the new tree layout. 计算父布局并返回一组节点 / 计算树节点的父-子连接。
            var nodes = tree.nodes(root).reverse(), links = tree.links(nodes);
            // Normalize for fixed-depth.  改变各个层级的距离
            nodes.forEach(function (d) {
                //  d.y = d.depth * 180;
                d.y = d.depth * 340; // translate(180)  0 180 360
                d.y0 = rectW / 2;
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
                return "translate(" + src.y0 + "," + src.x0 + ")";
            });
            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });
            nodeEnter.append('rect')
                .attr("width", rectW)
                .attr("height", rectH)
                .attr("stroke", "#2ab3ed")
                .attr("stroke-width", 1)
                .style("fill", "#e8eef7")
                .attr("clip-path", function (d, i) { return "url(#clip1)"; });
            nodeEnter.append('rect')
                .attr("width", rectW - 1)
                .attr("height", 20)
                .style("fill", "#c8dbf7");
            // nodeEnter.append("text")
            //     .attr("x", (d) => {
            //         return d.parent ? 210 - rectW / 2 : 10 + rectW / 2;
            //     })
            //     .attr("y", (d) => {
            //         return rectH - 5;
            //     })
            //     .attr("text-anchor", (d) => {
            //         // return d.children || d._children ? "end" : "start";
            //         return "start";
            //     })
            //     .text((d) => {
            //         return "页面访问量:34333112";
            //     })
            //     .style("fill-opacity", 1e-6);
            //添加节点 如果有字节点颜色加深
            nodeEnter.append("circle")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("r", 6)
                .style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            })
                .on("click", click);
            // 增加文本   节点文字显示左侧还是右侧
            // nodeEnter.append("text")
            //     .attr("x", (d) => {
            //         // return d.children || d._children ? -10 : 10;
            //         // return rectW / 2;
            //         if (d.parent) {
            //             d.textPadding = 210 - rectW / 2;
            //             return d.textPadding;
            //         } else {
            //             d.textPadding = 10 + rectW / 2;
            //             return d.textPadding;
            //         }
            //     })
            //     .attr("y", (d) => {
            //         return 10;
            //     })
            //     .attr("dy", ".55em")
            //     .attr("text-anchor", (d) => {
            //         // return d.children || d._children ? "end" : "start";
            //         return "start";
            //     })
            //     .text((d) => {
            //         return d.name;
            //     })
            //     .attr("font-size", (d) => {
            //         return "10px";
            //     })
            //     .call(wrap, 200);
            // Transition nodes to their new position.  // 增加动画延时
            nodeUpdate.select("circle")
                .attr("r", 6)
                .style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            });
            // nodeUpdate.select('rect')
            //     .style("fill", (d) => {
            //         return d._children ? "lightsteelblue" : "#fff";
            //     });
            nodeUpdate.select("text")
                .style("fill-opacity", 1);
            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function (d) {
                return "translate(" + src.y + "," + src.x + ")";
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
                var o = { x: src.x0, y: src.y0 };
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
                var o = { x: src.x, y: src.y };
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
    })(demo2 = test.demo2 || (test.demo2 = {}));
})(test || (test = {}));
