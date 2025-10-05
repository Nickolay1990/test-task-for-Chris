"use client";

import React, { useEffect, useRef, useState } from "react";
import { DotLottieReact, DotLottie } from "@lottiefiles/dotlottie-react";
import css from "./page.module.css";

const RecordPage = () => {
    const dotLottieRef = React.useRef<DotLottie | null>(null);
    const [isAnimation, setIsAnimation] = useState<boolean>(false);
    const [isFinishRecording, setIsFinishRecording] = useState<boolean>(false);
    const [stream, setStream] = useState<MediaRecorder | null>(null);
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

        analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

        ctx.fillStyle = "#383351";
        ctx.fillRect(0, 0, width, height);

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#4F4A85";
        ctx.beginPath();

        const sliceWidth = width / dataArrayRef.current.length;
        let x = 0;

        for (let i = 0; i < dataArrayRef.current.length; i++) {
            const v = dataArrayRef.current[i] / 128.0; // normalize
            const y = (v * height) / 2;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();

        animationFrameRef.current = requestAnimationFrame(drawVisualizer);
    };

    const startMicrophone = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContextRef.current = new AudioContext();
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 2048;

            dataArrayRef.current = new Uint8Array(analyserRef.current.fftSize);

            sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
            sourceRef.current.connect(analyserRef.current);

            drawVisualizer();
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError(String(err));
        }
    };

    const stopMicrophone = () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        audioContextRef.current?.close();
    };

    const handleRecAnimation = () => {
        setIsFinishRecording(false);

        if (!isAnimation) {
            dotLottieRef.current?.play();
            startMicrophone();
        } else {
            dotLottieRef.current?.stop();
            stopMicrophone();
            setIsFinishRecording(true);
        }

        setIsAnimation(!isAnimation);
    };

    // useEffect(() => {
    //     const getMicrophone = async () => {
    //         try {
    //             const userMedia = await navigator.mediaDevices.getUserMedia({ audio: true });
    //             const recorder = new MediaRecorder(userMedia);

    //             setStream(recorder);
    //         } catch (err: unknown) {
    //             if (err instanceof Error) {
    //                 setError(err.message);
    //             } else {
    //                 setError(String(err));
    //             }
    //         }
    //     };
    //     getMicrophone();
    // }, []);

    // const handleRecAnimation = () => {
    //     setIsFinishRecording(false);

    //     if (!isAnimation) {
    //         dotLottieRef.current?.play();
    //         stream?.start();
    //     } else {
    //         dotLottieRef.current?.stop();
    //         stream?.stop();

    //         setIsFinishRecording(true);
    //     }
    //     setIsAnimation(!isAnimation);
    // };

    return (
        <div className={css.page}>
            <div className={css.block}>
                <p className={css.text}>{isAnimation ? "End" : "Start"} a conversation with assistants</p>
                <button onClick={handleRecAnimation} className={`${css.centralBtn} ${isFinishRecording ? css.recorded : ""}`}>
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
            </div>
            <canvas ref={canvasRef} width={500} height={100} style={{ border: "1px solid #383351", marginTop: "20px" }} />
            {error && <p>{error}</p>}
        </div>
    );
};

export default RecordPage;
