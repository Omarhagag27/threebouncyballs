// console.log("Typescript is ready")

interface Circle {
    x: number;
    y: number;
    radius: number;
    color: string;
    vx: number;
    vy: number;
}
function start(): void {
    const canvas = document.getElementById("scene");
    const color = document.getElementById("color");
    const toggle = document.getElementById("toggle");
    const reset = document.getElementById("reset");
    const status = document.getElementById("status");
    const select = document.getElementById("selected");
    if (!(canvas instanceof HTMLCanvasElement) ||
        !(color instanceof HTMLInputElement) ||
        !(toggle instanceof HTMLButtonElement) ||
        !(reset instanceof HTMLButtonElement) ||
        !(status instanceof HTMLParagraphElement) ||
        !(select instanceof HTMLSelectElement)) {
        throw new Error("Required page elements are missing");
    }
    const ctx = canvas.getContext("2d");
    if (ctx === null) throw new Error("Canvas 2D is unavailable");
    const initial: Circle[] = [
        {x: 80, y: 180, radius: 20, color: "#2563eb", vx: 120, vy: 120}
        {x: 100, y: 100, radius: 20, color: "#49eb25", vx: 120, vy: 120}
        {x: 300, y: 200, radius: 20, color: "#ebdb25", vx: 120, vy: 120}
    ];
    const circle: Circle = { ...initial };
    let running = true;
    const clamp = (v: number, low: number, high: number): number =>
        Math.max(low, Math.min(v, high));
    const draw = (): void => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = circle.color;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
        ctx.fill();
        status.textContent =
            `x=${circle.x.toFixed(1)}, y=${circle.y.toFixed(1)} ` +
            `| ${running ? "running" : "paused"}`;
    };

    color.addEventListener("input", () => {
        circle.color = color.value;
    });
    toggle.addEventListener("click", () => {
        running = !running;
        toggle.textContent = running ? "Pause" : "Resume";
    });
    reset.addEventListener("click", () => {
        Object.assign(circle, initial);
        color.value = initial.color;
        running = false;
        toggle.textContent = "Resume";
    });
    canvas.addEventListener("pointerdown", (event) => {
        const bounds = canvas.getBoundingClientRect();
        const x = (event.clientX - bounds.left) *
            canvas.width / bounds.width;
        const y = (event.clientY - bounds.top) *
            canvas.height / bounds.height;
        circle.x = clamp(x, circle.radius, canvas.width - circle.radius);
        circle.y = clamp(y, circle.radius, canvas.height - circle.radius);
    });
    let previous: number | undefined;
    const frame = (now: number): void => {
        const dt = previous === undefined ? 0 :
            Math.min((now - previous) / 1000, 0.05);
        previous = now;
        if (running) {
            circle.x += circle.vx * dt;
            circle.y += circle.vy * dt;
            if (circle.x > canvas.width - circle.radius) {
                circle.x = canvas.width - circle.radius;
                circle.vx = -Math.abs(circle.vx);
            } else if (circle.x < circle.radius) {
                circle.x = circle.radius;
                circle.vx = Math.abs(circle.vx);
            }
            if (circle.y > canvas.height - circle.radius) {
                circle.y = canvas.height - circle.radius;
                circle.vy = -Math.abs(circle.vy);
            } else if (circle.y < circle.radius) {
                circle.y = circle.radius;
                circle.vy = Math.abs(circle.vy);
            }
        }
        draw();
        requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
}
start();
export { };
