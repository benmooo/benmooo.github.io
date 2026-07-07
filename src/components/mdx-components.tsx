import type { ComponentPropsWithoutRef } from "react";

import { BiliBili } from "~/components/bilibili";
import { InstantPhoto } from "~/components/instant-photo";

type Options = {
  isEssay: boolean;
  title: string;
};

function StandardImage(props: ComponentPropsWithoutRef<"img">) {
  return (
    <img
      {...props}
      alt={props.alt ?? ""}
      className="my-10 w-full rounded-[1.5rem] border border-black/8 bg-white object-cover shadow-[0_18px_48px_rgba(18,18,18,0.08)]"
    />
  );
}

export function createMdxComponents({ isEssay, title }: Options) {
  return {
    BiliBili,
    img: (props: ComponentPropsWithoutRef<"img">) => {
      if (typeof props.src !== "string" || props.src.length === 0) {
        return null;
      }

      if (isEssay) {
        return (
          <InstantPhoto
            src={props.src}
            alt={props.alt ?? title}
            caption={props.alt ?? "Captured on the way home"}
            tilt="right"
          />
        );
      }

      return <StandardImage {...props} />;
    },
  };
}
