var test;
(function (test) {
    var orientation;
    (function (orientation_1) {
        var margin = { top: 10, right: 10, bottom: 10, left: 10 }, width = 400 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;
        var orientations = {
            // "right-to-left": {
            //     size: [height, width],
            //     x: function (d) {
            //         return width - d.y;
            //     },
            //     y: function (d) {
            //         return d.x;
            //     }
            // },
            "left-to-right": {
                size: [height, width],
                x: function (d) {
                    return d.y;
                },
                y: function (d) {
                    return d.x;
                }
            },
        };
        var svg = d3.select("body").selectAll("svg")
            .data(d3.entries(orientations)) // 转化数组 【 key ： left-to-right   value ：{size:[heigh,width],x:func,y:func}
            .enter().append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style({
            'border': '1px solid red',
            'margin-right': '10px'
        })
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        // svg.append('a')
        //   .attr("xlink:href", "http://www.baidu.com")
        //   .append("rect")
        //   .attr("width", width)
        //   .attr("height", height)
        //   .attr("class", "border")
        //   .on('click', function (datum, index: number, outerIndex: number) {
        //     console.log(datum, index, outerIndex);
        //   });
        //   svg.append("text")
        //     .attr("x", 6)
        //     .attr("y", 6)
        //     .attr("dy", ".71em")
        //     .text(function (d) { return d.key; });
        d3.json("doc.json", function (error, root) {
            if (error)
                throw error;
            svg.each(function (orientation) {
                var svg = d3.select(this), o = orientation.value; // orientation.value  = {size: [height, width], x: function (d) { return d.y; }, y: function (d) { return d.x; }}
                var son = d3.entries(root.children);
                var leftTree = {
                    children: []
                };
                var rightTree = {
                    children: []
                };
                son.forEach(function (d, index, arr) {
                    if (d.value.orientation == 'left') {
                        leftTree.children.push(d.value);
                    }
                    else {
                        rightTree.children.push(d.value);
                    }
                });
                console.log(leftTree, rightTree);
                // Compute the layout.
                //   var tree = d3.layout.tree().size(o.size),
                var tree = d3.layout.tree().nodeSize([30, 200]), // nodeSize  [height,width] height 两个点之间的垂直距离  width ?? 未知
                nodes = tree.nodes(root), links = tree.links(nodes);
                var tree_left = d3.layout.tree().nodeSize([30, 200]);
                var nodes_left = nodes.forEach(function (d) {
                    d.y = d.depth * 80; //  控制每一级别的宽度
                });
                // Create the link lines.
                svg.selectAll(".link")
                    .data(links)
                    .enter().append("path")
                    .attr("class", "link")
                    .attr("d", d3.svg.diagonal().projection(function (d) {
                    return [o.x(d), o.y(d)];
                }));
                // Create the node circles.
                svg.selectAll(".node")
                    .data(nodes)
                    .enter().append("circle")
                    .attr("class", "node")
                    .attr("r", 4.5)
                    .attr("cx", o.x)
                    .attr("cy", o.y);
            });
        });
    })(orientation = test.orientation || (test.orientation = {}));
})(test || (test = {}));
