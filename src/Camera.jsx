import { useEffect, useRef } from "react";/*useeffect-smth to happen after component o screen, useref-refers to html elem*/

function Camera() {/*camera is now a react component*/
    const videoRef = useRef(null);

    useEffect(() => {
        async function startCamera() {/*getting access to camera takes time*/
            try {
                const stream = await navigator.mediaDevices.getUserMedia({/*navigator--access to browser features,await--wait till browser gives camera stream*/
                    video: true
                });

                videoRef.current.srcObject = stream;
            } catch (error) {
                console.error("Camera access denied:", error);
            }
        }

        startCamera();
    }, []);/*[]--dependency array*/

    return (
        <div>
            <video
                            
            ref={videoRef}
            autoPlay
            playsInline
            style={{ transform: "scaleX(-1)" }}
            />
        </div>
    );
}

export default Camera;