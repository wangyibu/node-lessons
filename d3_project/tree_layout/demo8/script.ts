module test.orientation {

    var margin = { top: 140, right: 10, bottom: 140, left: 10 },
        width = 240 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    interface IOrientation {
        size: [number, number];
        x(d): number;
        y(d): number;
    }

    var orientations = {
        // "top-to-bottom": {
        //     size: [width, height],
        //     x: function (d) { return d.x; },
        //     y: function (d) { return d.y; }
        // },
        "right-to-left": {
            size: [height, width],
            x: function (d) { return width - d.y; },
            y: function (d) { return d.x; }
        },
        // "bottom-to-top": {
        //     size: [width, height],
        //     x: function (d) { return d.x; },
        //     y: function (d) { return height - d.y; }
        // },
        "left-to-right": {
            size: [height, width],
            x: function (d) { return d.y; },
            y: function (d) { return d.x; }
        }
    };

    var svg = d3.select("body").selectAll("svg")
        .data(d3.entries(orientations))
        .enter().append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "border");

    svg.append("text")
        .attr("x", 6)
        .attr("y", 6)
        .attr("dy", ".71em")
        .text(function (d) { return d.key; });

    var root;
    
    d3.json("doc.json", function (error, data) {
        if (error) throw error;

        root = data;
        var collapse = (d) => {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            }
        }
        data.children.forEach(collapse);
        console.log(data);

        svg.each(function (orientation) {
            var group = d3.select(this),
                o = <IOrientation>orientation.value;
            // Compute the layout.
            var tree = d3.layout.tree().size(o.size);
            var nodes = tree.nodes(root).reverse();
            var links = tree.links(nodes);
            // 转化  root 节点 children 字节点 _children


            // nodes.forEach(d=>{
            //     return d.children.forEach(collapse);
            // });


            // Create the link lines.
            group.selectAll(".link")
                .data(links)
                .enter().append("path")
                .attr("class", "link")
                .attr("d", d3.svg.diagonal()
                    .projection(d => {
                        return [o.x(d), o.y(d)];
                    })
                );

            var svg = group.selectAll('g.node')
                .data(nodes)
                .enter()
                .append('g')
                .attr('class', d => {
                    return 'node';
                })
                .attr("transform", (d) => {
                    var x = o.x(d);
                    var y = o.y(d);
                    return "translate(" + x + "," + y + ")";
                });

            // Create the node circles.
            svg.append("circle")
                .attr("class", "node")
                .attr("r", 4.5);
        });
    });
}

