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
        var margin = { top: 20, right: 40, bottom: 20, left: 40 }, rectW = 200, rectH = 60, width = 1200, height = 700;
        var orientations = {
            //从左到右
            "left-to-right": {
                size: [height, width],
                x: function (d) {
                    return d.y;
                },
                y: function (d) {
                    return d.x;
                }
            },
            // 从有到左
            "right-to-left": {
                size: [height, width],
                x: function (d) {
                    return width - d.y;
                },
                y: function (d) {
                    return d.x;
                }
            }
        };
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
            .source(function (d) {
            console.log(d);
            return { "x": d.source.x, "y": d.source.y + rectW / 2 };
        })
            .target(function (d) {
            console.log(d);
            return { "x": d.target.x, "y": d.target.y - rectW / 2 };
        })
            .projection(function (d) {
            return [d.y + rectW, d.x + rectH / 2]; // 二次调整 参数
        });
        var wrap = function (text, width) {
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
        };
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
            var orientation = d3.entries(orientations);
            var convertData = d3.entries(data.children);
            var leftTree = {
                children: [],
                // option: {
                //     size: [height, width],
                //     x: function (d) {
                //         return d.y;
                //     },
                //     y: function (d) {
                //         return d.x;
                //     }
                // },
                x0: 0,
                y0: 0,
                x: 0,
                y: 0,
                description: root.description,
                name: root.name,
                originalUrl: root.originalUrl,
                pageCatagor: root.pageCatagor,
                pageTitle: root.pageTitle,
                pageViewPercentage: root.pageViewPercentage,
            };
            var rightTree = {
                children: [],
                // option: {
                //     size: [height, width],
                //     x: function (d) {
                //         return width - d.y;
                //     },
                //     y: function (d) {
                //         return d.x;
                //     }
                // },
                x0: 0,
                y0: 0,
                x: 0,
                y: 0,
                description: root.description,
                name: root.name,
                originalUrl: root.originalUrl,
                pageCatagor: root.pageCatagor,
                pageTitle: root.pageTitle,
                pageViewPercentage: root.pageViewPercentage,
            };
            convertData.forEach(function (d, index, arr) {
                if (index > 2) {
                    leftTree.children.push(d.value);
                    leftTree.orientation = 'left';
                    leftTree.option = orientation[0].value;
                }
                else {
                    rightTree.children.push(d.value);
                    rightTree.orientation = 'right';
                    rightTree.option = orientation[1].value;
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
            // rightTree.children.forEach((d)=>{
            //     d.orientation = 'right';
            // })
            // leftTree.children.forEach((d)=>{
            //     d.orientation = 'left';
            // })
            rightTree.children.forEach(collapse);
            leftTree.children.forEach(collapse);
            // 对每棵树定义orientation = left 、 right
            var orientFun = function (d) {
                for (var i = 0; i < d.length; i++) {
                    d[i].orientation = this.orientation;
                    d[i].option = this.option;
                    if (d[i]._children) {
                        orientFun.call(d[i], d[i]._children);
                    }
                }
            };
            orientFun.call(rightTree, rightTree.children);
            orientFun.call(leftTree, leftTree.children);
            var allTree = {
                left: leftTree,
                right: rightTree,
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
            gAll.each(function (mainTree) {
                // if (allTree.key == 'left') {
                //     console.log(allTree.value);
                // } else {
                //     console.log(allTree.value);
                // }
                var nodeData = mainTree.value;
                var nodeEnter = d3.select(this), o = nodeData.option; // orientation.value  = {size: [height, width], x: function (d) { return d.y; }, y: function (d) { return d.x; }}
                var tree = d3.layout.tree().nodeSize([100, 200]); // nodeSize  [height,width] height 两个点之间的垂直距离  width ?? 未知
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
                function update(nodeData) {
                    var nodes = tree.nodes(nodeData).reverse();
                    var links = tree.links(nodes);
                    nodeEnter.selectAll(".link")
                        .data(links)
                        .enter().append("path")
                        .attr("class", "link")
                        .attr("d", d3.svg.diagonal().projection(function (d) {
                        return [o.x(d), o.y(d)];
                    }));
                    var _node = nodeEnter.selectAll('g.node')
                        .data(nodes);
                    var gNode = _node.enter().append('g')
                        .attr('class', 'node')
                        .attr("transform", function (d) {
                        if ((nodeData.orientation == 'left' && d._children) || (nodeData.orientation == 'right' && d.children)) {
                            return "translate(" + o.x(nodeData) + "," + (o.y(nodeData) - rectH / 2) + ")";
                        }
                        else {
                            return "translate(" + (o.x(nodeData) - rectW) + "," + (o.y(nodeData) - rectH / 2) + ")";
                        }
                    });
                    var nodeUpdate = _node.transition()
                        .duration(duration)
                        .attr("transform", function (d) {
                        if ((nodeData.orientation == 'left' && d._children) || (nodeData.orientation == 'right' && d.children)) {
                            return "translate(" + o.x(d) + "," + (o.y(d) - rectH / 2) + ")";
                        }
                        else {
                            return "translate(" + (o.x(d) - rectW) + "," + (o.y(d) - rectH / 2) + ")";
                        }
                    });
                    nodes.forEach(function (d) {
                        d.y = d.depth * 100; //  控制每一级别的宽度
                    });
                    // Create the link lines.
                    // 最外层框
                    gNode.append('rect')
                        .attr("width", rectW)
                        .attr("height", rectH)
                        .attr("stroke", "#2ab3ed")
                        .attr("stroke-width", 1)
                        .style("fill", "#e8eef7")
                        .attr("class", function (d) {
                        if (mainTree.key == 'left') {
                            return d._children ? 'treeLeftToRightChild' : 'treeLeftToRight';
                        }
                        else {
                            return d._children ? 'treeRightToLeftChild' : 'treeRightToLeft';
                        }
                    })
                        .attr("clip-path", function (d, i) { return "url(#clip1)"; });
                    // 文字
                    // 增加文本   节点文字显示左侧还是右侧
                    // gNode.append("text")
                    //     .attr("x", (d: any) => {
                    //         if (mainTree.key == 'left') {
                    //             return d.textPadding = d._children ? d.y + 0.5 : d.y - rectW + 0.5;
                    //         } else {
                    //             var x = o.size[0] + d.y + rectW / 2;
                    //             return d.textPadding = d._children ? x + 0.5 : x + rectW * 2 + 0.5;
                    //         }
                    //     })
                    //     .attr("y", (d) => {
                    //         // return 10;
                    //         return d.x - rectH / 2 + 10;
                    //     })
                    //     .attr("dy", ".55em")
                    //     .attr("text-anchor", (d) => {
                    //         // return d.children || d._children ? "end" : "start";
                    //         return "start";
                    //     })
                    //     .text((d: any) => {
                    //         return d.name;
                    //     })
                    //     .attr("font-size", (d) => {
                    //         return "10px";
                    //     })
                    //     .call(wrap, 200);
                    // nodeUpdate.select("circle")
                    // .attr("r", 6)
                    // .style("fill", (d) => {
                    //     return d._children ? "lightsteelblue" : "#fff";
                    // });
                    var insideGroup = gNode.append('g')
                        .attr("transform", function (d) {
                        return "translate(" + 0.5 + "," + 39.5 + ")";
                    });
                    // 内部矩形
                    insideGroup.append('rect')
                        .attr("width", rectW - 1)
                        .attr("height", 20)
                        .style("fill", "#c8dbf7");
                    // 内部矩形文字
                    insideGroup.append("text")
                        .attr('x', 3)
                        .attr("dy", 15)
                        .attr("text-anchor", function (d) {
                        return "start";
                    })
                        .text(function (d) {
                        return "页面访问量:34333112";
                    });
                    // Create the node circles.
                    gNode.append("circle")
                        .attr("class", "node-point")
                        .attr("r", 4.5)
                        .attr("cx", function (d) {
                        if (nodeData.orientation == 'left' && d._children) {
                            return d.y - rectW / 2;
                        }
                        else if (nodeData.orientation == 'right' && d.children) {
                            return d.y;
                        }
                        else {
                            return rectW;
                        }
                    })
                        .attr("cy", rectH / 2)
                        .style("fill", function (d) {
                        return d._children ? "lightsteelblue" : "#fff";
                    })
                        .on('click', click);
                    // var nodeUpdate = nodeEnter.transition()
                    //     .duration(duration)
                    //     .attr("transform", (d) => {
                    //         return "translate(" + d.value.y + "," + d.value.x + ")";
                    //     });
                    // Create the link lines.
                    // nodeEnter.selectAll(".link")
                    //     .data(links)
                    //     .enter().append("path")
                    //     .attr("class", "link")
                    //     .attr("d", d3.svg.diagonal().projection(
                    //         function (d) {
                    //             return [o.x(d), o.y(d)];
                    //         })
                    //     );
                    // nodeEnter.selectAll("rect")
                    //     .data(nodes)
                    //     .enter().append('rect')
                    //     .attr("width", rectW)
                    //     .attr("height", rectH)
                    //     .attr("stroke", "#2ab3ed")
                    //     .attr("stroke-width", 1)
                    //     .attr("y", d3.svg.diagonal.projection(function(d)=>{
                    //         o.x(d)
                    //         o.y(d);
                    //     }))
                    //     .attr("x",(d)=>{
                    //         return d.x ? d.x - rectH/2 : rectH/2;
                    //     })
                    //     .style("fill", "#e8eef7")
                    //     .attr("clip-path", function (d, i) { return "url(#clip1)"; });
                    // .attr("d", d3.svg.diagonal().projection(
                    //     function (d) {
                    //         return [o.x(d), o.y(d)];
                    //     })
                    // );;
                    nodes.forEach(function (d) {
                        d.x0 = d.x;
                        d.y0 = d.y;
                    });
                }
                // 初始化
                update(nodeData);
            });
            // root.children.forEach(collapse);
            // update(root);
        });
    })(demo2 = test.demo2 || (test.demo2 = {}));
})(test || (test = {}));
