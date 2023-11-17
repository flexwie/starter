"use server";

import { BlogService } from "@/apis/blog/v1/posts_connect";
import { createClient } from "@/utils/connect";
import { revalidatePath } from "next/cache";

const blogService = createClient(BlogService)

export async function submitCreatePostForm(formData: FormData) {
	await blogService.createPost({
		title: formData.get("title") as string,
		content: formData.get("content") as string,
	})

	revalidatePath("/")
}

export async function deleteBlogPost(id:string){
	await blogService.deletePost({id})

	revalidatePath("/")
}
