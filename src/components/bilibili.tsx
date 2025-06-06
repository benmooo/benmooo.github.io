export const BiliBili = ({ url }: { url: string }) => {
  return (
    <iframe
      className="rounded-lg aspect-video w-full"
      src={`${url}&autoplay=0`}
      allowFullScreen
    />
  );
};
