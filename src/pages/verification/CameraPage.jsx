import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useVerificationStore } from '@/stores/verificationStore.js';

// 동영상 촬영 화면 — 진짜 카메라(getUserMedia) 라이브 프리뷰 + MediaRecorder로 3초 실제 녹화.
// 점 3개가 1초마다 왼쪽부터 초록으로. 녹화 완료 → 미리보기.
// 주의: getUserMedia는 보안 컨텍스트(localhost/HTTPS/Capacitor)에서만 동작.
export default function CameraPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const setMedia = useVerificationStore((s) => s.setMedia);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [progress, setProgress] = useState(0); // 초록으로 켜진 점 (0~3)
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState(null);

  // 카메라 시작
  useEffect(() => {
    let active = true;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then((stream) => {
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setError('카메라를 사용할 수 없어요. 권한을 확인해주세요.'));

    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // 녹화 진행 (3초 카운트다운 → 정지)
  useEffect(() => {
    if (!recording) return;
    if (progress >= 3) {
      recorderRef.current?.stop();
      return;
    }
    const timer = setTimeout(() => setProgress((p) => p + 1), 1000);
    return () => clearTimeout(timer);
  }, [recording, progress]);

  const startRecording = () => {
    const stream = streamRef.current;
    if (!stream || recording) return;

    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
      if (e.data.size) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'video/webm' });
      const url = URL.createObjectURL(blob);
      setMedia({ url, blob, type: 'video' });
      navigate(`/group/${groupId}/verify/preview`);
    };
    recorderRef.current = recorder;
    recorder.start();
    setProgress(0);
    setRecording(true);
  };

  return (
    <div className="flex min-h-full flex-col bg-black py-8">
      {/* 녹화 진행 점 3개 */}
      <div className="flex justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              i < progress ? 'bg-[#3ddc84]' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* 라이브 카메라 프리뷰 */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full overflow-hidden rounded-[44px]">
          {error ? (
            <div className="flex aspect-[3/4] items-center justify-center bg-white/10 px-6 text-center text-caption text-white/70">
              {error}
            </div>
          ) : (
            <video ref={videoRef} autoPlay muted playsInline className="aspect-[3/4] w-full object-cover" />
          )}
        </div>
      </div>

      {/* 촬영 버튼 */}
      <div className="flex justify-center pb-2">
        <button
          onClick={startRecording}
          disabled={recording || !!error}
          aria-label="촬영"
          className="h-16 w-16 rounded-full bg-white ring-4 ring-white/40 disabled:opacity-70"
        />
      </div>
    </div>
  );
}
