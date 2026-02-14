"use client";

import Image from "next/image";
import { WorkContents, workData, WorkItem } from "./workData";
import { useState } from "react";
import MdModal from "../mdModal";

export default function Work({ workContents }: { workContents: WorkContents }) {
  const [tabState, setTabState] = useState("Web"); //WebとGameのどちらのタブを開いているか
  const [modalState, setModalState] = useState<WorkItem | null>(null); //モーダルを開いているか

  function openModal(item: WorkItem) {
    setModalState(item);
  }

  function closeModal() {
    setModalState(null);
  }

  return (
    <section className="px-8">
      <h2 className="text-heading heading-section">Works</h2>
      <p className="text-description text-supplement">制作物一覧</p>

      {/* 上部のタブ */}
      <div className="flex">
        <button
          className={`px-8 text-description
            ${tabState === "Web" ? "bg-syntax-comment" : ""}`}
          onClick={() => {
            setTabState("Web");
          }}
        >
          Web
        </button>
        <button
          className={`px-8 text-description
            ${tabState === "Game" ? "bg-syntax-string" : ""}`}
          onClick={() => {
            setTabState("Game");
          }}
        >
          Game
        </button>
      </div>

      <MdModal
        isOpen={modalState !== null}
        mdContents={modalState ? workContents[modalState?.slug] : ""}
        closeModal={closeModal}
      />

      {/* グリッド内の制作物。クリックされたらモーダル表示する */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workData
          .filter((data) => data.category === tabState)
          .map((data) => (
            <button key={data.name} onClick={() => openModal(data)}>
              <div className="flex flex-col items-center bg-bg-accent">
                <Image className="aspect-[7/4] object-cover" src={data.thumbnail} alt="" width={420} height={300} />
                <p
                  className="text-description font-bolt text-primary"
                >
                  {data.name}
                </p>
              </div>
            </button>
          ))}
      </div>
    </section>
  );
}
