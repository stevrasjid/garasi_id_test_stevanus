import { useRef } from "react";

type uploadImageProps = {
  onChange: (...args: any[]) => void;
  className?: string;
};
export default function UploadImage(props: uploadImageProps) {
  const hiddenFileInput = useRef<any>(null);
  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = (e: any) => {
    props.onChange(e);
  };
  return (
    <>
      <button
        className={props.className ?? ""}
        type="button"
        onClick={handleClick}
      >
        Upload Image
      </button>
      <input
        type="file"
        onChange={handleChange}
        ref={hiddenFileInput}
        accept="image/jpeg,image/png,image/gif,image/jpg"
        style={{ display: "none" }}
        multiple
      />
    </>
  );
}
