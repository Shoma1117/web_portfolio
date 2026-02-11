import Modal from "react-modal";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ModalProps = {
  isOpen: boolean;
  mdContents: string;
  closeModal: () => void;
};

//マークダウンの中身を受け取り、モーダル内で表示する
export default function MdModal({
  isOpen,
  mdContents,
  closeModal,
}: ModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      ariaHideApp={false}
      className="bg-bg-sub border border-border rounded-lg"
      overlayClassName="bg-black/50 fixed inset-0"
    >
      <button onClick={closeModal}>閉じる</button>

      <div className="prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{mdContents}</ReactMarkdown>
      </div>
    </Modal>
  );
}
