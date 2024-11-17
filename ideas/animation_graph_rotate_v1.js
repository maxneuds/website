// FILE: animation_graph.js

function start_animation_graph(containerId, rotationSpeed) {
    const neuronColor = 'rgba(250, 249, 246, 1)'; // Color of the moving neurons
    const edgeColor = 'rgba(170, 210, 255, 0.15)'; // Color of the graph edges

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
    const radius = Math.min(canvasGraph.width, canvasGraph.height) / 3; // Ensure nodes stay within container
    const numParticles = numNodes * 2; // Number of particles to simulate neurons

    for (let i = 0; i < numNodes; i++) {
        const angle = (i / numNodes) * Math.PI * 2;
        nodes.push({
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            z: Math.random() * radius - radius / 2,
            phase: Math.random() * Math.PI * 2, // Random phase for pulsating effect
            moveX: (Math.random() - 0.5) * 2, // Random movement in X direction
            moveY: (Math.random() - 0.5) * 2, // Random movement in Y direction
            moveZ: (Math.random() - 0.5) * 2  // Random movement in Z direction
        });
    }

    for (let i = 0; i < numNodes; i++) {
        for (let j = i + 1; j < numNodes; j++) {
            edges.push([i, j]);
        }
    }

    for (let i = 0; i < numParticles; i++) {
        const edgeIndex = Math.floor(Math.random() * edges.length);
        particles.push({
            edgeIndex,
            progress: Math.random() // Random starting progress along the edge
        });
    }

    function rotateX(point, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const y = point.y * cos - point.z * sin;
        const z = point.y * sin + point.z * cos;
        return { x: point.x, y, z };
    }

    function rotateY(point, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = point.x * cos - point.z * sin;
        const z = point.x * sin + point.z * cos;
        return { x, y: point.y, z };
    }

    function rotateZ(point, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = point.x * cos - point.y * sin;
        const y = point.x * sin + point.y * cos;
        return { x, y, z: point.z };
    }

    function drawGraph() {
        ctxGraph.clearRect(0, 0, canvasGraph.width, canvasGraph.height);
        const angle = Date.now() * Math.PI / 10000 * rotationSpeed;

        const rotatedNodes = nodes.map(node => {
            let rotated = rotateX(node, angle);
            rotated = rotateY(rotated, angle);
            rotated = rotateZ(rotated, angle);
            rotated.x += node.moveX;
            rotated.y += node.moveY;
            rotated.z += node.moveZ;
            return rotated;
        });

        rotatedNodes.forEach(node => {
            const scale = 500 / (500 + node.z);
            const x = node.x * scale + canvasGraph.width / 2;
            const y = node.y * scale + canvasGraph.height / 2;
            const pulsate = Math.sin(Date.now() / 500 + node.phase) * 2 + 5; // Pulsating effect
            ctxGraph.beginPath();
            ctxGraph.arc(x, y, pulsate * scale, 0, Math.PI * 2);
            ctxGraph.fillStyle = 'rgba(139, 233, 253, 0.8)';
            ctxGraph.fill();
        });

        edges.forEach(edge => {
            const [i, j] = edge;
            const nodeA = rotatedNodes[i];
            const nodeB = rotatedNodes[j];
            const scaleA = 500 / (500 + nodeA.z);
            const scaleB = 500 / (500 + nodeB.z);
            const xA = nodeA.x * scaleA + canvasGraph.width / 2;
            const yA = nodeA.y * scaleA + canvasGraph.height / 2;
            const xB = nodeB.x * scaleB + canvasGraph.width / 2;
            const yB = nodeB.y * scaleB + canvasGraph.height / 2;
            ctxGraph.beginPath();
            ctxGraph.moveTo(xA, yA);
            ctxGraph.lineTo(xB, yB);
            ctxGraph.strokeStyle = edgeColor;
            ctxGraph.stroke();
        });

        particles.forEach(particle => {
            const edge = edges[particle.edgeIndex];
            const nodeA = rotatedNodes[edge[0]];
            const nodeB = rotatedNodes[edge[1]];
            const scaleA = 500 / (500 + nodeA.z);
            const scaleB = 500 / (500 + nodeB.z);
            const xA = nodeA.x * scaleA + canvasGraph.width / 2;
            const yA = nodeA.y * scaleA + canvasGraph.height / 2;
            const xB = nodeB.x * scaleB + canvasGraph.width / 2;
            const yB = nodeB.y * scaleB + canvasGraph.height / 2;

            const x = xA + (xB - xA) * particle.progress;
            const y = yA + (yB - yA) * particle.progress;

            ctxGraph.beginPath();
            ctxGraph.arc(x, y, 1, 0, Math.PI * 2);
            ctxGraph.fillStyle = neuronColor;
            ctxGraph.fill();

            particle.progress += 0.0025;
            if (particle.progress > 1) {
                particle.progress = 0;
            }
        });

        requestAnimationFrame(drawGraph);
    }

    drawGraph();
}


