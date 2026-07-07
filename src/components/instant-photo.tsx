type InstantPhotoProps = {
  src: string;
  alt: string;
  caption: string;
  tilt?: "left" | "right" | "none";
};

const rotationByTilt = {
  left: "-rotate-2",
  right: "rotate-2",
  none: "",
} as const;

export function InstantPhoto({
  src,
  alt,
  caption,
  tilt = "none",
}: InstantPhotoProps) {
  return (
    <span
      data-instant-photo="true"
      className={`not-prose mx-auto block w-full max-w-3xl overflow-hidden rounded-[2rem] border border-[#e7cfc9] bg-[#f6dfda] p-5 shadow-[16px_16px_0_rgba(60,17,14,0.22)] ${rotationByTilt[tilt]}`}
    >
      <span className="block overflow-hidden rounded-[1.2rem] border border-black/6 bg-white">
        <img src={src} alt={alt} className="block w-full object-cover" />
      </span>
      <span className="block px-4 pb-2 pt-5 font-mono text-lg italic tracking-[0.04em] text-[#281715]">
        {caption}
      </span>
    </span>
  );
}
