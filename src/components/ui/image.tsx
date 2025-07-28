import React from "react";

export function Image(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      {...props}
      className="rounded-lg w-full object-cover my-4"
      loading="lazy"
    />
  );
}
