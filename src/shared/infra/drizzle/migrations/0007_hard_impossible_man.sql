ALTER TABLE "likes" ALTER COLUMN "thread_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "reposts" ALTER COLUMN "thread_id" SET DATA TYPE uuid;