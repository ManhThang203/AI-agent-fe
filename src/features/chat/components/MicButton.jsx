import { useCallback, useRef, useState } from "react";
import { transcribeAudio } from "../api.js";

function pickRecorderMimeType() {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
  ];
  for (const t of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t)) {
      return t;
    }
  }
  return "";
}

function extensionForMime(mime) {
  if (mime.includes("webm")) return "webm";
  if (mime.includes("mp4") || mime.includes("mpeg")) return "m4a";
  return "webm";
}

/**
 * Ghi âm → STT → gọi `onTranscript` với văn bản (thường dùng để auto-gửi chat).
 * Click lần 1: bắt đầu ghi; click lần 2: dừng, upload, nhận text.
 * @param {{
 *   disabled?: boolean,
 *   onTranscript: (text: string) => void | Promise<void>,
 *   onError?: (message: string) => void,
 * }} props
 */
export function MicButton({ disabled = false, onTranscript, onError }) {
  const [phase, setPhase] = useState(/** @type {"idle"|"recording"|"busy"} */ ("idle"));
  const mediaRef = useRef(/** @type {MediaStream | null} */ (null));
  const recorderRef = useRef(/** @type {MediaRecorder | null} */ (null));
  const chunksRef = useRef(/** @type {BlobPart[]} */ ([]));

  const stopStream = useCallback(() => {
    const stream = mediaRef.current;
    if (stream) {
      for (const track of stream.getTracks()) track.stop();
    }
    mediaRef.current = null;
  }, []);

  const startRecording = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      onError?.("Trình duyệt không hỗ trợ ghi âm.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaRef.current = stream;
      chunksRef.current = [];
      const mimeType = pickRecorderMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onerror = () => {
        onError?.("Lỗi ghi âm.");
        setPhase("idle");
        stopStream();
      };

      recorder.start(200);
      setPhase("recording");
    } catch {
      onError?.("Không có quyền micro hoặc không mở được thiết bị.");
      setPhase("idle");
      stopStream();
    }
  }, [onError, stopStream]);

  const finishRecording = useCallback(async () => {
    const recorder = recorderRef.current;
    recorderRef.current = null;
    if (!recorder || recorder.state === "inactive") {
      stopStream();
      setPhase("idle");
      return;
    }

    await new Promise((resolve) => {
      recorder.addEventListener("stop", () => resolve(null), { once: true });
      recorder.stop();
    });

    stopStream();

    const mimeType = recorder.mimeType || pickRecorderMimeType() || "audio/webm";
    const blob = new Blob(chunksRef.current, { type: mimeType });
    chunksRef.current = [];

    if (blob.size < 32) {
      setPhase("idle");
      onError?.("Âm thanh quá ngắn — thử nói lâu hơn.");
      return;
    }

    const ext = extensionForMime(mimeType);
    setPhase("busy");
    try {
      const { text } = await transcribeAudio(blob, `speech.${ext}`);
      const trimmed = String(text ?? "").trim();
      if (!trimmed) {
        onError?.("Không nhận được câu nói — thử lại.");
      } else {
        await onTranscript(trimmed);
      }
    } catch (err) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String(err.message)
          : "Chuyển giọng nói thất bại.";
      onError?.(msg);
    } finally {
      setPhase("idle");
    }
  }, [onError, onTranscript, stopStream]);

  const toggle = useCallback(() => {
    if (disabled || phase === "busy") return;
    if (phase === "idle") {
      void startRecording();
    } else if (phase === "recording") {
      void finishRecording();
    }
  }, [disabled, phase, startRecording, finishRecording]);

  const isRecording = phase === "recording";
  const isBusy = phase === "busy";

  return (
    <button
      type="button"
      title={isRecording ? "Dừng và gửi" : "Nói — bấm để bắt đầu / dừng"}
      aria-pressed={isRecording}
      disabled={disabled || isBusy}
      onClick={() => toggle()}
      className={[
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-sm transition-colors",
        isRecording
          ? "animate-pulse border-red-500/60 bg-red-950/60 text-red-300"
          : "border-zinc-600 bg-zinc-800 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-700",
        disabled || isBusy ? "opacity-40" : "",
      ].join(" ")}
    >
      {isBusy ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-500 border-t-violet-400" />
      ) : (
        <MicIcon />
      )}
    </button>
  );
}

/** SVG micro — không phụ thuộc icon font */
function MicIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 006 6.92V21h2v-3.08A7 7 0 0019 11h-2z" />
    </svg>
  );
}
