import S3 from 'aws-sdk/clients/s3';
import path from "path";
import * as uuid from "uuid";
import {configs} from '../constants';

const {AWS_S3_NAME, AWS_S3_REGION, AWS_S3_ACCESS_KEY, AWS_S3_SECRET_KEY} = configs;

const bucket = new S3({
    region: AWS_S3_REGION,
    accessKeyId: AWS_S3_ACCESS_KEY,
    secretAccessKey: AWS_S3_SECRET_KEY
});

class S3Service {
    public async uploadImage(file: any, itemType: string, itemId: string) {
        const {name, data, mimetype} = file;

        const uploadPath = this._fileNameBuilder(name, itemType, itemId);

        return bucket
            .upload({
                Bucket: AWS_S3_NAME as string,
                Body: data,
                Key: uploadPath,
                ContentType: mimetype,
                ACL: "public-read",
            })
            .promise();
    }

    private _fileNameBuilder(fileName: string, itemType: string, itemId: string) {
        const fileExtension = path.extname(fileName);
        return path.join(itemType, itemId, `${uuid.v4()}${fileExtension}`);
    }
}

export const s3Service = new S3Service();
