import { BlobServiceClient } from "@azure/storage-blob";
import "dotenv/config";

const azure_connection_string = process.env.AZURE_CONNECTION_STRING;
const account_name = process.env.AZURE_ACCOUNT;
const azure_blob_uri = process.env.AZURE_BLOB_ENDPOINT;

async function uploadToBlobStorage(blobName, file, container_name) {
  const blobServiceClient = new BlobServiceClient(azure_connection_string);
  const containerClient = blobServiceClient.getContainerClient(container_name);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadFile(file);

  return blockBlobClient.url;
}

export async function uploadProfileImage(userId, filePath, blobName) {
  const blobWithFolder = `profile-images/${userId}/${blobName}`;
  await uploadToBlobStorage(blobWithFolder, filePath, "isyaratku");

  return `https://${account_name}.blob.core.windows.net/isyaratku/isyaratku/${blobWithFolder}`;
}

export async function uploadLessonVideo(courseId, title, filePath, blobName) {
  const blobWithFolder = `course-videos/${courseId}/${title}/${blobName}`;
  await uploadToBlobStorage(blobWithFolder, filePath, "isyaratku");

  return `https://${account_name}.blob.core.windows.net/isyaratku/isyaratku/${blobWithFolder}`;
}

export async function uploadCourseImage(courseId, filePath, blobName) {
  const blobWithFolder = `course-videos/${courseId}/${blobName}`;
  await uploadToBlobStorage(blobWithFolder, filePath, "isyaratku");

  return `https://${account_name}.blob.core.windows.net/isyaratku/isyaratku/${blobWithFolder}`;
}

// ? Idk napa, url e gk kedetect tros, dah malas
// export async function deleteBlob(blobName, courseId) {
//   const blobServiceClient = new BlobServiceClient(azure_connection_string);
//   const containerClient = blobServiceClient.getContainerClient("isyaratku");

//   try {
//     const blobs = containerClient.listBlobsFlat({
//       prefix: "isyaratku/course-videos/67696c95f4c9c1cb71ad9d3c",
//     });

//     for await (const blob of blobs) {
//       console.log(blob.name);
//     }
//   } catch (error) {
//     console.error("Error deleting blob:", error.message);
//     throw error;
//   }
// }
