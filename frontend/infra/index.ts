import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import * as synced from '@pulumi/synced-folder';

const bucket = new gcp.storage.Bucket('frontend-bucket', {
  location: 'US',
  website: {
    mainPageSuffix: 'index.html',
    notFoundPage: 'index.html',
  },
});

const config = new pulumi.Config();
const customDomain = config.get('customDomain');

new gcp.storage.BucketIAMMember('bucketDomainIAM', {
  bucket: bucket.name,
  role: 'roles/storage.objectViewer',
  member: 'allUsers',
});

if (customDomain) {
  console.log(
    `To configure the custom domain (${customDomain}), create a CNAME record pointing to c.storage.googleapis.com.`
  );
}

const browserFolder = new synced.GoogleCloudFolder('browser-dist', {
  bucketName: bucket.name,
  path: '../dist/feedback-hub/browser',
});

export const bucketName = bucket.url;
