
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js particle system
    initParticleSystem();

    // Check for scroll animations support
    if (!CSS.supports('animation-timeline: view()')) {
        // Fallback for browsers without scroll animations
        document.querySelectorAll('#services .bg-gray-800\\/85, #team .bg-gray-800\\/50, #contact .contact-method').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }
// GSAP animations for smooth transitions
    gsap.from("#logo-container h1", {
        duration: 2,
        opacity: 0,
        y: 50,
        ease: "power3.out",
        delay: 0.5
    });
    gsap.from("p", {
        duration: 1.5,
        opacity: 0,
        y: 30,
        ease: "power2.out",
        delay: 1.2,
        textShadow: "0 2px 4px rgba(0,0,0,0)"
    });
    gsap.to("p", {
        duration: 1,
        textShadow: "0 2px 4px rgba(0,0,0,0.5)",
        delay: 2.2
    });
gsap.from("a", {
        duration: 1,
        opacity: 0,
        y: 20,
        ease: "back.out(1.7)",
        delay: 1.8
    });
    // Card animations on scroll
    const animateCards = (selector) => {
        gsap.utils.toArray(selector).forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                duration: 0.8,
                opacity: 0,
                y: 50,
                ease: "back.out(1.2)",
                delay: i * 0.1
            });
        });
    };
    animateCards(".service-card");
    animateCards(".team-card");
    animateCards(".contact-method");
    
    // Fallback for browsers without scroll animations
    if (!CSS.supports('animation-timeline: view()')) {
        document.querySelectorAll('#contact .contact-method').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }
});
function initParticleSystem() {
    const container = document.getElementById('particle-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 40;
    
    // Renderer with smoother settings
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    // Enhanced renderer settings
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    // Add space dust background particles
    const dustCount = 1920; // Increased dust particles by 60%
const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustSizes = new Float32Array(dustCount);
    
    for (let i = 0; i < dustCount; i++) {
        dustPositions[i * 3] = (Math.random() - 0.5) * 2000;
        dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
        dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
        dustSizes[i] = 0.1 + Math.random() * 0.8; // Larger dust particles
}
    
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeometry.setAttribute('size', new THREE.BufferAttribute(dustSizes, 1));
    
    const dustMaterial = new THREE.PointsMaterial({
        size: 1,
        color: 0x555555,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
});
    
    const dustParticles = new THREE.Points(dustGeometry, dustMaterial);
    dustParticles.position.z = -50;
    scene.add(dustParticles);
    
    // Animate dust particles
    dustParticles.userData = { speed: 0.5 + Math.random() * 0.5 };
    // Create planetary texture for particles with subtle variations
    function createCircleTexture() {
const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        // Create planetary glow effect
        const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.1, 'rgba(255,255,255,0.9)');
        gradient.addColorStop(0.3, 'rgba(255,255,255,0.7)');
        gradient.addColorStop(0.6, 'rgba(255,255,255,0.4)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
context.fillStyle = gradient;
        context.beginPath();
        context.arc(32, 32, 32, 0, Math.PI * 2);
        context.fill();
        
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }
    // Main particles
    const particleCount = 1920;
const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    // Create a tighter vortex formation
    const radius = 15; // Smaller radius for tighter formation
for (let i = 0; i < particleCount; i++) {
        // Evenly distribute particles in a sphere
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        // Gradient colors from center (blue) to edge (gray)
        const distFactor = Math.sqrt(
            positions[i*3]*positions[i*3] + 
            positions[i*3+1]*positions[i*3+1] + 
            positions[i*3+2]*positions[i*3+2]
        ) / radius;
        
        const color = new THREE.Color(0x3B82F6).lerp(
            new THREE.Color(0x9CA3AF), 
            distFactor * 0.8
        );
colors[i*3] = color.r;
        colors[i*3+1] = color.g;
        colors[i*3+2] = color.b;
        // Smaller sizes for star-like effect
        sizes[i] = 0.5 + Math.random() * 1.5 * (1 - distFactor);
}
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    // Star-like particle material
    const particleMaterial = new THREE.PointsMaterial({
        size: 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        fog: false,
        map: createCircleTexture(),
        alphaTest: 0.01,
        depthWrite: false
    });
// Store original positions for animation reference
    particles.userData = { originalPositions: positions.slice() };
const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Create additional vortexes
    const createVortex = (x, y, z, size, color1, color2) => {
        const vortexParticles = new THREE.BufferGeometry();
        const vPositions = new Float32Array(particleCount * 3);
        const vColors = new Float32Array(particleCount * 3);
        const vSizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            
            vPositions[i * 3] = size * Math.sin(phi) * Math.cos(theta) + x;
            vPositions[i * 3 + 1] = size * Math.sin(phi) * Math.sin(theta) + y;
            vPositions[i * 3 + 2] = size * Math.cos(phi) + z;
            
            const distFactor = Math.sqrt(
                Math.pow(vPositions[i*3]-x, 2) + 
                Math.pow(vPositions[i*3+1]-y, 2) + 
                Math.pow(vPositions[i*3+2]-z, 2)
            ) / size;
            
            const color = new THREE.Color(color1).lerp(
                new THREE.Color(color2), 
                distFactor * 0.8
            );
            
            vColors[i*3] = color.r;
            vColors[i*3+1] = color.g;
            vColors[i*3+2] = color.b;
            
            vSizes[i] = 0.3 + Math.random() * 1.2 * (1 - distFactor);
        }
        
        vortexParticles.setAttribute('position', new THREE.BufferAttribute(vPositions, 3));
        vortexParticles.setAttribute('color', new THREE.BufferAttribute(vColors, 3));
        vortexParticles.setAttribute('size', new THREE.BufferAttribute(vSizes, 1));
        
        vortexParticles.userData = {
            originalPositions: vPositions.slice(),
            center: new THREE.Vector3(x, y, z),
            size: size,
            speed: 0.3 + Math.random() * 0.7
        };
        
        const vortexSystem = new THREE.Points(vortexParticles, particleMaterial);
        scene.add(vortexSystem);
        return vortexSystem;
    };
    // Create planetary vortexes with different color palettes
    const vortex1 = createVortex(-40, 20, -30, 8, 0xFF0000, 0xFF4500); // Red/Orange
    const vortex2 = createVortex(30, -15, -20, 6, 0x00FF00, 0x800080); // Green/Purple 
    const vortex3 = createVortex(0, -30, -40, 10, 0xFFFF00, 0x00FFFF); // Yellow/Cyan
    const vortex4 = createVortex(50, 30, -50, 12, 0xFF69B4, 0x9400D3); // Pink/Purple
    const vortex5 = createVortex(-60, -10, -60, 9, 0x00BFFF, 0x00008B); // Sky Blue/Navy
// Mouse interaction that complements the vortex
    const mouse = new THREE.Vector2();
    const mouseTarget = new THREE.Vector2();
    const mouseInfluenceRadius = 15;  // More focused influence area
    const mouseForce = 0.5;  // Balanced force that doesn't overpower vortex
    const mouseAttraction = 0.2;  // Subtler pull effect
window.addEventListener('mousemove', (e) => {
        mouseTarget.x = (e.clientX / width) * 2 - 1;
        mouseTarget.y = -(e.clientY / height) * 2 + 1;
    });
    // Animation loop with vortex motion
    let time = 0;
    const rotationSpeeds = {
        y: 0.5,  // Much faster rotation for intense vortex
        x: 0.1,
        z: 0.05
    };
function animate() {
        requestAnimationFrame(animate);
        time += 0.001;
        // Smoother but stronger mouse movement
        mouse.lerp(mouseTarget, 0.05);
// Animate main particles
        const positions = particles.attributes.position.array;
        const originalPositions = particles.userData.originalPositions;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const ox = originalPositions[i3];
            const oy = originalPositions[i3+1];
            const oz = originalPositions[i3+2];
            // Calculate mouse influence (stronger effect)
            const dx = ox - mouse.x * mouseInfluenceRadius * 10;
            const dy = oy - mouse.y * mouseInfluenceRadius * 10;
            const distanceToMouse = Math.sqrt(dx*dx + dy*dy);
            
            // Stronger mouse effect with attraction
            const mouseEffect = distanceToMouse < mouseInfluenceRadius * 10 
                ? Math.pow(1 - distanceToMouse / (mouseInfluenceRadius * 10), 3) * mouseForce 
                : 0;
            const attractEffect = distanceToMouse < mouseInfluenceRadius * 15
                ? (1 - distanceToMouse / (mouseInfluenceRadius * 15)) * mouseAttraction
                : 0;
// Vortex-like animation with spiral motion
        const t = time + i * 0.0005;
        const depthFactor = (oz + radius) / (2 * radius);
        const spiralFactor = 1 - depthFactor; // Stronger effect towards edges
        // Create planetary spiral motion
        const angle = t * 2 + i * 0.01;
        const spiralX = Math.cos(angle) * spiralFactor * 2.5;
        const spiralY = Math.sin(angle) * spiralFactor * 2.5;
const floatX = ox * 0.95 + spiralX;
        const floatY = oy * 0.95 + spiralY;
        const floatZ = oz;
        // Make stars twinkle more dramatically
        sizes[i] = (0.5 + Math.random() * 1.5) * (0.7 + Math.sin(t * 10 + i) * 0.3);
particles.attributes.size.needsUpdate = true;
// Apply enhanced mouse effects
            const targetX = floatX + (mouse.x * 10 - floatX) * mouseEffect;
            const targetY = floatY + (mouse.y * 10 - floatY) * mouseEffect;
            
            // Apply clockwise rotational force (reduced strength)
            const rotAngle = Math.atan2(floatY, floatX) + Math.PI/2;
            const rotForce = 0.05 * (1 + Math.sin(time * 2 + i * 0.01));  // Reduced from 0.1
            const rotX = Math.cos(rotAngle) * rotForce;
            const rotY = Math.sin(rotAngle) * rotForce;
            
            positions[i3] = targetX + rotX * (1 - mouseEffect * 0.5);
            positions[i3+1] = targetY + rotY * (1 - mouseEffect * 0.5);
            positions[i3+2] = floatZ + (mouseEffect * 5 - floatZ) * attractEffect * 0.1;  // Reduced from 0.2
}
particles.attributes.position.needsUpdate = true;
        // Animate main vortex
        const pulse = 1 + Math.sin(time * 2) * 0.1;
        particleSystem.rotation.y = time * rotationSpeeds.y * pulse;
        particleSystem.rotation.x = time * rotationSpeeds.x * pulse;
        particleSystem.rotation.z = time * rotationSpeeds.z * pulse;
        particleSystem.scale.set(pulse, pulse, pulse);
        // Animate planetary vortexes with different behaviors
        if (vortex1) { // Red/Orange - faster, more erratic
vortex1.rotation.y = time * 0.6;
            vortex1.rotation.x = time * 0.25;
            vortex1.scale.set(1 + Math.sin(time * 3.5) * 0.08, 1 + Math.sin(time * 3.5) * 0.08, 1 + Math.sin(time * 3.5) * 0.08);
        }
        if (vortex2) { // Green/Purple - slower, majestic
vortex2.rotation.y = time * -0.2;
            vortex2.rotation.x = time * 0.1;
            vortex2.scale.set(1 + Math.cos(time * 1.8) * 0.1, 1 + Math.cos(time * 1.8) * 0.1, 1 + Math.cos(time * 1.8) * 0.1);
        }
        if (vortex3) { // Yellow/Cyan - medium speed with pulsing
            vortex3.rotation.y = time * 0.4;
            vortex3.rotation.z = time * 0.05;
            vortex3.scale.set(1 + Math.sin(time * 2) * 0.06, 1 + Math.sin(time * 2) * 0.06, 1 + Math.sin(time * 2) * 0.06);
        }
        if (vortex4) { // Pink/Purple - slow, elegant rotation with pulsing
            vortex4.rotation.y = time * -0.3;
            vortex4.rotation.x = time * 0.2;
            vortex4.scale.set(1 + Math.sin(time * 1.5) * 0.1, 1 + Math.sin(time * 1.5) * 0.1, 1 + Math.sin(time * 1.5) * 0.1);
        }
        if (vortex5) { // Blue/Navy - fast, dynamic rotation
            vortex5.rotation.y = time * 0.7;
            vortex5.rotation.z = time * 0.1;
            vortex5.scale.set(1 + Math.cos(time * 2.5) * 0.08, 1 + Math.cos(time * 2.5) * 0.08, 1 + Math.cos(time * 2.5) * 0.08);
        }
// Animate space dust
        dustParticles.rotation.y += 0.0005;
        dustParticles.rotation.x += 0.0003;
renderer.render(scene, camera);
    }
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
    // Initialize particle text
    initParticleText();
    function initParticleText() {
        const canvas = document.getElementById('particle-text');
        const ctx = canvas.getContext('2d');
        const container = document.getElementById('particle-text-container');
        const isMobile = window.innerWidth < 768;
        
        // Set canvas size
        function resizeCanvas() {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Mobile fallback - simple text
        if (isMobile) {
            function drawSimpleText() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.font = '900 48px Montserrat';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('BOLSILLO', canvas.width/2, canvas.height/2);
            }
            drawSimpleText();
            window.addEventListener('resize', drawSimpleText);
            return;
        }

        // Desktop particle effect
        const text = "BOLSILLO";
        const baseFontSize = 0.15;
        const fontSize = Math.min(canvas.width * baseFontSize, 120);
        const fontFamily = 'Montserrat';
        const fontWeight = '900';
// Particle settings
        const particleSize = isMobile ? 2 : 3;
        const particleSpacing = isMobile ? 3 : 4;
        const attractionRadius = isMobile ? 50 : 100;
        const attractionForce = isMobile ? 0.7 : 0.5;
        const repulsionRadius = isMobile ? 30 : 50;
        const repulsionForce = isMobile ? 1 : 0.8;
        const friction = isMobile ? 0.2 : 0.3;
// Create particles
        let particles = [];
        
        // Draw text to get particle positions
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Get text metrics
        const textWidth = ctx.measureText(text).width;
        const textHeight = fontSize;
        
        // Create off-screen canvas to analyze text pixels
        const offscreenCanvas = document.createElement('canvas');
        const offscreenCtx = offscreenCanvas.getContext('2d');
        offscreenCanvas.width = textWidth + 20;
        offscreenCanvas.height = textHeight + 20;
        
        // Draw text on off-screen canvas
        offscreenCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        offscreenCtx.textAlign = 'center';
        offscreenCtx.textBaseline = 'middle';
        offscreenCtx.fillStyle = 'white';
        offscreenCtx.fillText(text, offscreenCanvas.width/2, offscreenCanvas.height/2);
        
        // Get pixel data and create particles
        const imageData = offscreenCtx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        const data = imageData.data;
        
        for (let y = 0; y < offscreenCanvas.height; y += particleSpacing) {
            for (let x = 0; x < offscreenCanvas.width; x += particleSpacing) {
                const index = (y * offscreenCanvas.width + x) * 4;
                if (data[index + 3] > 128) { // If pixel is not transparent
                    particles.push({
                        x: (canvas.width/2 - textWidth/2) + x,
                        y: (canvas.height/2 - textHeight/2) + y,
                        originX: (canvas.width/2 - textWidth/2) + x,
                        originY: (canvas.height/2 - textHeight/2) + y,
                        vx: 0,
                        vy: 0,
                        size: particleSize,
                        color: 'white'
                    });
                }
            }
        }
        
        // Mouse interaction
        let mouse = { x: null, y: null, isActive: false };
        // Handle both mouse and touch events
        const handlePointerMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.clientX || e.touches?.[0]?.clientX;
            const clientY = e.clientY || e.touches?.[0]?.clientY;
            
            if (clientX && clientY) {
                mouse.x = clientX - rect.left;
                mouse.y = clientY - rect.top;
                mouse.isActive = true;
            }
        };

        const handlePointerEnd = () => {
            mouse.isActive = false;
        };

        canvas.addEventListener('mousemove', handlePointerMove);
        canvas.addEventListener('touchmove', handlePointerMove, { passive: false });
        canvas.addEventListener('mouseleave', handlePointerEnd);
        canvas.addEventListener('touchend', handlePointerEnd);
// Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update particles
            particles.forEach(p => {
                // Calculate distance to mouse
                if (mouse.isActive) {
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < repulsionRadius) {
                        // Repel from mouse
                        const angle = Math.atan2(dy, dx);
                        const force = (repulsionRadius - distance) / repulsionRadius * repulsionForce;
                        p.vx += Math.cos(angle) * force;
                        p.vy += Math.sin(angle) * force;
                    }
                }
        // Attract to origin position (70x faster return)
        const ox = p.x - p.originX;
        const oy = p.y - p.originY;
        const odistance = Math.sqrt(ox * ox + oy * oy);
        
        if (odistance > 0) {
            const angle = Math.atan2(oy, ox);
            const force = Math.min(odistance, attractionRadius) / attractionRadius * (attractionForce * 20); 
            p.vx -= Math.cos(angle) * force;
            p.vy -= Math.sin(angle) * force;
        }
        
        // Apply friction (reduced to allow faster return)
        p.vx *= 0.9; // Lower friction value
        p.vy *= 0.9; // Lower friction value
// Update position
                p.x += p.vx;
                p.y += p.vy;
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }
}
