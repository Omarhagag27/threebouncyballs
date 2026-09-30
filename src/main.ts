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
    const speed = document.getElementById("speed");
    const applySpeed = document.getElementById("applySpeed");
    const warn = document.getElementById("warn");

    if (!(canvas instanceof HTMLCanvasElement) ||
        !(color instanceof HTMLInputElement) ||
        !(toggle instanceof HTMLButtonElement) ||
        !(reset instanceof HTMLButtonElement) ||
        !(status instanceof HTMLParagraphElement) ||
        !(select instanceof HTMLSelectElement) ||
        !(speed instanceof HTMLInputElement) ||
        !(applySpeed instanceof HTMLButtonElement) ||
        !(warn instanceof HTMLParagraphElement)) {
        throw new Error("Required page elements are missing");
    }

    const ctx = canvas.getContext("2d");
    if (ctx === null) {
        throw new Error("Canvas 2D is unavailable");
    }

    const initial: Circle[] = [
        { x: 80, y: 80, radius: 20, color: "#2563eb", vx: 45, vy: 80 },
        { x: 320, y: 320, radius: 20, color: "#49eb25", vx: -100, vy: -120 },
        { x: 200, y: 200, radius: 20, color: "#ebdb25", vx: 120, vy: -80 }
    ];

    let circles: Circle[] = initial.map((circle) => ({ ...circle }));
    
    let selectedIndex = 0;
    let running = true;

    const clamp = (value: number, low: number, high: number): number =>
        Math.max(low, Math.min(value, high));

    const getSelectedCircle = (): Circle | undefined =>
        circles[selectedIndex];

    const checkselectedcircle = (): void => { //checks and syncs
        const selectedCircle = getSelectedCircle();
        if (selectedCircle === undefined) {
            return;
        }

        color.value = selectedCircle.color;
        speed.value = String(Math.abs(selectedCircle.vx));
    };

    const draw = (): void => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const circle of circles) {
            ctx.fillStyle = circle.color;
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
            ctx.fill();
        }

        const selectedCircle = getSelectedCircle();
        if (selectedCircle === undefined) {
            status.textContent =
                `No circle selected | ${running ? "running" : "paused"}`;
            return;
        }

        status.textContent =
            `Circle ${selectedIndex + 1}: ` +
            `x=${selectedCircle.x.toFixed(1)}, ` +
            `y=${selectedCircle.y.toFixed(1)} | ` +
            `${running ? "running" : "paused"}`;
    };

    color.addEventListener("input", () => {
        const selectedCircle = getSelectedCircle();
        if (selectedCircle === undefined) {
            return;
        }

        selectedCircle.color = color.value;
    });

    select.addEventListener("change", () => {
        selectedIndex = Number(select.value);
        checkselectedcircle();
    });

    applySpeed.addEventListener("click", () => {
        const selectedCircle = getSelectedCircle();
        if (selectedCircle === undefined) {
            return;
        }

        const rawValue = speed.value.trim();
        const value = Number(rawValue);

        if (rawValue === "" || !Number.isFinite(value) || value < 0) {
            speed.value = String(Math.abs(selectedCircle.vx));
            warn.textContent = "invalid speed!, Enter valid speed.";
            return;
        }
        else
            warn.textContent = " ";

        const direction = selectedCircle.vx < 0 ? -1 : 1;
        selectedCircle.vx = value * direction;
    });

    toggle.addEventListener("click", () => {
        running = !running;
        toggle.textContent = running ? "Pause" : "Resume";
    });

    reset.addEventListener("click", () => {
        circles = initial.map((circle) => ({ ...circle }));
        selectedIndex = 0;
        select.value = `0`;
        running = false;
        toggle.textContent = "Resume";
        checkselectedcircle();
    });

    canvas.addEventListener("pointerdown", (event) => {
        const selectedCircle = getSelectedCircle();
        if (selectedCircle === undefined) {
            return;
        }

        const bounds = canvas.getBoundingClientRect();
        const x = (event.clientX - bounds.left) *
            canvas.width / bounds.width;
        const y = (event.clientY - bounds.top) *
            canvas.height / bounds.height;

        selectedCircle.x = clamp(x, selectedCircle.radius, canvas.width - selectedCircle.radius);
        selectedCircle.y = clamp(y, selectedCircle.radius, canvas.height - selectedCircle.radius);
    });

    let previous: number | undefined;

    const frame = (now: number): void => {
        const dt = previous === undefined? 0
            : Math.min((now - previous) / 1000, 0.05);
        previous = now;

        if (running) {
            for (const circle of circles) {
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
        }
        draw();
        requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
}
start();
export { };
