import {useState} from 'react';
import{ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import{storage} from '../config/firebase';
import { v4 as uuidv4 } from 'uuid';

const useFirebaseStorage = () => {

    const [isUploading, setIsUploading] = useState(false);

    const uploadImages = async (folderId, images, variations) => {
        setIsUploading(true);

        const variationImages = [];
        
        variations.forEach(v => {
            if(v.image) {
                variationImages.push(v.image.file);
            }
        }) 

        const combinedImages = [...images, ...variationImages];

        const fileNames = [];

        // just try to improve performance
        const imagePromises = combinedImages.map(img => {
            const fileName = uuidv4();
            fileNames.push(fileName);
            const imgRef = ref(storage, `/products/${folderId}/${fileName}`);
            return uploadBytes(imgRef, img)
        })

        const snapshots = await Promise.all(imagePromises);

        const imageSnapshotsPromises = snapshots.map(snapshot => {
            return getDownloadURL(snapshot.ref);
        })

        let imageUrls = await Promise.all(imageSnapshotsPromises);
        imageUrls = imageUrls.map((url, index) => {
            return {
                fileName: fileNames[index],
                url
            }
        }) 
        setIsUploading(false);
        return imageUrls;

    }

    return {isUploading, uploadImages};
}

export default useFirebaseStorage;