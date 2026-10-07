import { useEffect, useRef, useState } from "react";

const FILTERS = {
  normal: "none",
  pastel: "brightness(1.1) saturate(0.8) contrast(0.9)",
  vintage: "sepia(0.6) contrast(1.1)",
  "b&w": "grayscale(1)",
};

function Camera() {
  const videoRef = useRef(null);
  const [shots, setShots] = useState([]);
  const [count, setCount] = useState(null);
  const [filter, setFilter] = useState("normal");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let stream;
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (e) {
        console.error("Camera access denied:", e);
      }
    }
    startCamera();
    return () => stream?.getTracks().forEach((t) => t.stop()); // cleanup
  }, []);

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  function snap() {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.filter = FILTERS[filter];
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL("image/png");
  }

  async function startSession() {
    setBusy(true);
    setShots([]);
    for (let i = 0; i < 4; i++) {
      for (let n = 3; n > 0; n--) {
        setCount(n);
        await wait(1000);
      }
      setCount(null);
      setShots((prev) => [...prev, snap()]);
      await wait(400);
    }
    setBusy(false);
  }

  async function downloadStrip() {
    const imgs = await Promise.all(
      shots.map(
        (src) =>
          new Promise((res) => {
            const img = new Image();
            img.onload = () => res(img);
            img.src = src;
          })
      )
    );
    const w = 400, pad = 20;
    const h = (w * imgs[0].height) / imgs[0].width;
    const canvas = document.createElement("canvas");
    canvas.width = w + pad * 2;
    canvas.height = imgs.length * (h + pad) + pad + 50;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffd6e7"; // pink strip
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    imgs.forEach((img, i) => ctx.drawImage(img, pad, pad + i * (h + pad), w, h));
    ctx.fillStyle = "#fff";
    ctx.font = "24px 'Patrick Hand', cursive";
    ctx.textAlign = "center";
    ctx.fillText("ur booth ♡", canvas.width / 2, canvas.height - 18);

    const a = document.createElement("a");
    a.download = "photostrip.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  }

  return (
    <div className="booth">
      <div className="viewfinder">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ transform: "scaleX(-1)", filter: FILTERS[filter] }}
        />
        {count && <div className="countdown">{count}</div>}
      </div>

      <div className="filters">
        {Object.keys(FILTERS).map((f) => (
          <button
            key={f}
            className={f === filter ? "chip active" : "chip"}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <button className="snap" onClick={startSession} disabled={busy}>
        {busy ? "smile! ✿" : "take photos"}
      </button>

      {shots.length > 0 && (
        <>
          <div className="strip">
            {shots.map((s, i) => (
              <img key={i} src={s} alt={`shot ${i + 1}`} />
            ))}
          </div>
          {!busy && (
            <button className="snap" onClick={downloadStrip}>
              download strip ♡
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default Camera;