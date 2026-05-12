import { Globe2 } from "lucide-react";
import type { ToolResult } from "./types";
import { getWebRetrieval, truncateText } from "./utils";

type SourceStripProps = {
  toolResult?: ToolResult;
};

export function SourceStrip({ toolResult }: SourceStripProps) {
  const retrieval = getWebRetrieval(toolResult);
  const sources = retrieval?.results?.filter((source) => source.url).slice(0, 3);

  if (!retrieval || (!sources?.length && !retrieval.error)) {
    return null;
  }

  return (
    <div className="mt-3 overflow-hidden border-l-2 border-emerald-400 bg-emerald-50 px-3 py-2 text-xs text-stone-700">
      <div className="mb-2 flex flex-wrap items-center gap-2 font-medium text-emerald-800">
        <Globe2 className="h-3.5 w-3.5" />
        <span>Web fallback</span>
        <span className="rounded-md bg-white px-2 py-0.5 text-[11px] text-stone-600">
          {retrieval.provider || "auto"}
        </span>
        {retrieval.status && (
          <span className="rounded-md bg-white px-2 py-0.5 text-[11px] text-stone-600">
            {retrieval.status}
          </span>
        )}
      </div>

      {retrieval.error ? (
        <p className="text-red-700">{retrieval.error}</p>
      ) : (
        <div className="grid gap-2">
          {sources?.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg border border-emerald-100 bg-white px-3 py-2 transition hover:border-emerald-300"
            >
              <div className="break-words font-medium text-stone-900">
                {truncateText(source.title || source.url || "Source", 72)}
              </div>
              {source.snippet && (
                <p className="mt-1 break-words leading-5 text-stone-500">
                  {truncateText(source.snippet, 150)}
                </p>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
