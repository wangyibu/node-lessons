
//图像区域大小
var R = 600;
//动画持续时间
var duration = 1000;
//节点编号
var index = 0;
//动画时长
var duration = 1000;

//定义一个Tree对象,定义旋转角度和最大半径
var tree = d3.layout.tree()
    .size([360, R / 2 - 120])
    .separation(function (a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

//定义布局方向
var diagonal = d3.svg.diagonal()
    .projection(function (d) {
        var r = d.y, a = (d.x - 90) / 180 * Math.PI;
        return [r * Math.cos(a), r * Math.sin(a)];
    });

//新建画布，移动到圆心位置
var svg = d3.select("body").append("svg")
    .attr("width", R)
    .attr("height", R)
    .append("g")
    .attr("transform", function (d) { return "translate(" + R / 2 + "," + R / 2 + ")"; });

//根据JSON数据生成树
d3.json("tree.json", function (error, data) {

    var root = data;
    //根据数据生成nodes集合
    var nodes = tree.nodes(data);

    //记录现在的位置
    nodes.forEach(function (d: any) {
        d.x0 = d.x;
        d.y0 = d.y;
    });

    //获取node集合的关系集合
    var links = tree.links(nodes);

    //根据node集合生成节点,添加id是为了区分是否冗余的节点
    var node = svg.selectAll(".node")
        .data(nodes, function (d: any) { return d.id || (d.id = ++index); });

    //为关系集合设置贝塞尔曲线连接
    var link = svg.selectAll(".link")
        .data(links, function (d: any) { return d.target.id; })
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", diagonal);

    node.enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
        .on("click", nodeClick);

    //为节点添加圆形标记,如果有子节点为红色，否则绿色
    node.append("circle")
        .attr("fill", function (d) { return d.children == null ? "#0F0" : "#F00"; })
        .attr("r", 5);

    //为节点添加说明文字
    node.append("text")
        .attr("dy", ".4em")
        .text(function (d) { return d.level; })
        .attr("text-anchor", function (d) { return d.x < 180 ? "start" : "end"; })
        .attr("transform", function (d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; });

    //点击的话，隐藏或者显示子节点
    var nodeClick = (d: any) => {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        }
        else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }

    //更新显示
    var update = (source) => {
        //取得现有的节点数据,因为设置了Children属性，没有Children的节点将被删除
        var nodes = tree.nodes(root).reverse();
        var links = tree.links(nodes);

        //为节点更新数据
        var node = svg.selectAll("g.node")
            .data(nodes, function (d: any) { return d.id || (d.id = ++index); });

        //为链接更新数据
        var link = svg.selectAll("path.link").data<any>(links, (d) => { return d.target.id; });

        //更新链接
        link.enter()
            .append("path")
            .attr("class", "link")
            .attr("d", function (d) {
                var o = { x: source.x, y: source.y };
                return diagonal({ source: o, target: o });
            });

        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        //移除无用的链接
        link.exit()
            .transition()
            .duration(duration)
            .attr("d", function (d) {
                var o = { x: source.x, y: source.y };
                return diagonal({ source: o, target: o });
            })
            .remove();

        //更新节点集合
        var nodeEnter = node.enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function (d) { return "rotate(" + (source.x0 - 90) + ")translate(" + source.y0 + ")"; })
            .on("click", nodeClick);

        //为节点添加圆形标记,如果有子节点为红色，否则绿色
        node.append("circle")
            .attr("fill", function (d) { return d.children == null && d._children == null ? "#0F0" : "#F00"; })
            .attr("r", 5);

        //为节点添加说明文字
        node.append("text")
            .attr("dy", ".4em")
            .text(function (d) { return d.level; })
            .attr("text-anchor", function (d) { return d.x < 180 ? "start" : "end"; })
            .attr("transform", function (d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; });

        //节点动画
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function (d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });

        //将无用的子节点删除
        var nodeExit = node.exit()
            .transition()
            .duration(duration)
            .attr("transform", function (d) { return "rotate(" + (source.x - 90) + ")translate(" + source.y + ")"; })
            .remove();

        //记录下当前位置,为下次动画记录初始值
        nodes.forEach(function (d: any) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }
});			