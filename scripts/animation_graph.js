function start_animation_graph(containerId, nodeSpeed, particleSpeed) {
    const neuronColor = 'rgba(255, 255, 255, 1)'; // Color of the moving neurons
    const edgeColor = 'rgba(192, 192, 192, 0.05)'; // Color of the graph edges

    const container = document.getElementById(containerId);
    const canvasGraph = document.createElement('canvas');
    container.appendChild(canvasGraph);
    const ctxGraph = canvasGraph.getContext('2d');
    canvasGraph.width = container.clientWidth;
    canvasGraph.height = container.clientHeight;

    const nodes = [];
    const edges = [];
    const particles = [];
    const numNodes = Math.trunc(canvasGraph.width * canvasGraph.height / 10000);
    const numParticles = numNodes * 2;

    // Initialize nodes with random positions and movement directions
    for (let i = 0; i < numNodes; i++) {
        nodes.push({
            x: Math.random() * canvasGraph.width,
            y: Math.random() * canvasGraph.height,
            dx: (Math.random() - 0.5) * nodeSpeed,
            dy: (Math.random() - 0.5) * nodeSpeed,
            phase: Math.random() * Math.PI * 2 // Random phase for pulsating effect
        });
    }

    // Initialize edges connecting all nodes
    for (let i = 0; i < numNodes; i++) {
        for (let j = i + 1; j < numNodes; j++) {
            edges.push([i, j]);
        }
    }

    // Initialize particles along edges
    for (let i = 0; i < numParticles; i++) {
        const edgeIndex = Math.floor(Math.random() * edges.length);
        particles.push({
            edgeIndex,
            progress: Math.random() // Random starting progress along the edge
        });
    }

    function drawGraph() {
        ctxGraph.clearRect(0, 0, canvasGraph.width, canvasGraph.height);

        // Move nodes and handle boundary collisions
        nodes.forEach(node => {
            node.x += node.dx;
            node.y += node.dy;

            // Bounce off the canvas edges
            if (node.x <= 0 || node.x >= canvasGraph.width) node.dx *= -1;
            if (node.y <= 0 || node.y >= canvasGraph.height) node.dy *= -1;
        });

        // Draw nodes with pulsating effect
        nodes.forEach(node => {
            const pulsate = Math.sin(Date.now() / 500 + node.phase) * 2 + 5;
            ctxGraph.beginPath();
            ctxGraph.arc(node.x, node.y, pulsate, 0, Math.PI * 2);
            ctxGraph.fillStyle = edgeColor;
            ctxGraph.fill();
        });

        // Draw edges
        edges.forEach(edge => {
            const [i, j] = edge;
            const nodeA = nodes[i];
            const nodeB = nodes[j];
            ctxGraph.beginPath();
            ctxGraph.moveTo(nodeA.x, nodeA.y);
            ctxGraph.lineTo(nodeB.x, nodeB.y);
            ctxGraph.strokeStyle = edgeColor;
            ctxGraph.stroke();
        });

        // Draw particles moving along edges
        particles.forEach(particle => {
            const edge = edges[particle.edgeIndex];
            const nodeA = nodes[edge[0]];
            const nodeB = nodes[edge[1]];

            const x = nodeA.x + (nodeB.x - nodeA.x) * particle.progress;
            const y = nodeA.y + (nodeB.y - nodeA.y) * particle.progress;

            ctxGraph.beginPath();
            ctxGraph.arc(x, y, 1, 0, Math.PI * 2);
            ctxGraph.fillStyle = neuronColor;
            ctxGraph.fill();

            particle.progress += particleSpeed / 1000;
            if (particle.progress > 1) {
                particle.progress = 0;
            }
        });

        requestAnimationFrame(drawGraph);
    }

    drawGraph();
}
