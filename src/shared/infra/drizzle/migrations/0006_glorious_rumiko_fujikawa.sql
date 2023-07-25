CREATE TABLE IF NOT EXISTS "likes" (
	"user_id" text NOT NULL,
	"thread_id" text NOT NULL,
	"deleted_at" date,
	"created_at" date DEFAULT now() NOT NULL,
	CONSTRAINT likes_user_id_thread_id PRIMARY KEY("user_id","thread_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reposts" (
	"user_id" text NOT NULL,
	"thread_id" text NOT NULL,
	"deleted_at" date,
	"created_at" date DEFAULT now() NOT NULL,
	CONSTRAINT reposts_user_id_thread_id PRIMARY KEY("user_id","thread_id")
);
--> statement-breakpoint
ALTER TABLE "threads" DROP CONSTRAINT "threads_parentId_threads_id_fk";
--> statement-breakpoint
ALTER TABLE "threads" DROP CONSTRAINT "threads_repostId_threads_id_fk";
--> statement-breakpoint
ALTER TABLE "threads" DROP CONSTRAINT "threads_authorId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "threads" ADD COLUMN "likes_counter" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "threads" ADD COLUMN "parent_id" uuid;--> statement-breakpoint
ALTER TABLE "threads" ADD COLUMN "author_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "threads" ADD COLUMN "deleted_at" date;--> statement-breakpoint
ALTER TABLE "threads" ADD COLUMN "created_at" date DEFAULT now() NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "threads" ADD CONSTRAINT "threads_parent_id_threads_id_fk" FOREIGN KEY ("parent_id") REFERENCES "threads"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "threads" ADD CONSTRAINT "threads_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "threads" DROP COLUMN IF EXISTS "status";--> statement-breakpoint
ALTER TABLE "threads" DROP COLUMN IF EXISTS "parentId";--> statement-breakpoint
ALTER TABLE "threads" DROP COLUMN IF EXISTS "repostId";--> statement-breakpoint
ALTER TABLE "threads" DROP COLUMN IF EXISTS "authorId";--> statement-breakpoint
ALTER TABLE "threads" DROP COLUMN IF EXISTS "createdAt";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likes" ADD CONSTRAINT "likes_thread_id_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "threads"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reposts" ADD CONSTRAINT "reposts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reposts" ADD CONSTRAINT "reposts_thread_id_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "threads"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
