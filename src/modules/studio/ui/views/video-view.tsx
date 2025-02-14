import { FormSection } from "../sections/form-section";

interface VideoViewProps {
  videoId: string;
}

const VideoView = ({ videoId }: VideoViewProps) => {
  return (
    <div className="pt-2.5 px-4">
      <FormSection videoId={videoId} />
    </div>
  );
};

export default VideoView;
