import Modal from "react-modal";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import 'highlight.js/styles/atom-one-dark.css'

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
      className="bg-bg-sub border-4 border-border rounded-lg max-h-[600px] overflow-y-scroll p-4" 
      overlayClassName="bg-black/50 fixed inset-0 fixed inset-0 flex items-center justify-center"
    >
      <button onClick={closeModal}>閉じる</button>

      <div className="prose prose-invert prose-pre:bg-transparent">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeHighlight]}>{mdContents}</ReactMarkdown>
      </div>
    </Modal>
  );
}
