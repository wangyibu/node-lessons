var demo5;
(function (demo5) {
    var i = 0, duration = 750, rectW = 60, rectH = 30;
    var margin = {
        top: 20,
        right: 120,
        bottom: 20,
        left: 120
    }, width = document.body.offsetWidth / 1 - rectW, height = document.getElementsByClassName('svg-container')[0].offsetHeight / 1 - rectH;
    var zm;
    // d3.json('doc.json',(err:any,data:any)=>{
    //     data.
    //     data.x0 = 0;
    // data.y0 = 0;
    // });
    var root = {
        "name": "flare",
        "children": [
            {
                "name": "analytics",
                "children": [
                    {
                        "name": "cluster",
                        "children": [
                            {
                                "name": "AgglomerativeCluster",
                                "size": 3938
                            }
                        ]
                    },
                    {
                        "name": "graph",
                        "children": [
                            {
                                "name": "BetweennessCentrality",
                                "size": 3534
                            },
                            {
                                "name": "LinkDistance",
                                "size": 5731
                            }
                        ]
                    }
                ]
            },
            {
                "name": "animate",
                "children": [
                    {
                        "name": "Easing",
                        "size": 17010
                    },
                    {
                        "name": "FunctionSequence",
                        "size": 5842
                    }
                ]
            },
            {
                "name": "analytics1",
                "children": [
                    {
                        "name": "cluster",
                        "children": [
                            {
                                "name": "AgglomerativeCluster",
                                "size": 3938
                            }
                        ]
                    },
                    {
                        "name": "graph",
                        "children": [
                            {
                                "name": "BetweennessCentrality",
                                "size": 3534
                            },
                            {
                                "name": "LinkDistance",
                                "size": 5731
                            }
                        ]
                    }
                ]
            },
            {
                "name": "animate1",
                "children": [
                    {
                        "name": "Easing",
                        "size": 17010
                    },
                    {
                        "name": "FunctionSequence",
                        "size": 5842
                    }
                ]
            }, {
                "name": "analytics2",
                "children": [
                    {
                        "name": "cluster",
                        "children": [
                            {
                                "name": "AgglomerativeCluster",
                                "size": 3938
                            }
                        ]
                    },
                    {
                        "name": "graph",
                        "children": [
                            {
                                "name": "BetweennessCentrality",
                                "size": 3534
                            },
                            {
                                "name": "LinkDistance",
                                "size": 5731
                            }
                        ]
                    }
                ]
            },
            {
                "name": "animate3",
                "children": [
                    {
                        "name": "Easing",
                        "size": 17010
                    },
                    {
                        "name": "FunctionSequence",
                        "size": 5842
                    }
                ]
            },
            {
                "name": "analytics4",
                "children": [
                    {
                        "name": "cluster",
                        "children": [
                            {
                                "name": "AgglomerativeCluster",
                                "size": 3938
                            }
                        ]
                    },
                    {
                        "name": "graph",
                        "children": [
                            {
                                "name": "BetweennessCentrality",
                                "size": 3534
                            },
                            {
                                "name": "LinkDistance",
                                "size": 5731
                            }
                        ]
                    }
                ]
            },
            {
                "name": "animate5",
                "children": [
                    {
                        "name": "Easing",
                        "size": 17010
                    },
                    {
                        "name": "FunctionSequence",
                        "size": 5842
                    }
                ]
            }
        ]
    };
    var tree = d3.layout.tree().nodeSize([45, 0]); //  value1 上下跨度为 value2   
    var diagonal = d3.svg.diagonal()
        .projection(function (d) {
        return [d.y + rectW / 2, d.x + rectH / 2];
    });
    var svg = d3.select("svg").attr("width", "100%").attr("height", "100%")
        .call(zm = d3.behavior.zoom().scaleExtent([0.5, 10]).on("zoom", redraw)).append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    //necessary so that zoom knows where to zoom and unzoom from
    zm.translate([width / 2, height / 2]);
    root.x0 = 0;
    root.y0 = 0;
    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }
    root.children.forEach(collapse);
    updates(root);
    // d3.select("#body").style("height", "800px");
    function updates(source) {
        // Compute the new tree layout. // 计算nodes 节点
        var nodes = tree.nodes(root).reverse(), links = tree.links(nodes);
        // Normalize for fixed-depth.
        nodes.forEach(function (d) {
            d.y = 180 * d.depth;
        });
        // Update the nodes…
        var node = svg.selectAll("g.node")
            .data(nodes, function (d) {
            return d.id || (d.id = ++i);
        });
        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
            return "translate(" + source.x + "," + source.y + ")";
        })
            .on("click", clicks);
        nodeEnter.append("rect")
            .attr("width", rectW)
            .attr("height", rectH)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .style("fill", function (d) {
            return d._children ? "lightsteelblue" : "#fff";
        });
        nodeEnter.append("text")
            .attr("x", rectW / 2)
            .attr("y", rectH / 2)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function (d) {
            return d.name;
        });
        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function (d) {
            return "translate(" + d.y + "," + d.x + ")";
        });
        nodeUpdate.select("rect")
            .attr("width", rectW)
            .attr("height", rectH)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
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
        nodeExit.select("rect")
            .attr("width", rectW)
            .attr("height", rectH)
            .attr("stroke", "black")
            .attr("stroke-width", 1);
        nodeExit.select("text");
        // Update the links…
        var link = svg.selectAll("path.link")
            .data(links, function (d) {
            return d.target.id;
        });
        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("x", rectW / 2)
            .attr("y", rectH / 2)
            .attr("d", function (d) {
            var o = {
                x: source.x0,
                y: source.y0
            };
            return diagonal({
                source: o,
                target: o
            });
        });
        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);
        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function (d) {
            var o = {
                x: source.x,
                y: source.y
            };
            return diagonal({
                source: o,
                target: o
            });
        })
            .remove();
        // Stash the old positions for transition.
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }
    // Toggle children on click.
    function clicks(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        }
        else {
            d.children = d._children;
            d._children = null;
        }
        updates(d);
    }
    //Redraw for zoom
    function redraw() {
        //console.log("here", d3.event.translate, d3.event.scale);
        svg.attr("transform", "translate(" + d3.event.translate + ")"
            + " scale(" + d3.event.scale + ")");
    }
})(demo5 || (demo5 = {}));
