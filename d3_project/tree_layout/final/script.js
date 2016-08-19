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
            // svg.selectAll("text")
            //     .style("font-size", (d) => {
            //         return 10 / (<d3.ZoomEvent>d3.event).scale < 6 ? 6 : 10 / (<d3.ZoomEvent>d3.event).scale + "px";
            //     });
        };
        zm = d3.behavior.zoom().scaleExtent([0.5, 10]).on("zoom", redraws);
        // zm.translate([margin.left, (height - rectH) / 2]);
        // var tree = d3.layout.tree().size([height/2, width/2]);
        //var tree = d3.layout.tree().nodeSize([70, 200]); //nodeSize  [height,width] height 两个点之间的垂直距离  width ?? 未知
        var diagonal = d3.svg.diagonal()
            .projection(function (d) {
            return [d.y + rectW, d.x + rectH / 2]; // 二次调整 参数
        });
        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zm)
            .append("g")
            .attr("transform", function (d) {
            return "translate(" + 0 + "," + 0 + ")";
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
            // root.x0 = 0;   // 最开始的起点展开前x0坐标
            // root.y0 = 0;   // 最开始的起点展开前y0坐标
            var convertData = d3.entries(data.children);
            var leftTree = {
                children: [],
                option: {
                    size: [height, width],
                    x: function (d) {
                        return d.y;
                    },
                    y: function (d) {
                        return d.x;
                    }
                },
                x0: 0,
                y0: 0,
                x: 0,
                y: 0
            };
            var rightTree = {
                children: [],
                option: {
                    size: [height, width],
                    x: function (d) {
                        return width - d.y;
                    },
                    y: function (d) {
                        return d.x;
                    }
                },
                x0: 0,
                y0: 0,
                x: 0,
                y: 0
            };
            convertData.forEach(function (d, index, arr) {
                if (d.value.orientation == 'left') {
                    leftTree.children.push(d.value);
                }
                else {
                    rightTree.children.push(d.value);
                }
            });
            // 转化  root 节点 children 字节点 _children
            var collapse = function (d) {
                if (d.children) {
                    d._children = d.children;
                    d._children.forEach(collapse);
                    d.children = null;
                }
            };
            rightTree.children.forEach(collapse);
            leftTree.children.forEach(collapse);
            var allTree = {
                left: leftTree,
                right: rightTree
            };
            var gAll = svg.selectAll('g')
                .data(d3.entries(allTree))
                .enter().append('g')
                .attr('class', function (d) { return d.key; })
                .attr("transform", function (d) {
                var center = {
                    x: width / 2 + rectW / 2,
                    y: height / 2
                };
                if (d.key == 'right') {
                    center.x = -center.x;
                }
                return "translate(" + center.x + "," + center.y + ")";
            });
            gAll.each(function (d) {
                // if (allTree.key == 'left') {
                //     console.log(allTree.value);
                // } else {
                //     console.log(allTree.value);
                // }
                var node = d.value;
                var nodeEnter = d3.select(this), o = node.option; // orientation.value  = {size: [height, width], x: function (d) { return d.y; }, y: function (d) { return d.x; }}
                // Compute the layout.
                //   var tree = d3.layout.tree().size(o.size),
                var tree = d3.layout.tree().nodeSize([50, 200]), // nodeSize  [height,width] height 两个点之间的垂直距离  width ?? 未知
                nodes = tree.nodes(node), links = tree.links(nodes);
                // var tree_left = d3.layout.tree().nodeSize([100, 200]);
                nodes.forEach(function (d) {
                    d.y = d.depth * 100; //  控制每一级别的宽度
                });
                // Create the link lines.
                nodeEnter.selectAll(".link")
                    .data(links)
                    .enter().append("path")
                    .attr("class", "link")
                    .attr("d", d3.svg.diagonal().projection(function (d) {
                    return [o.x(d), o.y(d)];
                }));
                // Create the node circles.
                nodeEnter.selectAll(".node")
                    .data(nodes)
                    .enter().append("circle")
                    .attr("class", "node")
                    .attr("r", 4.5)
                    .attr("cx", o.x)
                    .attr("cy", o.y);
                // nodeEnter.selectAll("rect")
                //     .data(nodes)
                //     .enter().append('rect')
                //     .attr("width", rectW)
                //     .attr("height", rectH)
                //     .attr("stroke", "#2ab3ed")
                //     .attr("stroke-width", 1)
                //     .attr("y", (d) => {
                //         return d.y ? d.y - rectW / 2 : rectW / 2;
                //     })
                //     .attr("x", (d) => {
                //         return d.x ? d.x - rectH / 2 : rectH / 2;
                //     })
                //     .style("fill", "#e8eef7")
                //     .attr("clip-path", function (d, i) { return "url(#clip1)"; });
                // .attr("d", d3.svg.diagonal().projection(
                //     function (d) {
                //         return [o.x(d), o.y(d)];
                //     })
                // );;
                // update(node);
                // update(node);
            });
            // root.children.forEach(collapse);
            // update(root);
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
        var update = function (source) {
            // Compute the new tree layout. 计算父布局并返回一组节点 / 计算树节点的父-子连接。
            var nodes = tree.nodes(root), links = tree.links(nodes);
            // Normalize for fixed-depth.  改变各个层级的距离
            nodes.forEach(function (d) {
                //  d.y = d.depth * 180;
                d.y = d.depth * 340; // translate(180)  0 180 360
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
                .attr("stroke", "#2ab3ed")
                .attr("stroke-width", 1)
                .attr("x", function (d) {
                return d.parent ? 200 - rectW / 2 : rectW / 2;
            })
                .style("fill", "#e8eef7")
                .attr("clip-path", function (d, i) { return "url(#clip1)"; });
            nodeEnter.append('rect')
                .attr("width", rectW - 1)
                .attr("height", 20)
                .attr("y", function (d) {
                return 39.5;
            })
                .attr("x", function (d) {
                return d.parent ? 200.5 - rectW / 2 : 0.5 + rectW / 2;
            })
                .style("fill", "#c8dbf7");
            nodeEnter.append("text")
                .attr("x", function (d) {
                return d.parent ? 210 - rectW / 2 : 10 + rectW / 2;
            })
                .attr("y", function (d) {
                return rectH - 5;
            })
                .attr("text-anchor", function (d) {
                // return d.children || d._children ? "end" : "start";
                return "start";
            })
                .text(function (d) {
                return "页面访问量:34333112";
            })
                .style("fill-opacity", 1e-6);
            //添加节点 如果有字节点颜色加深
            nodeEnter.append("circle")
                .attr("cx", function (datum, index, outerIndex) {
                return rectW + rectW / 2;
            })
                .attr("cy", function (datum, index, outerIndex) {
                return rectH / 2;
            })
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("r", 6)
                .style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            })
                .on("click", click);
            // 增加文本   节点文字显示左侧还是右侧
            nodeEnter.append("text")
                .attr("x", function (d) {
                // return d.children || d._children ? -10 : 10;
                // return rectW / 2;
                if (d.parent) {
                    d.textPadding = 210 - rectW / 2;
                    return d.textPadding;
                }
                else {
                    d.textPadding = 10 + rectW / 2;
                    return d.textPadding;
                }
            })
                .attr("y", function (d) {
                return 10;
            })
                .attr("dy", ".55em")
                .attr("text-anchor", function (d) {
                // return d.children || d._children ? "end" : "start";
                return "start";
            })
                .text(function (d) {
                return d.name;
            })
                .attr("font-size", function (d) {
                return "10px";
            })
                .call(wrap, 200);
            // Transition nodes to their new position.  // 增加动画延时
            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });
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
    })(demo2 = test.demo2 || (test.demo2 = {}));
})(test || (test = {}));
