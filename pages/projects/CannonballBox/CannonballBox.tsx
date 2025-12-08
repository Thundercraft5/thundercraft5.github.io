import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'

const G = -9.80665 // m/s^2
const PIXELS_PER_METER = 20 // visual scale used by the original project

export default function CannonballBox(): JSX.Element {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const ballRef = useRef<HTMLDivElement | null>(null)
    const arrowRef = useRef<HTMLDivElement | null>(null)
    const [running, setRunning] = useState(false)
    const [timeElapsed, setTimeElapsed] = useState(0)

    // parameters
    const [angle, setAngle] = useState(40)
    const [speed, setSpeed] = useState(10)
    const [mass, setMass] = useState(10)
    const [drag, setDrag] = useState(0.5)
    const [bounciness, setBounciness] = useState(0.7)
    const [startingHeight, setStartingHeight] = useState(10)

    // simulation state (meters and m/s)
    const stateRef = useRef({
        x: 0,
        y: startingHeight,
        vx: 0,
        vy: 0,
        lastTime: 0,
        t: 0,
        trail: [] as Array<{ x: number; y: number }>,
    })

    useEffect(() => {
        // reset initial position when startingHeight changes while stopped
        if (!running) {
            stateRef.current.x = 0
            stateRef.current.y = startingHeight
            stateRef.current.vx = 0
            stateRef.current.vy = 0
            setTimeElapsed(0)
        }
    }, [startingHeight, running])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        function resize() {
            const ratio = window.devicePixelRatio || 1
            const w = canvas.clientWidth || canvas.parentElement?.clientWidth || 600
            const h = canvas.clientHeight || 450
            canvas.width = Math.max(1, Math.floor(w * ratio))
            canvas.height = Math.max(1, Math.floor(h * ratio))
            const ctx = canvas.getContext('2d')
            if (ctx) ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
        }

        resize()
        window.addEventListener('resize', resize)
        return () => window.removeEventListener('resize', resize)
    }, [])

    useEffect(() => {
        let rafId: number | null = null

        function frame(now: number) {
            const st = stateRef.current
            if (!st.lastTime) st.lastTime = now
            const dt = (now - st.lastTime) / 1000 // seconds
            st.lastTime = now

            // Integrate physics
            if (running) {
                // set initial velocities when starting from zero
                if (st.t === 0 && st.vx === 0 && st.vy === 0) {
                    const rad = (angle * Math.PI) / 180
                    st.vx = speed * Math.cos(rad)
                    st.vy = speed * Math.sin(rad)
                }

                // compute drag acceleration magnitude and direction
                const vtot = Math.sqrt(st.vx * st.vx + st.vy * st.vy) || 1e-6
                const dragAccMag = (-drag * vtot) / Math.max(1e-6, mass) // negative value
                const ax = (dragAccMag * (st.vx / vtot))
                const ay = (dragAccMag * (st.vy / vtot)) + G

                // Euler integration
                st.vx += ax * dt
                st.vy += ay * dt
                st.x += st.vx * dt
                st.y += st.vy * dt

                st.t += dt
                setTimeElapsed(prev => prev + dt)

                // collisions / bounces with ground (y = 0)
                if (st.y <= 0) {
                    st.y = 0
                    st.vy = -st.vy * bounciness
                    // small threshold to stop
                    if (Math.abs(st.vy) < 0.01) st.vy = 0
                }

                // collisions with vertical walls (left/right)
                const canvas = canvasRef.current
                if (canvas) {
                    const boxWidthPx = canvas.clientWidth
                    const maxXMeters = Math.max(0, boxWidthPx / PIXELS_PER_METER)
                    if (st.x * PIXELS_PER_METER > boxWidthPx) {
                        st.x = maxXMeters - 0.1
                        st.vx = -st.vx * bounciness
                    } else if (st.x < 0 && st.t > 0.001) {
                        st.x = 0.1
                        st.vx = -st.vx * bounciness
                    }
                }
            }

            draw()
            rafId = requestAnimationFrame(frame)
        }

        function draw() {
            const canvas = canvasRef.current
            if (!canvas) return
            const ctx = canvas.getContext('2d')
            if (!ctx) return

            // clear
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const boxWidthPx = canvas.clientWidth
            const boxHeightPx = canvas.clientHeight

            // draw grid markers lightly (optional)
            ctx.fillStyle = 'rgba(0,0,0,0.08)'
            // draw path point
            const px = stateRef.current.x * PIXELS_PER_METER
            const py = stateRef.current.y * PIXELS_PER_METER

            const drawX = px
            const drawY = boxHeightPx - py

            // push to trail (store points in pixel coords)
            const trail = stateRef.current.trail
            trail.push({ x: drawX, y: drawY })
            const TRAIL_MAX = 600
            if (trail.length > TRAIL_MAX) trail.splice(0, trail.length - TRAIL_MAX)

            // draw trail
            ctx.fillStyle = 'rgba(0,0,0,0.15)'
            for (let i = 0; i < trail.length; i++) {
                const p = trail[i]
                const alpha = Math.max(0.05, (i / trail.length) * 0.6)
                ctx.fillStyle = `rgba(0,0,0,${alpha})`
                ctx.fillRect(p.x - 2, p.y - 2, 4, 4)
            }

            // draw current point
            ctx.fillStyle = 'rgba(0,0,0,0.9)'
            ctx.fillRect(drawX - 3, drawY - 3, 6, 6)

            // update the floating .parabolicBall div for the visible ball
            if (ballRef.current) {
                // constrain within container so it doesn't go off-screen
                const ballWidth = ballRef.current.offsetWidth || 40
                const ballHeight = ballRef.current.offsetHeight || 40
                const leftPx = Math.max(0, Math.min(px, boxWidthPx - ballWidth))
                const bottomPx = Math.max(0, Math.min(py, boxHeightPx - ballHeight))

                ballRef.current.style.left = `${leftPx}px`
                // position from bottom (CSS expects bottom)
                ballRef.current.style.bottom = `${bottomPx}px`
            }

            // update the directional arrow
            if (arrowRef.current) {
                const st = stateRef.current
                const isPrelaunch = !running || st.t === 0

                const arrowW = arrowRef.current.offsetWidth || 100
                const arrowH = arrowRef.current.offsetHeight || 70

                if (isPrelaunch) {
                    // show arrow at launch position and angle (based on controls)
                    arrowRef.current.style.display = ''
                    // use current `angle` state for launch direction
                    arrowRef.current.style.transform = `rotate(${-angle}deg)`

                    // position at initial x (0) and configured starting height
                    const launchPxX = 0
                    const launchPxY = startingHeight * PIXELS_PER_METER

                    const arrowLeft = Math.max(0, Math.min(launchPxX - arrowW / 2, boxWidthPx - arrowW))
                    const arrowBottom = Math.max(0, Math.min(launchPxY - arrowH / 2, boxHeightPx - arrowH))

                    arrowRef.current.style.left = `${arrowLeft}px`
                    arrowRef.current.style.bottom = `${arrowBottom}px`
                } else {
                    // in-flight: point along instantaneous velocity vector
                    const vx = st.vx
                    const vy = st.vy
                    const vtot = Math.sqrt(vx * vx + vy * vy)

                    if (vtot < 0.01) {
                        arrowRef.current.style.display = 'none'
                    } else {
                        arrowRef.current.style.display = ''
                        const angleRad = Math.atan2(vy, vx)
                        const angleDeg = (angleRad * 180) / Math.PI
                        arrowRef.current.style.transform = `rotate(${-angleDeg}deg)`

                        // position the arrow near the moving ball
                        const arrowLeft = Math.max(0, Math.min(drawX - arrowW / 2, boxWidthPx - arrowW))
                        const arrowBottom = Math.max(0, Math.min(py - arrowH / 2, boxHeightPx - arrowH))

                        arrowRef.current.style.left = `${arrowLeft}px`
                        arrowRef.current.style.bottom = `${arrowBottom}px`
                    }
                }
            }
        }

        rafId = requestAnimationFrame(frame)
        return () => {
            if (rafId) cancelAnimationFrame(rafId)
        }
    }, [running, angle, speed, mass, drag, bounciness])

    function start() {
        // initialize state for a fresh start
        const st = stateRef.current
        st.x = 0
        st.y = startingHeight
        st.vx = 0
        st.vy = 0
        st.lastTime = 0
        st.t = 0
        setTimeElapsed(0)
        setRunning(true)
    }

    function pause() {
        setRunning(false)
    }

    function reset() {
        const st = stateRef.current
        st.x = 0
        st.y = startingHeight
        st.vx = 0
        st.vy = 0
        st.lastTime = 0
        st.t = 0
        setTimeElapsed(0)
        setRunning(false)
        // clear canvas
        const canvas = canvasRef.current
        if (canvas) {
            const ctx = canvas.getContext('2d')
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
    }

    // readouts computed from stateRef
    const readout = {
        height: stateRef.current.y.toFixed(2),
        distance: stateRef.current.x.toFixed(2),
        velX: stateRef.current.vx.toFixed(2),
        velY: stateRef.current.vy.toFixed(2),
    }

    return (
        <div className={styles['parabolicBallProjectWrapper']}>
            <div className={styles['parabolicBallProject']}>
                <div className={styles['controlPanel']}>
                    <div className={styles['buttons']}>
                        <button onClick={start}>Start</button>
                        <button onClick={pause}>Stop</button>
                        <button onClick={reset}>Reset</button>
                    </div>

                    <div className={styles['parameters']}>
                        <span className={styles['input-wrapper']}>
                            <label htmlFor="angle-input">Angle (in degrees)</label>
                            <input id="angle-input" type="number" min={-360} max={360} value={angle} onChange={e => setAngle(Number(e.target.value))} />
                        </span>

                        <span className={styles['input-wrapper']}>
                            <label htmlFor="speed-input">Speed (in m/s)</label>
                            <input id="speed-input" type="number" min={0} value={speed} onChange={e => setSpeed(Number(e.target.value))} />
                        </span>

                        <span className={styles['input-wrapper']}>
                            <label htmlFor="mass-input">Mass (in kg)</label>
                            <input id="mass-input" type="number" min={0.01} step={0.1} value={mass} onChange={e => setMass(Number(e.target.value))} />
                        </span>

                        <span className={styles['input-wrapper']}>
                            <label htmlFor="drag-input">Drag coefficient</label>
                            <input id="drag-input" type="number" min={0} max={10} step={0.01} value={drag} onChange={e => setDrag(Number(e.target.value))} />
                        </span>

                        <span className={styles['input-wrapper']}>
                            <label htmlFor="bounciness-input">Bounciness (1 = No speed loss)</label>
                            <input id="bounciness-input" type="number" min={0} max={5} step={0.01} value={bounciness} onChange={e => setBounciness(Number(e.target.value))} />
                        </span>

                        <span className={styles['input-wrapper']}>
                            <label htmlFor="starting-height-input">Starting Height (in meters)</label>
                            <input id="starting-height-input" type="number" min={0} value={startingHeight} onChange={e => setStartingHeight(Number(e.target.value))} />
                        </span>
                    </div>

                    <div className={styles['readout']}>
                        <div className={styles['time']}>Time elapsed: {timeElapsed.toFixed(2)}s</div>
                        <div className={styles['height']}>Height: {readout.height}m</div>
                        <div className={styles['dist']}>Distance: {readout.distance}m</div>
                        <div className={styles['vel-x']}>X velocity: {readout.velX}m/s</div>
                        <div className={styles['vel-y']}>Y velocity: {readout.velY}m/s</div>
                    </div>
                </div>

                <div className={styles['gridWrapper']}>
                    <div ref={ballRef} className={styles['parabolicBall']}></div>
                    <div className={styles['directionalArrow']}></div>
                    <canvas ref={canvasRef} className={styles['markerCanvas']} />

                    <table className={styles['grid']} data-y={10} data-x={100} data-interval={1}></table>
                </div>
            </div>
        </div>
    )
}
