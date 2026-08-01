import { createClient } from "@supabase/supabase-js";

const bucketId = "session-notes";
const fileSizeLimit = 10 * 1024 * 1024;
const allowedMimeTypes = [
  "application/pdf",
  "image/heic",
  "image/heif",
  "image/jpeg",
  "image/png",
  "image/webp"
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase URL or service-role key.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const { data: buckets, error: listError } = await supabase.storage.listBuckets();

if (listError) {
  throw listError;
}

const options = {
  public: false,
  fileSizeLimit,
  allowedMimeTypes
};

const existingBucket = buckets.find((bucket) => bucket.id === bucketId);
const { error: setupError } = existingBucket
  ? await supabase.storage.updateBucket(bucketId, options)
  : await supabase.storage.createBucket(bucketId, options);

if (setupError) {
  throw setupError;
}

const { data: bucket, error: verifyError } = await supabase.storage.getBucket(bucketId);

if (verifyError || !bucket) {
  throw verifyError ?? new Error("The session-notes bucket could not be verified.");
}

if (bucket.public) {
  throw new Error("The session-notes bucket was created as public.");
}

if (bucket.file_size_limit !== fileSizeLimit) {
  throw new Error("The session-notes bucket has an unexpected file-size limit.");
}

const missingMimeTypes = allowedMimeTypes.filter(
  (mimeType) => !bucket.allowed_mime_types?.includes(mimeType)
);

if (missingMimeTypes.length) {
  throw new Error(`The session-notes bucket is missing MIME types: ${missingMimeTypes.join(", ")}`);
}

console.log(
  `Verified private bucket "${bucket.name}" with a ${fileSizeLimit / 1024 / 1024} MB limit and ${
    allowedMimeTypes.length
  } allowed file types.`
);
