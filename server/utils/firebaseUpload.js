// import { getStorageBucket } from '../config/firebase.js';

// export const uploadToFirebase = async (file, folder = 'uploads') => {
//   try {
//     const bucket = getStorageBucket();
//     const fileName = `${folder}/${Date.now()}-${file.originalname}`;
//     const fileUpload = bucket.file(fileName);

//     await fileUpload.save(file.buffer, {
//       metadata: {
//         contentType: file.mimetype,
//       },
//     });

//     await fileUpload.makePublic();
//     const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
//     return publicUrl;
//   } catch (error) {
//     console.error('Firebase upload error:', error);
//     throw new Error('Failed to upload file to Firebase');
//   }
// };

// export const deleteFromFirebase = async (fileUrl) => {
//   try {
//     const bucket = getStorageBucket();
//     const fileName = fileUrl.split('/').pop();
//     const file = bucket.file(fileName);
//     await file.delete();
//   } catch (error) {
//     console.error('Firebase delete error:', error);
//     // Don't throw - file might not exist
//   }
// };
