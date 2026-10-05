import { useEffect, useRef, useState } from "react";/*useeffect-smth to happen after component o screen, useref-refers to html elem*/

function Camera() {/*camera is now a react component*/
    const videoRef = useRef(null);
    const [photo, setPhoto] = useState(null);

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

    function capturePhoto() {
    const video = videoRef.current;

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.translate(canvas.width, 0);
    context.scale(-1, 1);

    context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    const image = canvas.toDataURL("image/png");

    setPhoto(image);
}

    return (
    <div>
        <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ transform: "scaleX(-1)" }}
        />

        <button onClick={capturePhoto}>
            click
        </button>

        {photo && (
            <img
                src={photo}
                alt="Captured"
            />
        )}
    </div>
);
}

export default Camera;