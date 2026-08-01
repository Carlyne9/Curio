"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileImage, FileText, LoaderCircle, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export type NoteAttachment = {
  id: string;
  storagePath: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
};

type HandwrittenNoteUploadProps = {
  attachments: NoteAttachment[];
  sessionId: string;
};

const maxFileSize = 10 * 1024 * 1024;
const allowedMimeTypes = new Set([
  "application/pdf",
  "image/heic",
  "image/heif",
  "image/jpeg",
  "image/png",
  "image/webp"
]);

const mimeTypeByExtension: Record<string, string> = {
  heic: "image/heic",
  heif: "image/heif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  pdf: "application/pdf",
  png: "image/png",
  webp: "image/webp"
};

function resolveMimeType(file: File) {
  if (allowedMimeTypes.has(file.type)) {
    return file.type;
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return mimeTypeByExtension[extension] ?? "";
}

function safeFileName(fileName: string) {
  return fileName
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function formatFileSize(sizeBytes: number) {
  return `${(sizeBytes / 1024 / 1024).toFixed(1)} MB`;
}

export function HandwrittenNoteUpload({
  attachments,
  sessionId
}: HandwrittenNoteUploadProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = useMemo(() => createClient(), []);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadSignedUrls() {
      const entries = await Promise.all(
        attachments.map(async (attachment) => {
          const { data } = await supabase.storage
            .from("session-notes")
            .createSignedUrl(attachment.storagePath, 60 * 60);

          return [attachment.id, data?.signedUrl ?? ""] as const;
        })
      );

      if (isCurrent) {
        setSignedUrls(Object.fromEntries(entries));
      }
    }

    void loadSignedUrls();
    return () => {
      isCurrent = false;
    };
  }, [attachments, supabase]);

  async function uploadFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    const preparedFiles = files.map((file) => ({
      file,
      mimeType: resolveMimeType(file)
    }));
    const invalidType = preparedFiles.find(({ mimeType }) => !allowedMimeTypes.has(mimeType));
    const oversizedFile = preparedFiles.find(({ file }) => file.size > maxFileSize);

    if (invalidType) {
      setStatus(`${invalidType.file.name} is not a supported image or PDF.`);
      event.target.value = "";
      return;
    }

    if (oversizedFile) {
      setStatus(`${oversizedFile.file.name} is larger than 10 MB.`);
      event.target.value = "";
      return;
    }

    setIsUploading(true);
    setStatus("Preparing your handwritten notes…");

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setStatus("Your session expired. Log in again before uploading.");
      setIsUploading(false);
      return;
    }

    for (const [index, preparedFile] of preparedFiles.entries()) {
      const cleanedName = safeFileName(preparedFile.file.name) || "handwritten-note";
      const storagePath = `${user.id}/${sessionId}/${crypto.randomUUID()}-${cleanedName}`;
      setStatus(`Uploading page ${index + 1} of ${preparedFiles.length}…`);

      const { error: uploadError } = await supabase.storage
        .from("session-notes")
        .upload(storagePath, preparedFile.file, {
          contentType: preparedFile.mimeType,
          upsert: false
        });

      if (uploadError) {
        setStatus(`Could not upload ${preparedFile.file.name}.`);
        setIsUploading(false);
        event.target.value = "";
        return;
      }

      const { error: metadataError } = await supabase.from("note_attachments").insert({
        session_id: sessionId,
        storage_path: storagePath,
        file_name: preparedFile.file.name,
        mime_type: preparedFile.mimeType,
        size_bytes: preparedFile.file.size
      });

      if (metadataError) {
        await supabase.storage.from("session-notes").remove([storagePath]);
        setStatus(`Could not save ${preparedFile.file.name} to this session.`);
        setIsUploading(false);
        event.target.value = "";
        return;
      }
    }

    event.target.value = "";
    setStatus(`${preparedFiles.length} handwritten note${preparedFiles.length === 1 ? "" : "s"} saved.`);
    setIsUploading(false);
    router.refresh();
  }

  async function deleteAttachment(attachment: NoteAttachment) {
    setDeletingId(attachment.id);
    setStatus(`Removing ${attachment.fileName}…`);

    const { error: storageError } = await supabase.storage
      .from("session-notes")
      .remove([attachment.storagePath]);

    if (storageError) {
      setStatus(`Could not remove ${attachment.fileName}.`);
      setDeletingId(null);
      return;
    }

    const { error: metadataError } = await supabase
      .from("note_attachments")
      .delete()
      .eq("id", attachment.id);

    if (metadataError) {
      setStatus("The file was removed, but its session record could not be cleared.");
      setDeletingId(null);
      return;
    }

    setStatus(`${attachment.fileName} removed.`);
    setDeletingId(null);
    router.refresh();
  }

  return (
    <section className="rounded-[1.5rem] border bg-muted/50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold">Handwritten notes</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add photos or a PDF. Each file stays private to this session.
          </p>
        </div>
        <Button
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          type="button"
          variant="secondary"
        >
          {isUploading ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Upload className="mr-2 h-4 w-4" aria-hidden="true" />
          )}
          Upload pages
        </Button>
        <input
          accept=".heic,.heif,.jpeg,.jpg,.pdf,.png,.webp,application/pdf,image/heic,image/heif,image/jpeg,image/png,image/webp"
          className="sr-only"
          disabled={isUploading}
          multiple
          onChange={uploadFiles}
          ref={fileInputRef}
          type="file"
        />
      </div>

      {attachments.length ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {attachments.map((attachment) => {
            const signedUrl = signedUrls[attachment.id];
            const isImage = attachment.mimeType.startsWith("image/");

            return (
              <article className="overflow-hidden rounded-2xl border bg-card" key={attachment.id}>
                <a
                  className="block"
                  href={signedUrl || undefined}
                  rel="noreferrer"
                  target="_blank"
                >
                  {isImage && signedUrl ? (
                    <div
                      aria-label={`Preview of ${attachment.fileName}`}
                      className="aspect-[4/3] bg-cover bg-center"
                      role="img"
                      style={{ backgroundImage: `url("${signedUrl}")` }}
                    />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center bg-muted">
                      {isImage ? (
                        <FileImage className="h-10 w-10 text-primary" aria-hidden="true" />
                      ) : (
                        <FileText className="h-10 w-10 text-primary" aria-hidden="true" />
                      )}
                    </div>
                  )}
                </a>
                <div className="flex items-center justify-between gap-3 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{attachment.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(attachment.sizeBytes)}
                    </p>
                  </div>
                  <button
                    aria-label={`Remove ${attachment.fileName}`}
                    className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-destructive disabled:opacity-50"
                    disabled={deletingId === attachment.id}
                    onClick={() => deleteAttachment(attachment)}
                    type="button"
                  >
                    {deletingId === attachment.id ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      {status ? (
        <p aria-live="polite" className="mt-3 text-sm text-muted-foreground">
          {status}
        </p>
      ) : null}
    </section>
  );
}
