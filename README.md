## Wordy-cloud, your multilingual journey.

##### Smartly and quickly add up terminology you've found for today.
##### And smartly review them to be special in the peers.

## Table of contents
* [Security](#Security)
* [Features](#Main-Features)
    * Support for any device
    * Search your data
    * Upload photos
    * Automatic formation
    * Darkmode
* [Developer](#Developer)
* [Tools](#Tools)
* [Translation](#translation-order-by-its-popularity--usage)

## Security
Our first and the most important goal is to keep your data secret so that no one, including the developers of Wordy-cloud, is not capable of reading/modifying your data. We follow how the dominating global cloud provider [AWS](https://aws.amazon.com/free) and use the exactly same encryption method [AES-256](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingServerSideEncryption.html) to prevent any security vulnerabilities.

* The following is a sample data; Encrypted data is within 'ciphertextBlob' and each data has its own rule to whom it can be accssed to.
    * ![](https://github.com/PeacefulHaru/wordy/blob/master/img/security/aes256.jpeg)

* The communication between your device and our server is protected by the advanced security protocol TLS 1.2.
    * ![](https://github.com/PeacefulHaru/wordy/blob/master/img/security/https.jpeg)


## Main Features
1. Support for any device

2. Search your data

3. Upload photos

4. Write your data, and Wordy will automatically convert into a prettier format

5. Security. Your data is encrypted using AES-256, the industry standard.
Only you can encrypt/decrpyt your data in our database.

6. Darkmode

## Developer
- Aaron Jeongwoo Kim (AJ Kim)
- Full stack programmer in Tokyo, Japan
    * Mainly uses TypeScript, Python and AWS (ECS, Lambda...)
- Born in Korea, Raised in America and Work in Japan
- Speaks 4 languages: English, Chinese, Japanese and Korean (All business+)


### Tools
- Front: React-TypeScript, Redux
- Server (Back): NodeJS, ExpressJS-TypeScript
- Database: MongoDB, AWS S3
- Security: AES-256, HTTPS, JWT, AWS Shields, SSL
- Infrastrcutre: AWS EC2, GCP, AWS Route53
- Design: Material UI

### Translation (Order by its popularity & usage)
- English: ✔️
- Chinese: Coming soon..
- Japanese: ✔️
- French: Planning..
- Korean: ✔️


### Version Goal
- v0.6: Capable of Uploading Photos & Credit system is available
     * Admin can generate code to generate free credit for trial of other members
- v0.7: Testing System implemented; much better code
- v1.0: Payment system is now available; No longer Beta
- v1.1: Encryption gets better and much faster
