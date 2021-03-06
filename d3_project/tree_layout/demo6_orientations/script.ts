module test.orientation {

    interface IChild {
        children: IChild[];
        orientation?: string;
        option?: IOrientationOption;
    }

    interface IOrientationOption {
        size: Array<number>;
        x(d: any): number;
        y(d: any): number;
    }

    var margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = 1200 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

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

    // 节点宽度和高度
    var nodeInfo = {
        heigh: 60,
        width: 200
    }

    var zm;

    var redraws = () => {
        //console.log("here", d3.event.translate, d3.event.scale);
        svg.attr("transform",
            "translate(" + (<d3.ZoomEvent>d3.event).translate + ")"
            + " scale(" + (<d3.ZoomEvent>d3.event).scale + ")");
        // 滚动改变字体大小
        svg.selectAll("text")
            .style("font-size", (d) => {
                return 10 / (<d3.ZoomEvent>d3.event).scale < 6 ? 6 : 10 / (<d3.ZoomEvent>d3.event).scale + "px";
            });
    }

    zm = d3.behavior.zoom().scaleExtent([0.5, 10]).on("zoom", redraws);
    zm.translate([0, 0]);

    var svg = d3.select("body")
        .append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style({
            'border': '1px solid red',
            'margin-right': '10px'
        }).call(zm)
        .append("g")
        .attr("transform", (d) => {
            return "translate(" + 0 + "," + 0 + ")";
        });

    d3.json("doc.json", function (error, root) {
        if (error) throw error;

        // 计算2个树
        var son = d3.entries<IChild>(root.children);
        var leftTree = <IChild>{
            children: [],
            option: {
                size: [height, width],
                x: function (d) {
                    return d.y;
                },
                y: function (d) {
                    return d.x;
                }
            }
        }
        var rightTree = <IChild>{
            children: [],
            option: {
                size: [height, width],
                x: function (d) {
                    return width - d.y;
                },
                y: function (d) {
                    return d.x;
                }
            }
        }
        son.forEach((d, index, arr) => {
            if (d.value.orientation == 'left') {
                leftTree.children.push(d.value);
            } else {
                rightTree.children.push(d.value);
            }
        });

        var tree = {
            left: leftTree,
            right: rightTree
        }

        var gAll = svg.selectAll('g')
            .data(d3.entries<IChild>(tree))
            .enter().append('g')
            .attr("transform", (d) => {
                var center = {
                    x: width / 2 + nodeInfo.width / 2,
                    y: height / 2
                }
                if (d.key == 'right') {
                    center.x = -center.x;
                }
                return "translate(" + center.x + "," + center.y + ")"
            });


        // var svg = d3.select("body").selectAll("svg")
        //     .data(d3.entries<IChild>(tree)) // 转化数组 【 key ： left-to-right   value ：{size:[heigh,width],x:func,y:func}
        //     .enter().append("svg")
        //     .attr("width", width + margin.left + margin.right)
        //     .attr("height", height + margin.top + margin.bottom)
        //     .style({
        //         'border': '1px solid red',
        //         'margin-right': '10px'
        //     })
        //     .append("g")
        //     // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        //     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        gAll.each(function (allTree) {           // each(func: (datum: Datum, index: number, outerIndex: number) => any): Selection<Datum>;

            // if (allTree.key == 'left') {
            //     console.log(allTree.value);
            // } else {
            //     console.log(allTree.value);
            // }
            var node = <IChild>allTree.value;

            var group = d3.select(this),
                o = node.option;                // orientation.value  = {size: [height, width], x: function (d) { return d.y; }, y: function (d) { return d.x; }}


            // Compute the layout.
            //   var tree = d3.layout.tree().size(o.size),

            var tree = d3.layout.tree().nodeSize([50, 200]),// nodeSize  [height,width] height 两个点之间的垂直距离  width ?? 未知
                nodes = tree.nodes(node),
                links = tree.links(nodes);


            // var tree_left = d3.layout.tree().nodeSize([100, 200]);

            nodes.forEach((d) => {
                d.y = d.depth * 300; //  控制每一级别的宽度
            })

            var rectW = 40;

            // Create the link lines.
            group.selectAll(".link")
                .data(links)
                .enter().append("path")
                .attr("class", "link")
                .attr("d", d3.svg.diagonal()
                    .source(function (d) {
                        return { "x": d.source.x, "y": d.source.y + rectW / 2 };
                    })
                    .target(function (d) {
                        return { "x": d.target.x, "y": d.target.y - rectW / 2 };
                    })
                    .projection(
                    function (d) {
                        return [o.x(d), o.y(d)];
                    })
                );

            // Create the node circles.
            group.selectAll(".node")
                .data(nodes)
                .enter().append("circle")
                .attr("class", "node")
                .attr("r", 4.5)
                .attr("cx", o.x)
                .attr("cy", o.y);
        });
    });

}

