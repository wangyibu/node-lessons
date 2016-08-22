var treeData = [
    {
        "name": "Top Level",
        "parent": "null",
        "children": [
            {
                "name": "Level 2: A",
                "parent": "Top Level",
                "children": [
                    {
                        "name": "Son of A",
                        "parent": "Level 2: A"
                    },
                    {
                        "name": "Daughter of A",
                        "parent": "Level 2: A"
                    }
                ]
            },
            {
                "name": "Level 2: B",
                "parent": "Top Level"
            }
        ]
    }
];

var collapse = (d) => {
    if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
    }
}

// ************** Generate the tree diagram  *****************
var margin = { top: 20, right: 120, bottom: 20, left: 120 },
    width = 960 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

var i = 0;
var rectW = 100;

var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .source(function (d) {
        return { "x": d.source.x, "y": d.source.y + rectW / 2 };
    })
    .target(function (d) {
        return { "x": d.target.x, "y": d.target.y - rectW / 2 };
    })
    .projection(function (d: any) {
        return [d.y, d.x];
    }); //  创建一个新的对角发生器

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // 创建svg


treeData[0].children.forEach(collapse);

var root = treeData[0];




//root = treeData[0].children[0];
update(root);

function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root),
        links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function (d) {
        d.y = d.depth * 180;
    });

    // 给node绑定数据
    var node = svg.selectAll("g.node")
        .data(nodes, function (d: any) {
            return d.id || (d.id = ++i);
        });

    // Enter the nodes.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + (d.y - rectW / 2) + "," + d.x + ")";
        });
    nodeEnter.append("rect")
        .attr("width", 100)
        .attr("height", 60)
        .attr("stroke", '#2ab3ed')
        .attr("stroke-width", "1")
        .attr("fill", "rgb(232, 238, 247)")
        .attr("y", -30)

    nodeEnter.append("circle")
        .attr("r", 4.5)
        .style("fill", "#fff")
        .attr("cx", rectW)
        .on("click", click);
    // nodeEnter.append("circle")
    //     .attr("r", 10)
    //     .style("fill", "#fff")
    //     .attr("cx",rectW);

    nodeEnter.append("text")
        .attr("dy", ".35em")
        .attr("text-anchor", function (d: any) { // 指定文本开始的位置
            return "start";
        })
        .text(function (d: any) { return d.name; })
        .style("fill-opacity", 1);

    node.exit().remove();

    // 给link绑定数据
    var link = svg.selectAll("path.link")
        .data(links, function (d: any) {
            return d.target.id;
        });

    // Enter the links.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", diagonal);

    link.exit().remove();


}

function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    update(d);
}
