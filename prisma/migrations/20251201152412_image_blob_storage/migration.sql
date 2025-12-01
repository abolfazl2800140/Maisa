/*
  Warnings:

  - You are about to drop the column `image_url` on the `product_images` table. All the data in the column will be lost.
  - Added the required column `image_data` to the `product_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mime_type` to the `product_images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_images" DROP COLUMN "image_url",
ADD COLUMN     "file_name" TEXT,
ADD COLUMN     "image_data" BYTEA NOT NULL,
ADD COLUMN     "mime_type" TEXT NOT NULL;
