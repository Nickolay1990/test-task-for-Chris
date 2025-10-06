"use client";

import React, { useRef, useState } from "react";
import { DotLottieReact, DotLottie } from "@lottiefiles/dotlottie-react";
import css from "./page.module.css";

const RecordPage = () => {
    const dotLottieRef = React.useRef<DotLottie | null>(null);
    const [isAnimation, setIsAnimation] = useState<boolean>(false);
    const [isFinishRecording, setIsFinishRecording] = useState<boolean>(true);
    const [error, setError] = useState("");

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const drawVisualizer = () => {
        if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        analyserRef.current.getByteFrequencyData(dataArrayRef.current);

        const dotCount = 4;
        const dotWidth = 20;
        const gap = 20;
        const totalWidth = dotCount * dotWidth + (dotCount - 1) * gap;
        const startX = (width - totalWidth) / 2;
        const centerY = height / 2;

        for (let i = 0; i < dotCount; i++) {
            const value = dataArrayRef.current[i * 10];
            const normalized = value / 255;

            const width = 20;
            const minHeight = 20;
            const maxHeight = 60;
            const height = minHeight + normalized * (maxHeight - minHeight);

            const radius = 10;

            const x = startX + i * (dotWidth + gap);
            const y = centerY - height / 2;

            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(x, y, width, height, radius);
            } else {
                const r = radius;
                ctx.moveTo(x + r, y);
                ctx.lineTo(x + width - r, y);
                ctx.quadraticCurveTo(x + width, y, x + width, y + r);
                ctx.lineTo(x + width, y + height - r);
                ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
                ctx.lineTo(x + r, y + height);
                ctx.quadraticCurveTo(x, y + height, x, y + height - r);
                ctx.lineTo(x, y + r);
                ctx.quadraticCurveTo(x, y, x + r, y);
            }
            ctx.fillStyle = "#9013FE";

            ctx.fill();
        }

        animationFrameRef.current = requestAnimationFrame(drawVisualizer);
    };

    const startMicrophone = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 2048;

        dataArrayRef.current = new Uint8Array(analyserRef.current.fftSize);

        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        sourceRef.current.connect(analyserRef.current);

        drawVisualizer();
    };

    const stopMicrophone = () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        audioContextRef.current?.close();
    };

    const handleRecAnimation = async () => {
        if (!isAnimation) {
            try {
                await startMicrophone();
                setIsFinishRecording(false);
                dotLottieRef.current?.play();
            } catch (err: unknown) {
                if (err instanceof Error) setError(err.message);
                else setError(String(err));
                return;
            }
        } else {
            dotLottieRef.current?.stop();
            stopMicrophone();
            setIsFinishRecording(true);
        }
        setIsAnimation(!isAnimation);
    };

    return (
        <div className={css.page}>
            <div className={css.block}>
                <p className={css.text}>{isAnimation ? "End" : "Start"} a conversation with assistants</p>

                <canvas ref={canvasRef} width={200} height={60} className={`${css.canvas} ${!isAnimation ? css.hidden : ""}`} />

                <button onClick={handleRecAnimation} className={`${css.centralBtn} ${!isFinishRecording ? css.recorded : ""}`}>
                    <DotLottieReact
                        width={185}
                        height={176}
                        src="/voice.json"
                        loop
                        autoplay={isAnimation}
                        dotLottieRefCallback={(dotLottie) => {
                            dotLottieRef.current = dotLottie;
                        }}
                        className={isFinishRecording ? css.activeAnim : ""}
                    />
                </button>
                {error && <p className={css.errorMessage}>{error}</p>}
            </div>
        </div>
    );
};

export default RecordPage;
