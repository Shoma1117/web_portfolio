import { WorkContents, workData } from "./workData";
import Work from "./work"; 
import fs from "fs";
import path from "path";

export default function LoadWorkContents() {
    const wc: WorkContents = {};
    //同期的にで.mdファイルを読み込み、名前と内容を紐づけたRecordを作成する
    workData.forEach(work => {
        const filePath = path.join(process.cwd(), `app/_components/works/contents/${work.slug}.md`);
        try {
            wc[work.slug] = fs.readFileSync(filePath, "utf-8");
        }
        catch {
            wc[work.slug] = "";
            console.warn(`File Not Found: ${filePath}`);
        }
    });

    return (
        <Work workContents={wc}/>
    )
}