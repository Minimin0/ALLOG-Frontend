import { useRef, useState } from 'react';

/**
 * 네이티브 카메라로 인증 매체(동영상)를 촬영하는 훅.
 * 구현: 숨은 <input type="file" accept="video/*" capture> 를 프로그램적으로 클릭 →
 *       기기 카메라가 동영상 모드로 열리고, 녹화 결과 파일을 objectURL로 변환해 반환.
 * (나중에 앱 내 커스텀 카메라가 필요하면 @capacitor-community/camera-preview로 이 훅 내부만 교체)
 *
 * @param {{ onCapture?: (media: {url: string, file: File, type: string}) => void }} options
 */
export function useCamera({ onCapture } = {}) {
  const inputRef = useRef(null);
  const [error, setError] = useState(null);

  const openCamera = () => {
    setError(null);
    if (!inputRef.current) return;
    inputRef.current.value = ''; // 같은 파일 재선택 허용
    inputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setError('동영상 파일이 아니에요.');
      return;
    }
    const url = URL.createObjectURL(file);
    onCapture?.({ url, file, type: file.type });
  };

  // 페이지가 렌더할 숨은 input에 그대로 스프레드한다: <input {...inputProps} />
  const inputProps = {
    ref: inputRef,
    type: 'file',
    accept: 'video/*',
    capture: 'environment', // 후면 카메라 우선
    className: 'hidden',
    onChange: handleFileChange,
  };

  return { openCamera, inputProps, error };
}
