"use client";

import React, { useState } from "react";
import { DotLottieReact, DotLottie } from "@lottiefiles/dotlottie-react";
import css from "./page.module.css";

const RecordPage = () => {
    const dotLottieRef = React.useRef<DotLottie | null>(null);
    const [isAnimation, setIsAnimation] = useState<boolean>(false);
    const [isFinishRecording, setIsFinishRecording] = useState<boolean>(false);

    const handleRecAnimation = () => {
        setIsFinishRecording(false);
        if (!isAnimation) {
            dotLottieRef.current?.play();
        } else {
            dotLottieRef.current?.stop();
            setIsFinishRecording(true);
        }
        setIsAnimation(!isAnimation);
    };

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
        </div>
    );
};

export default RecordPage;
