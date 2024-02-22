import photos, { Photo } from "@/lib/photo";
import Frame from "../../../../components/frame/Frame";
import Modal from "../../../../components/modal/Modal";

export default function PhotoModal({ params: { id: photoId } }: { params: { id: string } }) {
  const photo: Photo = photos.find((p) => p.id === photoId)!;

  return (
    <Modal>
      <Frame photo={photo} />
    </Modal>
  );
}
