"use client";

import React, { useState } from "react";
import { DotLottieReact, DotLottie } from "@lottiefiles/dotlottie-react";
import css from "./page.module.css";

const App = () => {
    const dotLottieRef = React.useRef<DotLottie | null>(null);
    const [isAnimation, setIsAnimation] = useState(false);

    const handleRecAnimation = () => {
        isAnimation ? dotLottieRef.current?.play() : dotLottieRef.current?.stop();
        setIsAnimation(!isAnimation);
    };

    return (
        <div className={css.page}>
            <div className={css.block}>
                <button onClick={handleRecAnimation} className={css.centralBtn}>
                    <DotLottieReact
                        width={185}
                        height={176}
                        src="/voice.json"
                        loop
                        autoplay
                        dotLottieRefCallback={(dotLottie) => {
                            dotLottieRef.current = dotLottie;
                        }}
                    />
                </button>
                <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                    <button onClick={() => dotLottieRef.current?.play()}>Play</button>
                    <button onClick={() => dotLottieRef.current?.pause()}>Pause</button>
                    <button onClick={() => dotLottieRef.current?.stop()}>Stop</button>
                    <button onClick={() => dotLottieRef.current?.setFrame(30)}>Seek to frame 30</button>
                </div>
            </div>
        </div>
    );
};

export default App;

// import React from "react";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// const App = () => {
//     const dotLottieRef = React.useRef(null);

//     return (
//         <div>
//             <DotLottieReact
//                 src="path/to/animation.lottie"
//                 loop
//                 autoplay
//                 dotLottieRefCallback={(dotLottie) => {
//                     dotLottieRef.current = dotLottie;
//                 }}
//             />
//             <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
//                 <button onClick={() => dotLottieRef.current?.play()}>Play</button>
//                 <button onClick={() => dotLottieRef.current?.pause()}>Pause</button>
//                 <button onClick={() => dotLottieRef.current?.stop()}>Stop</button>
//                 <button onClick={() => dotLottieRef.current?.setFrame(30)}>Seek to frame 30</button>
//             </div>
//         </div>
//     );
// };
