"use client";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

type Props = ImageProps & {
  fallbackSrc: string;
};

export const ImageWithFallback = ({
  src,
  fallbackSrc,
  alt,
  ...rest
}: Props) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...rest}
      alt={alt}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
};
